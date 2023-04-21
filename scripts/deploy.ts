import { ethers } from "hardhat";
import { deployUnirep } from "@unirep/contracts/deploy"

async function main() {
  const [signer] = await ethers.getSigners()
  console.log("Deploying contracts with the account:", signer.address)
  
  // Deploy the Dao contract
  const daoFactory = await ethers.getContractFactory("Dao");
  const dao = await daoFactory.deploy(idt.address);
  
  const unirep = await deployUnirep(signer)
  console.log("UniRep deployed to:", unirep.address)

  const IDTInitialSupply = ethers.utils.parseEther("100000");
  const IDTTokenFactory = await ethers.getContractFactory("IDTToken");
  const idtToken = await IDTTokenFactory.connect(signer).deploy(IDTInitialSupply);
  await idtToken.deployed();
  console.log(`IDTToken deployed to: ${idtToken.address} | initialSupply: ${IDTInitialSupply}`);

  const ProjectFactoryFactory = await ethers.getContractFactory("ProjectFactory");
  const projectFactory = await ProjectFactoryFactory.connect(signer).deploy(unirep.address, idtToken.address);
  await projectFactory.deployed();
  console.log(`ProjectFactory deployed to: ${projectFactory.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
