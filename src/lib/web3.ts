import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

export const getWeb3 = async (): Promise<Web3Provider> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return new Web3Provider(window.ethereum);
    } catch (error) {
      throw new Error('Please allow MetaMask access');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const sendEther = async (from: string, to: string, amount: number) => {
  const provider = await getWeb3();
  const signer = provider.getSigner();
  const amountInWei = provider.utils.parseEther(amount.toString());

  try {
    const tx = await signer.sendTransaction({
      to,
      value: amountInWei
    });
    return tx;
  } catch (error) {
    throw new Error('Transaction failed');
  }
};