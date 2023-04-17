// SPDX-License-Identifier: MIT
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("IDTToken", function () {
    let IDTToken: Contract;
    let owner: Signer;
    let addr1: Signer;

    beforeEach(async function () {
        const IDTTokenFactory = await ethers.getContractFactory("IDTToken");
        [owner, addr1] = await ethers.getSigners();
        IDTToken = await IDTTokenFactory.connect(owner).deploy(1n);
        await IDTToken.deployed();
    });

    it("Should deploy the contract correctly", async function () {
        expect(IDTToken.address).to.not.equal(0x0);
    });

    it("Should have correct name and symbol", async function () {
        expect(await IDTToken.name()).to.equal("IDealTown");
        expect(await IDTToken.symbol()).to.equal("IDT");
    });

    it("Should mint the initial supply correctly", async function () {
        expect(await IDTToken.totalSupply()).to.equal(1n * 10n ** BigInt(await IDTToken.decimals()));
        expect(await IDTToken.balanceOf(await owner.getAddress())).to.equal(1n * 10n ** BigInt(await IDTToken.decimals()));
    });

    it("Should allow owner to mint new tokens", async function () {
        await IDTToken.connect(owner).mint(await addr1.getAddress(), 1000n);
        expect(await IDTToken.balanceOf(await addr1.getAddress())).to.equal(1000n * 10n ** BigInt(await IDTToken.decimals()));
    });

    it("Should revert if non-owner tries to mint", async function () {
        await expect(IDTToken.connect(addr1).mint(await owner.getAddress(), ethers.utils.parseEther("1000"))).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
