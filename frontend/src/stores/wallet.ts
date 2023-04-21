import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { Networks, getNetworkParams } from '@/utils/networks'

export const useWalletStore = defineStore("wallet", () => {
  const address = ref("");
  const provider = computed(() => {
    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum as any);
    }
    return undefined;
  });

  function addAccountListener() {
    window.ethereum?.on('accountsChanged', function (accounts: any) {
      const addr = (accounts as string[])?.[0];
      if (addr) {
        address.value = addr
      };
    })
  }

  const connect = async () => {
    if (!window.ethereum) return;
    const networkParams = getNetworkParams(Networks.CHIADO);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkParams["chainId"] }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    window.ethereum?.removeAllListeners();
    await window.ethereum?.request({ method: 'eth_requestAccounts' });
    const signer = provider.value?.getSigner();
    const _addr = await signer?.getAddress();
    if (_addr) {
      address.value = _addr;
      addAccountListener();
    }
  }

  const getERC20Balance = async (tokenAddress: string):Promise<BigInt> => {
    if (!provider.value) return BigInt(0);
    const ABIofIDT = require('../../../artifacts/contracts/IDTToken.sol/IDTToken.json')
    const contract = new ethers.Contract(tokenAddress, ABIofIDT.abi, provider.value)
    const balance = await contract.balanceOf(address.value)
    return balance;
  }

  return { address, provider, connect, getERC20Balance};
})
