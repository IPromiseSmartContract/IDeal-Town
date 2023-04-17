import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  typechain: {
    outDir: "<contracts-directory>/types",
    target: "ethers-v5",
  },
  solidity: "0.8.18",
};

export default config;
