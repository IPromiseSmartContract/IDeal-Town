import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as envConfig } from "dotenv";
envConfig();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: process.env.GOERLI_PRIVATE_KEY ? [`0x${process.env.GOERLI_PRIVATE_KEY}`] : [],
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [`0x${process.env.SEPOLIA_PRIVATE_KEY}`] : [],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: process.env.GNOSIS_PRIVATE_KEY ? [`0x${process.env.GNOSIS_PRIVATE_KEY}`] : [],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: process.env.CHIADO_PRIVATE_KEY ? [`0x${process.env.CHIADO_PRIVATE_KEY}`] : []
    },
    "thunder-core": {
      url: 'https://mainnet-rpc.thundercore.com',
      chainId: 108,
      gas: 90000000,
      gasPrice: 1e9,
      accounts: process.env.THUNDERCORE_PRIVATE_KEY ? [`0x${process.env.THUNDERCORE_PRIVATE_KEY}`] : [],
    },
    'thunder-testnet': {
      url: 'https://testnet-rpc.thundercore.com',
      chainId: 18,
      gas: 90000000,
      gasPrice: 1e9,
      accounts: process.env.THUNDERCORE_TEST_PRIVATE_KEY ? [`0x${process.env.THUNDERCORE_TEST_PRIVATE_KEY}`] : [],
    },
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // Blockscout
          apiURL: "https://blockscout.com/xdai/mainnet/api",
          browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
      {
        network: "thunder-testnet",
        chainId: 18,
        urls: {
          apiURL: "https://explorer-testnet.thundercore.com/api",
          browserURL: "https://explorer-testnet.thundercore.com",
        },
      }
    ],
    apiKey: {
      "mainnet": process.env.ETHERSCAN_API_KEY || "",
      "goerli": process.env.ETHERSCAN_API_KEY || "",
      "sepolia": process.env.SEPOLIA_API_KEY || "",
      "chiado": process.env.CHIADO_API_KEY || "",
      "gnosis": process.env.GNOSIS_API_KEY || "",
      "thunder-testnet": "unused",
    },
  }
};

export default config;
