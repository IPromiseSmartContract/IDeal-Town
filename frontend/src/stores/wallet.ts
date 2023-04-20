import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { getNetworkParams, Networks } from '@/utils/networks'

export const useWalletStore = defineStore("wallet", () => {
  const address = ref("");
  const provider = computed(() => {
    if (window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return undefined;
  });

  function addAccountListener() {
    window.ethereum?.on('accountsChanged', function (accounts) {
      const addr = (accounts as string[])?.[0];
      if (addr) {
        address.value = addr
      };
    })
  }

  const connect = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xf00' }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          const networkParams = getNetworkParams();
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
    const signer = await provider.value?.getSigner();
    if (signer?.address) {
      address.value = signer.address;
      addAccountListener();
    }
  }

  return { address, provider, connect };
})
