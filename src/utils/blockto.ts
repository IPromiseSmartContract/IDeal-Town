import Web3 from 'web3';
import BloctoSDK, { type EthereumProviderInterface } from '@blocto/sdk';

const bloctoSDK = new BloctoSDK({
    ethereum: {
        chainId: '0x1',
        rpc: 'https://mainnet.infura.io/v3/e2330bae560e4cc5a2cbad9c612d7398',
    },
    appId: '3783ef06-dadc-485f-b250-ec639ea90b30',
});

let web3: Web3;
const ethereumProvider: EthereumProviderInterface | undefined = bloctoSDK.ethereum;
if (ethereumProvider) {
    web3 = new Web3(<any>ethereumProvider);
} else {
    // Fallback to a default provider or handle the error accordingly
    console.error('Unable to initialize Ethereum provider');
}

export { web3, bloctoSDK };