import { ethers } from "hardhat";
import { expect } from "chai";
import { Synchronizer, UserState, schema } from '@unirep/core'
import { Identity } from "@semaphore-protocol/identity"
import { Unirep } from "@unirep/contracts";
import { deployUnirep } from "@unirep/contracts/deploy"
import { defaultProver } from '@unirep/circuits/provers/defaultProver'
import { Project, IDTToken, IPJToken } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DB, SQLiteConnector } from 'anondb/node'

describe("Project", function () {
    let unirep: Unirep;
    let project: Project;
    let idtToken: IDTToken;
    let ipjToken: IPJToken;
    let proposer: SignerWithAddress;
    let developer1: SignerWithAddress;
    let developer2: SignerWithAddress;
    let reviewer1: SignerWithAddress;
    let reviewer2: SignerWithAddress;
    let snapshot: any;

    let developer1State: UserState;
    let developer2State: UserState;

    // Deploy IDTToken, IPJToken, Unirep
    async function deployIdealContracts() {
        // Generate signers
        const [deployer] = await ethers.getSigners();

        // Deploy IDTToken
        const IDTInitialSupply = ethers.utils.parseEther("100000");
        const IDTTokenFactory = await ethers.getContractFactory("IDTToken");
        const _idtToken = await IDTTokenFactory.connect(deployer).deploy(IDTInitialSupply);
        await _idtToken.deployed();

        // Deploy IPJToken
        const IPJTokenFactory = await ethers.getContractFactory("IPJToken");
        const _ipjToken = await IPJTokenFactory.connect(deployer).deploy("IPJToken", "IPJ");
        await _ipjToken.deployed();

        return { _idtToken, _ipjToken }
    }

    before(async () => {
        const [deployer] = await ethers.getSigners();
        const _unirep = await deployUnirep(deployer);
        unirep = _unirep;
    })

    beforeEach(async () => {
        snapshot = await ethers.provider.send('evm_snapshot', [])

        // Generate signers
        let deployer: SignerWithAddress;
        [deployer, proposer, developer1, developer2, reviewer1, reviewer2] = await ethers.getSigners();

        // Deploy Ideal Contracts
        const { _idtToken, _ipjToken } = await deployIdealContracts();
        idtToken = _idtToken;
        ipjToken = _ipjToken;

        // Set config for deploy Project
        const expireTime = 60 * 60 * 24 * 2;
        const reputationThreshold = 1000;
        const proposalURL = "ipfs://QmWjQZ2Z"
        const projectName = "IdealTown"

        // Deploy Project
        const Project = await ethers.getContractFactory("Project");
        project = await Project.connect(deployer).deploy(
            projectName,
            proposer.address,
            expireTime,
            reputationThreshold,
            ipjToken.address,
            proposalURL,
            idtToken.address,
            unirep.address,
            { gasLimit: 30000000 },
        );
        await project.deployed();

        // signup attester
        await project.registerAttester(10000);
        const db: DB = await SQLiteConnector.create(schema, ":memory:");
        const synchronizer = new Synchronizer({
            db: db,
            prover: defaultProver, // a circuit prover
            unirepAddress: unirep.address,
            provider: ethers.provider
        })
        await synchronizer.start()
        await synchronizer.waitForSync()
        developer1State = new UserState(synchronizer, new Identity("developer1"))
        developer2State = new UserState(synchronizer, new Identity("developer2"))

        // signup user
        const signupProof1 = await developer1State.genUserSignUpProof()
        const signupProof2 = await developer2State.genUserSignUpProof()

        await project.connect(developer1).registerDeveloper(signupProof1.publicSignals, signupProof1.proof,);
        await project.connect(developer2).registerDeveloper(signupProof2.publicSignals, signupProof2.proof,);

        // Mint IDTToken to proposer
        const lockAmount = ethers.utils.parseEther("1000");
        await idtToken.connect(deployer).mint(proposer.address, lockAmount);
        await idtToken.connect(proposer).approve(project.address, lockAmount);

        // Exchange IDTToken to IPJToken
        await project.connect(proposer).exchange(lockAmount);
    });

    afterEach(async () => {
        await ethers.provider.send("evm_revert", [snapshot]);
    })

    it("should submit solution urls", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.connect(developer2).submitURL("https://dev2.com");

        const proposal1 = await project.solutions(0);
        const proposal2 = await project.solutions(1);

        expect(proposal1.author).to.equal(developer1.address);
        expect(proposal1.url).to.equal("https://dev1.com");
        expect(proposal2.author).to.equal(developer2.address);
        expect(proposal2.url).to.equal("https://dev2.com");
    });

    it("should vote for proposals", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.connect(developer2).submitURL("https://dev2.com");

        await project.setCurrentStage(1); // Manually set the current stage to Vote
        await project.connect(proposer).voteForSolution(0, 10); // vote 10% for proposal 0
        await project.connect(proposer).voteForSolution(1, 20); // vote 20% for proposal 1

        const votesProposal1 = await project.votes(0);
        const votesProposal2 = await project.votes(1);

        const lockAmount = await ipjToken.totalSupply();
        expect(votesProposal1).to.equal(lockAmount.mul(10).div(100));
        expect(votesProposal2).to.equal(lockAmount.mul(20).div(100));
    });

    it("should claim reward and make sure developer 1 and developer 2 get the reward", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.connect(developer2).submitURL("https://dev2.com");

        await project.setCurrentStage(1); // Manually set the current stage to Vote

        const proposal1VotePercent = 30;
        const proposal2VotePercent = 70;
        await project.connect(proposer).voteForSolution(0, proposal1VotePercent); // vote 30% for proposal 0
        await project.connect(proposer).voteForSolution(1, proposal2VotePercent); // vote 70% for proposal 1

        const lockAmount = await ipjToken.totalSupply();
        const developer1Reward = lockAmount.mul(proposal1VotePercent).div(100);
        const developer2Reward = lockAmount.mul(proposal2VotePercent).div(100);

        await project.setCurrentStage(3); // Manually set the current stage to reward

        await project.claimReward(0);
        const proposal1 = await project.solutions(0);
        const balanceProposal1 = await idtToken.balanceOf(proposal1.author);
        expect(balanceProposal1.toString()).to.equal(developer1Reward.toString());

        await project.claimReward(1);
        const proposal2 = await project.solutions(1);
        const balanceProposal2 = await idtToken.balanceOf(proposal2.author);
        expect(balanceProposal2.toString()).to.equal(developer2Reward.toString());
    });
});
