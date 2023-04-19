// import { ethers } from "hardhat";
// import { ProjectFactory, IPJToken, Project } from "../typechain-types";
// import { expect } from 'chai';

// describe("ProjectFactory", () => {
//   let projectFactory: ProjectFactory;
//   let project: Project;
//   let token: IPJToken;

//   beforeEach(async () => {
//     // step 1. Deploy ProjectFactory.
//     const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
//     projectFactory = await ProjectFactory.deploy();
//     // step 2. Call ProjectFactory.createProject function to deploy IPJToken and Project contract.
//     await projectFactory.deployed();
//     await projectFactory.createProject("Test Project", 1000, 100000, 500, "url");
//     // step 2-1. Get deploy Project contract.
//     const projectAddress = await projectFactory.ProjectAddress(0);
//     project = await ethers.getContractAt("Project", projectAddress) as Project;
//     // step 2-2. Get deploy IPJToken contract.
//     const tokenAddress = await project.getTokenAddress();
//     token = await ethers.getContractAt("IPJToken", tokenAddress) as IPJToken;
//   });

//   // step 3. Check the IPJToken owner.
//   it("should deploy ProjectFactory, create a new project, and check IPJToken owner", async () => {
//     const owner = await token.owner();
//     expect(owner).to.equal(project.address);
//   });

//   // step 4. Check can only call mint and burn by Project contract.
//   it("should throw an error when calling mint function without Project contract", async () => {
//     const [user] = await ethers.getSigners();
//     await expect(token.connect(user).mint(user.address, 100)).to.be.rejectedWith(Error);
//   });  
//   it("should throw an error when calling burn function without Project contract", async () => {
//     const [user] = await ethers.getSigners();
//     await expect(token.connect(user).burn(user.address, 100)).to.be.rejectedWith(Error);
//   });  

//   // step 5. Mint token by user and check user balance and totalSupply.
//   it("should mint tokens by Project contract, and update totalSupply", async () => {
//     const [user] = await ethers.getSigners();
//     await project.connect(user).mintToken(100);
//     const totalSupply = await token.totalSupply();
//     const balance = await token.balanceOf(user.address);
//     expect(balance).to.equal(100000000000000000000n);
//     expect(totalSupply).to.equal(100000000000000000000n);
//   });

//   // step 6. Mint token by user and burn half of it and then check user balance and totalSupply.
//   it("should burn tokens from Project contract, and update totalSupply", async () => {
//     const [user] = await ethers.getSigners();
//     await project.connect(user).mintToken(100);
//     await project.connect(user).burnToken(50);
//     const balance = await token.balanceOf(user.address);
//     const totalSupply = await token.totalSupply();
//     expect(balance).to.equal(50000000000000000000n);
//     expect(totalSupply).to.equal(50000000000000000000n);
//   });
// });
