// SPDX-License-Identifier: MIT
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { IDTToken } from "../typechain-types";

describe("IDTToken", function () {
    let IDTToken: IDTToken;
    let owner: Signer;
    let addr1: Signer;

    const initialSupply = ethers.utils.parseEther("1");

    beforeEach(async function () {
        const IDTTokenFactory = await ethers.getContractFactory("IDTToken");
        [owner, addr1] = await ethers.getSigners();
        IDTToken = await IDTTokenFactory.connect(owner).deploy(initialSupply);
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
        expect(await IDTToken.totalSupply()).to.equal(initialSupply);
        expect(await IDTToken.balanceOf(await owner.getAddress())).to.equal(initialSupply);
    });

    it("Should allow owner to mint new tokens", async function () {
        const mintAmount = ethers.utils.parseEther("1000");
        await IDTToken.connect(owner).mint(await addr1.getAddress(), mintAmount);
        expect(await IDTToken.balanceOf(await addr1.getAddress())).to.equal(mintAmount);
    });

    it("Should revert if non-owner tries to mint", async function () {
        await expect(IDTToken.connect(addr1).mint(await owner.getAddress(), ethers.utils.parseEther("1000"))).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
