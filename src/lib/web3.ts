import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const getWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      throw new Error('Please allow MetaMask access');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const sendEther = async (from: string, to: string, amount: number) => {
  try {
    const provider = await getWeb3();
    const signer = provider.getSigner();
    const amountInWei = ethers.utils.parseEther(amount.toString());

    // Estimate gas for the transaction
    const gasEstimate = await provider.estimateGas({
      to,
      value: amountInWei
    });

    // Get current gas price
    const gasPrice = await provider.getGasPrice();
    const maxGasPrice = ethers.utils.parseUnits(MAX_GAS_PRICE, "gwei");
    
    // Use the lower of current gas price or max gas price
    const finalGasPrice = gasPrice.gt(maxGasPrice) ? maxGasPrice : gasPrice;

    const tx = await signer.sendTransaction({
      to,
      value: amountInWei,
      gasLimit: gasEstimate,
      gasPrice: finalGasPrice
    });
    
    return tx;
  } catch (error) {
    console.error('Transaction error:', error);
    throw new Error('Transaction failed');
  }
};