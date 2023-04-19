import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";
import {Project,IDTToken,IDTToken__factory} from "../typechain-types"

import { parse } from "path";

describe("Project_Maxie", function () {
  let project: Project;
  let idtToken: IDTToken;
  let proposer: any;
  let developer1: any;
  let developer2: any;

  beforeEach(async () => {
    [proposer, developer1, developer2] = await ethers.getSigners();
    
    const IDTTokenFactory: IDTToken__factory = await ethers.getContractFactory(
        "IDTToken"
      );
    idtToken = (await IDTTokenFactory.deploy(ethers.utils.parseEther("1000"))) as IDTToken;
    await idtToken.deployed();

    const Project = await ethers.getContractFactory("Project");
    project = await Project.deploy(
      "Project Name",
      proposer.address,
      172800, // expiration 2 days
      1000,
      idtToken.address,
      "https://proposer.com/proposal",
      {gasLimit: 30000000,gasPrice: 875000000},
    );
    await project.deployed();
    await idtToken.transfer(project.address, ethers.utils.parseEther("1000"));
    await project.submitURL(developer1.address, "https://dev1.com");
    await project.submitURL(developer2.address, "https://dev2.com");
  });

  it("should submit proposal urls", async function () {
    const proposal1 = await project.proposals(1);
    const proposal2 = await project.proposals(2);

    expect(proposal1.authur).to.equal(developer1.address);
    expect(proposal1.url).to.equal("https://dev1.com");
    expect(proposal2.authur).to.equal(developer2.address);
    expect(proposal2.url).to.equal("https://dev2.com");
  });

  it("should vote for proposals", async function () {
    await project.setCurrentStage(1); // Manually set the current stage to Vote
    await project.voteForSolution(1, 10); // vote 10 for proposal 0
    await project.voteForSolution(2, 20); // vote 20 for proposal 1

    const votesProposal1 = await project.votes(1);
    const votesProposal2 = await project.votes(2);

    expect(votesProposal1).to.equal(10);
    expect(votesProposal2).to.equal(20);
  });

  it("should claim reward and make sure developer 1 and developer 1 get the reward", async function () {
    await project.setCurrentStage(1); // Manually set the current stage to Vote
    const proposal1VotePercent = 30;
    const proposal2VotePercent = 70;
    await project.voteForSolution(1, proposal1VotePercent*100); // vote 30% for proposal 0
    await project.voteForSolution(2, proposal2VotePercent*100); // vote 70% for proposal 1
   
    await project.setCurrentStage(3); // Manually set the current stage to reward
    await project.claimReward();

    const proposal1 = await project.proposals(1);
    const balanceProposal1 = await idtToken.balanceOf(proposal1.authur);
    expect(balanceProposal1.toString()).to.equal(proposal1VotePercent.toString());

    const proposal2 = await project.proposals(2);
    const balanceProposal2 = await idtToken.balanceOf(proposal2.authur);
    expect(balanceProposal2.toString()).to.equal(proposal2VotePercent.toString());
  });
  
});
