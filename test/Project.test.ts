import { ethers } from "hardhat";
import { expect } from "chai";
import { Synchronizer, UserState, schema } from '@unirep/core'
import { Identity } from "@semaphore-protocol/identity"
import { Unirep } from "@unirep/contracts";
import { deployUnirep } from "@unirep/contracts/deploy"
import { genEpochKey } from '@unirep/utils';
import { defaultProver } from '@unirep/circuits/provers/defaultProver'
import { Project, IDTToken, IPJToken } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DB, SQLiteConnector } from 'anondb/node'
import { time } from "@nomicfoundation/hardhat-network-helpers";

const EPOCH_LENGTH = 100;

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

    let attesterID: bigint;
    let synchronizer: Synchronizer;
    let developer1Identity = new Identity("developer1");
    let developer2Identity = new Identity("developer2");
    let developer1State: UserState;
    let developer2State: UserState;
    let reviewer1State: UserState;
    let reviewer2State: UserState;

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
            [reviewer1.address, reviewer2.address],
            idtToken.address,
            unirep.address,
            { gasLimit: 30000000 },
        );
        await project.deployed();

        // signup attester
        await project.registerAttester(EPOCH_LENGTH);
        attesterID = BigInt(project.address);
        const db: DB = await SQLiteConnector.create(schema, ":memory:");
        synchronizer = new Synchronizer({
            db: db,
            attesterId: attesterID,
            prover: defaultProver, // a circuit prover
            unirepAddress: unirep.address,
            provider: ethers.provider
        })
        await synchronizer.start()
        await synchronizer.waitForSync()

        // signup user
        developer1State = new UserState(synchronizer, developer1Identity)
        developer2State = new UserState(synchronizer, developer2Identity)
        const signupProof1 = await developer1State.genUserSignUpProof()
        const signupProof2 = await developer2State.genUserSignUpProof()

        await project.connect(developer1).registerDeveloper(signupProof1.publicSignals, signupProof1.proof,);
        await project.connect(developer2).registerDeveloper(signupProof2.publicSignals, signupProof2.proof,);

        // signup reviewer
        reviewer1State = new UserState(synchronizer, new Identity("reviewer1"))
        reviewer2State = new UserState(synchronizer, new Identity("reviewer2"))
        const signupProof3 = await reviewer1State.genUserSignUpProof()
        const signupProof4 = await reviewer2State.genUserSignUpProof()

        await project.connect(reviewer1).registerReviewer(signupProof3.publicSignals, signupProof3.proof,);
        await project.connect(reviewer2).registerReviewer(signupProof4.publicSignals, signupProof4.proof,);

        // Mint IDTToken to proposer
        const mintAmount = ethers.utils.parseEther("2000");
        await idtToken.connect(deployer).mint(proposer.address, mintAmount); // Mint 2000 idtTokens, but only lock 1000. The remain 1000 is for exchange() testing.
        await idtToken.connect(proposer).approve(project.address, mintAmount);

        // Exchange IDTToken to IPJToken
        const lockAmount = ethers.utils.parseEther("1000");
        await project.connect(proposer).exchange(lockAmount);
    });

    afterEach(async () => {
        await ethers.provider.send("evm_revert", [snapshot]);
    })

    it("should revert exchange() if the stage is wrong", async function () {
        await project.setCurrentStage(1); // Manually set the current stage to Vote
        expect(project.connect(proposer).exchange(0)).to.be.revertedWith("Project is not in the right stage.");
    });

    it("should exchange IDT to IPJToken with 1:1 ratio", async function () {
        const lockAmount = ethers.utils.parseEther("1000");
        const proposerBalanceBefore = await idtToken.balanceOf(proposer.address);
        const proposerIPJBalanceBefore = await ipjToken.balanceOf(proposer.address);

        await idtToken.connect(proposer).approve(project.address, lockAmount);
        await project.connect(proposer).exchange(lockAmount);

        const proposerBalanceAfter = await idtToken.balanceOf(proposer.address);
        const proposerIPJBalanceAfter = await ipjToken.balanceOf(proposer.address);

        expect(proposerBalanceBefore.sub(lockAmount)).to.equal(proposerBalanceAfter);
        expect(proposerIPJBalanceBefore.add(lockAmount)).to.equal(proposerIPJBalanceAfter);
    });


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

    it("should emit URLSubmitted event when developers submit solution urls", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.connect(developer2).submitURL("https://dev2.com");

        await project.solutions(0);
        await project.solutions(1);

        // check if URLSubmitted event is emitted
        const events = await project.queryFilter(project.filters.URLSubmitted());
        expect(events.length).to.equal(2);

        const eventArgs = events[0].args;
        expect(eventArgs.submitter).to.equal(developer1.address);
        expect(eventArgs.url).to.equal("https://dev1.com");

        const eventArgs2 = events[1].args;
        expect(eventArgs2.submitter).to.equal(developer2.address);
        expect(eventArgs2.url).to.equal("https://dev2.com");
    });

    it("should revert voteForSolution() if the stage is wrong", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.setCurrentStage(0); // Manually set the current stage to Open, but it should be Vote stage
        expect(project.connect(proposer).voteForSolution(0, 50)).to.be.revertedWith("Project is not in the right stage.");
    });

    it("should revert voteForSolution() if the percentage is over 100", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.setCurrentStage(1); // Manually set the current stage to Vote
        await project.connect(proposer).voteForSolution(0, 60); // vote 60% for proposal 0
        expect(project.connect(proposer).voteForSolution(0, 50)).to.be.revertedWith("Project: The percentage is over 100");
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

    it("should emit Voted event when voting for proposals", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.connect(developer2).submitURL("https://dev2.com");

        await project.setCurrentStage(1); // Manually set the current stage to Vote
        await project.connect(proposer).voteForSolution(0, 10); // vote 10% for proposal 0
        await project.connect(proposer).voteForSolution(1, 20); // vote 20% for proposal 1

        const events = await project.queryFilter(project.filters.Voted());
        expect(events.length).to.equal(2);
        const eventArgs = events[0].args;
        expect(eventArgs.proposalIndex).to.equal(0);
        expect(eventArgs.voter).to.equal(proposer.address);

        const eventArgs2 = events[1].args;
        expect(eventArgs2.proposalIndex).to.equal(1);
        expect(eventArgs2.voter).to.equal(proposer.address);

    });

    it("should claim reward and make sure developers get the reward", async function () {
        await project.connect(developer1).submitURL("https://dev1.com");
        await project.connect(developer2).submitURL("https://dev2.com");

        // Manually set the current stage to Vote
        await project.setCurrentStage(1);

        const proposal1VotePercent = 30;
        const proposal2VotePercent = 70;
        await project.connect(proposer).voteForSolution(0, proposal1VotePercent); // vote 30% for proposal 0
        await project.connect(proposer).voteForSolution(1, proposal2VotePercent); // vote 70% for proposal 1

        const lockAmount = await ipjToken.totalSupply();
        const developer1Reward = lockAmount.mul(proposal1VotePercent).div(100);
        const developer2Reward = lockAmount.mul(proposal2VotePercent).div(100);

        // Manually set the current stage to Review
        await project.setCurrentStage(2)
        const epoch = await unirep.attesterCurrentEpoch(project.address)

        const user1EpochKey = genEpochKey(developer1Identity.secret, attesterID, epoch, 0);
        await project.connect(reviewer1).review(user1EpochKey, epoch, 0, 100) // give 100 likes to user 1

        const user2EpochKey = genEpochKey(developer2Identity.secret, attesterID, epoch, 0);
        await project.connect(reviewer2).review(user2EpochKey, epoch, 1, 100) // give 100 unlikes to user 2

        // Manually set the current stage to reward
        await project.setCurrentStage(3);
        await time.increase(EPOCH_LENGTH);
        await synchronizer.waitForSync();

        const toEpoch = epoch + 1;
        const stateTransitionProof1 = await developer1State.genUserStateTransitionProof({ toEpoch });
        await project.connect(developer1).claimReward(0, stateTransitionProof1.publicSignals, stateTransitionProof1.proof);
        const proposal1 = await project.solutions(0);
        const balanceProposal1 = await idtToken.balanceOf(proposal1.author);
        expect(balanceProposal1.toString()).to.equal(developer1Reward.toString());

        const stateTransitionProof2 = await developer2State.genUserStateTransitionProof({ toEpoch });
        await project.connect(developer2).claimReward(1, stateTransitionProof2.publicSignals, stateTransitionProof2.proof);
        const proposal2 = await project.solutions(1);
        const balanceProposal2 = await idtToken.balanceOf(proposal2.author);
        expect(balanceProposal2.toString()).to.equal(developer2Reward.toString());

        // Check the reputation
        const dev1data = await developer1State.getData()
        expect(dev1data[0].toString()).to.equal('100');

        const dev2data = await developer2State.getData()
        expect(dev2data[1].toString()).to.equal('100');
    });
});
