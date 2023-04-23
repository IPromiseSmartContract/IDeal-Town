import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { IDTToken } from "../typechain-types";
import { Dao } from "../typechain-types";

describe("Dao", function () {
  let dao: Dao;
  let token: IDTToken;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let addrs: Signer[];

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("IDTToken", owner);
    token = await tokenFactory.deploy(1000);

    const daoFactory = await ethers.getContractFactory("Dao", owner);
    dao = await daoFactory.deploy(token.address);
  });

  it("should not allow a user to vote if the voting has not started", async function () {
    const candidateAddress = await addr1.getAddress();
    const voteAmount = 50;

    await expect(dao.connect(addr1).vote(candidateAddress, voteAmount)).to.be.revertedWith("The voting has not been start.");
  });

  describe("startVoting", function () {
    it("should start a new voting with the specified candidates and duration", async function () {
      const duration = 60;
      const candidateAddresses = [await addr1.getAddress(), await addr2.getAddress()];
      await dao.startVoting(duration, candidateAddresses);

      expect(await dao.voteStage()).to.be.true;
      expect(await dao.endTime()).to.equal((await ethers.provider.getBlock("latest")).timestamp + duration * 60);
      expect(await dao.candidates(0)).to.deep.equal([await addr1.getAddress(), 0]);
      expect(await dao.candidates(1)).to.deep.equal([await addr2.getAddress(), 0]);
    });
  });

  describe("vote", function () {
    beforeEach(async function () {
      const duration = 60;
      const candidateAddresses = [await addr1.getAddress(), await addr2.getAddress()];
      await dao.startVoting(duration, candidateAddresses);
      await token.transfer(await addr1.getAddress(), 100);
      await token.connect(addr1).approve(dao.address, 100);
    });

    it("should allow a user to vote for a candidate", async function () {
      const candidateAddress = await addr1.getAddress();
      const voteAmount = 50;

      await dao.connect(addr1).vote(candidateAddress, voteAmount);

      expect(await token.balanceOf(await addr1.getAddress())).to.equal(100);
      expect((await dao.voters(0)).Address).to.deep.equal(await addr1.getAddress());
      expect((await dao.voters(0)).tickets).to.deep.equal(await voteAmount);
      expect((await dao.candidates(0)).Address).to.deep.equal(await candidateAddress);
      expect((await dao.candidates(0)).getAmount).to.deep.equal(await voteAmount);
    });



    it("should not allow a user to vote if the voting has ended", async function () {
      const candidateAddress = await addr1.getAddress();
      const voteAmount = 40;
      
      await ethers.provider.send("evm_increaseTime", [60 * 61]);
      await ethers.provider.send("evm_mine", []);
      await expect(dao.connect(addr1).vote(candidateAddress, voteAmount)).to.be.revertedWith("Voting has ended.");
    });
    });
});
