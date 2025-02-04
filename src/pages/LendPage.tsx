import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, formatUnits } from 'ethers';
import { useEffect, useState } from 'react';

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BalanceDisplay = styled.div`
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: center;
`;

// USDC Contract
const USDC_ADDRESS = "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4";
const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

// rUSDC Contract
const RUSDC_ADDRESS = "0xAE1846110F72f2DaaBC75B7cEEe96558289EDfc5";
const RUSDC_ABI = [
  "function mint(uint256 mintAmount) external returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function exchangeRateStored() external view returns (uint256)"
];

interface LendPageProps {
  sendHash: (hash: string) => void;
}

export const LendPage = ({ sendHash }: LendPageProps) => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');

  // Function to fetch and calculate the actual USDC balance
  const fetchBalance = async () => {
    if (!walletProvider || !address) return;

    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const rUSDCContract = new Contract(RUSDC_ADDRESS, RUSDC_ABI, provider);
      
      // Get rUSDC balance and exchange rate
      const [rUSDCBalance, exchangeRate] = await Promise.all([
        rUSDCContract.balanceOf(address),
        rUSDCContract.exchangeRateStored()
      ]);

      // Calculate actual USDC balance:
      // (rUSDCBalance * exchangeRate) / 1e18 (to account for exchangeRate decimals)
      // Note: rUSDCBalance is in 6 decimals, final result will be in 6 decimals
      const actualBalance = (rUSDCBalance * exchangeRate) / BigInt(1e18);
      
      // Format the balance to display with 2 decimal places
      const formattedBalance = formatUnits(actualBalance, 6);
      const roundedBalance = Number(formattedBalance).toFixed(2);
      
      setUsdcBalance(roundedBalance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setUsdcBalance('Error');
    }
  };

  // Fetch balance on mount and when address changes
  useEffect(() => {
    fetchBalance();
  }, [address, walletProvider, chainId]);

  const handleApprove = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);
    
    const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, signer);
    
    try {
      // Approve max uint256 amount
      const tx = await usdcContract.approve(
        RUSDC_ADDRESS, 
        "115792089237316195423570985008687907853269984665640564039457584007913129639935" // uint256.max
      );
      
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log('Approval successful');
        sendHash(tx.hash);
      } else {
        console.error('Approval failed');
      }
    } catch (error) {
      console.error("Failed to approve USDC:", error);
    }
  };

  const handleDeposit = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);
    
    const rUSDCContract = new Contract(RUSDC_ADDRESS, RUSDC_ABI, signer);
    
    try {
      const tx = await rUSDCContract.mint("1000000");
      
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log('Deposit successful');
        sendHash(tx.hash);
        // Refresh balance after successful deposit
        await fetchBalance();
      } else {
        console.error('Deposit failed');
      }
    } catch (error) {
      console.error("Failed to deposit USDC:", error);
    }
  };

  return (
    <PageContent>
      <PageTitle>Lend</PageTitle>
      <BalanceDisplay>
        Your Lending Balance: ${usdcBalance} USDC
      </BalanceDisplay>
      <ButtonContainer>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleDeposit}>Deposit $1</button>
      </ButtonContainer>
    </PageContent>
  );
}; 