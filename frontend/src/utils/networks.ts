import { ethers } from "ethers"

export enum Networks {
    MAINNET = 1,
    GOERLI = 5,
    SEPOLIA = 11155111,
    GNOSIS = 100,
    CHIADO = 10200,
}


const goerliParams = {
    chainId: `0x${Networks.GOERLI.toString(16)}`,
    chainName: "Goerli Testnet",
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
    nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
    },
};

const sepoliaParams = {
    chainId: `0x${Networks.SEPOLIA.toString(16)}`,
    chainName: "Sepolia Testnet",
    rpcUrls: ["https://rpc.sepolia.org/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    nativeCurrency: {
        name: "Ethereum",
        symbol: "SepoliaETH",
        decimals: 18,
    },
}

const chiadoParams = {
    chainId: `0x${Networks.CHIADO.toString(16)}`,
    chainName: "Chiado Testnet",
    rpcUrls: ["https://rpc.chiadochain.net"],
    blockExplorerUrls: ["https://blockscout.com/gnosis/chiado"],
    nativeCurrency: {
        name: "Chiado",
        symbol: "xDai",
        decimals: 18,
    },
}

const gnosisParams = {
    chainId: `0x${Networks.GNOSIS.toString(16)}`,
    chainName: "Gnosis",
    rpcUrls: ["https://rpc.gnosischain.com"],
    blockExplorerUrls: ["https://gnosisscan.io"],
    nativeCurrency: {
        name: "Gnosis",
        symbol: "xDai",
        decimals: 18,
    },
}


/**
 * Returns the network parameters for the specified network.
 *
 * @param network - The network for which to retrieve the parameters.
 * @returns The network parameters as an object. default is chiado.
 */
export const getNetworkParams = (network: Networks = Networks.CHIADO) => {
    switch (network) {
        case Networks.GOERLI:
            return goerliParams;
        case Networks.GNOSIS:
            return gnosisParams;
        case Networks.CHIADO:
            return chiadoParams;
        case Networks.SEPOLIA:
            return sepoliaParams;
        default:
            return sepoliaParams;
    }
}

