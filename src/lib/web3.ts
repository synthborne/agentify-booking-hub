import Web3 from 'web3';
import { InjectedConnector } from '@web3-react/injected-connector';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42] // Mainnet, Ropsten, Rinkeby, Goerli, Kovan
});

export const getWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return new Web3(window.ethereum);
    } catch (error) {
      throw new Error('Please allow MetaMask access');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const sendEther = async (from: string, to: string, amount: number) => {
  const web3 = await getWeb3();
  const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

  try {
    const transaction = await web3.eth.sendTransaction({
      from,
      to,
      value: amountInWei
    });
    return transaction;
  } catch (error) {
    throw new Error('Transaction failed');
  }
};