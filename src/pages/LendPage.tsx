import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';

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

// USDC Contract
const USDC_ADDRESS = "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4";
const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

// rUSDC Contract
const RUSDC_ADDRESS = "0xAE1846110F72f2DaaBC75B7cEEe96558289EDfc5";
const RUSDC_ABI = [
  "function mint(uint256 mintAmount) external returns (uint256)"
];

interface LendPageProps {
  sendHash: (hash: string) => void;
}

export const LendPage = ({ sendHash }: LendPageProps) => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

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
      // Deposit 1 USDC (6 decimals)
      const tx = await rUSDCContract.mint("1000000"); // 1 USDC = 1000000 (6 decimals)
      
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log('Deposit successful');
        sendHash(tx.hash);
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
      <ButtonContainer>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleDeposit}>Deposit $1</button>
      </ButtonContainer>
    </PageContent>
  );
}; 