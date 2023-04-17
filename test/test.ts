import { expect } from "chai";
import { Address } from "cluster";
import { ethers } from "hardhat";
import { contracts } from "../typechain-types";

describe("IDTokenPool", function () {
  let idtToken, idtTokenPool: any, owner: any, addr1, addr2;

  const IDT_AMOUNT = 5;
  const LOCK_TIME = 3;

  beforeEach(async function () {
    // Mint IDT tokens to test addresses
    [owner, addr1] = await ethers.getSigners();

    // Deploy IDTToken contract
    const IDTToken = await ethers.getContractFactory("IDTToken");
    idtToken = await IDTToken.deploy("Ideal Token", "IDT", 50);
    await idtToken.deployed();

    // Deploy IDTokenPool contract
    const IDTokenPool = await ethers.getContractFactory("IDTTokenPool");
    idtTokenPool = await IDTokenPool.deploy(idtToken.address, IDT_AMOUNT, LOCK_TIME);
    await idtTokenPool.deployed();

    // Approve IDTokenPool to spend IDT tokens
    await idtToken.approve(idtTokenPool.address, 100);
  });

  it("Should lock and unlock IDT tokens", async function () {
    // Lock tokens
    await idtTokenPool.lockTokens(IDT_AMOUNT);

    // Check that tokens are locked
    expect(await idtTokenPool.isLocked(owner.address)).to.equal(true);

    // Wait for lock time to pass
    await ethers.provider.send("evm_increaseTime", [LOCK_TIME]);
    await ethers.provider.send("evm_mine",[]);

    // Unlock tokens
    await idtTokenPool.unlockTokens();

    // Check that tokens are unlocked
    expect(await idtTokenPool.isLocked(owner.address)).to.equal(false);
  });

  it("Should revert when unlocking tokens before locking", async function () {
    // Attempt to unlock tokens before locking any tokens
    await expect(
      idtTokenPool.unlockTokens()
    ).to.be.revertedWith("Tokens not locked");

    // Check that tokens are still not locked
    expect(await idtTokenPool.isLocked(owner.address)).to.equal(false);
  });

  it("Should revert if lock time is not expired", async function () {
    // Lock tokens
    await idtTokenPool.lockTokens(IDT_AMOUNT);

    // Attempt to unlock tokens with insufficient lock time
    await expect(
      idtTokenPool.unlockTokens()
    ).to.be.revertedWith("Lock time not expired");

    // Check that tokens are still locked
    expect(await idtTokenPool.isLocked(owner.address)).to.equal(true);

    // Wait for lock time to pass
    await ethers.provider.send("evm_increaseTime", [LOCK_TIME]);
    await ethers.provider.send("evm_mine",[]);

    // Unlock tokens
    await idtTokenPool.unlockTokens();

    // Check that tokens are unlocked
    expect(await idtTokenPool.isLocked(owner.address)).to.equal(false);
  });

  it("Should revert if tokens are already locked", async function () {
    // Lock tokens
    await idtTokenPool.lockTokens(IDT_AMOUNT);

    // Attempt to lock tokens again
    await expect(
      idtTokenPool.lockTokens(IDT_AMOUNT)
    ).to.be.revertedWith("Tokens already locked");
  });

  it("Should revert if caller does not have enough IDT tokens", async function () {
    // Attempt to lock tokens without enough IDT balance
    await expect(
        idtTokenPool.lockTokens(100)
    ).to.be.revertedWith("Insufficient IDT tokens");

    // Check that tokens are not locked
    expect(await idtTokenPool.isLocked(owner.address)).to.equal(false);
  });
  
  it("Should revert when not enough IDT tokens are locked", async function () {
    // Attempt to lock tokens with not enough IDT balance
    await expect(
      idtTokenPool.lockTokens(1)
    ).to.be.revertedWith("Not enough IDT tokens to lock");
  
    // Check that tokens are not locked
    expect(await idtTokenPool.isLocked(owner.address)).to.equal(false);
  });

});
