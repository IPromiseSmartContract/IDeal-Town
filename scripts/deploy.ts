import { ethers } from "hardhat";

async function main() {
  // Deploy the IDTToken contract
  const IDTFactory = await ethers.getContractFactory("IDTToken");
  const idt = await IDTFactory.deploy(1000);

  // Deploy the Dao contract
  const daoFactory = await ethers.getContractFactory("Dao");
  const dao = await daoFactory.deploy(idt.address);

  await Promise.all([idt.deployed(), dao.deployed()]);

  console.log("IDTToken contract deployed to:", idt.address);
  console.log("Dao contract deployed to:", dao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
