import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, formatUnits } from 'ethers';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const ProtocolLogo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const BalanceDisplay = styled.div`
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastContainer = styled.div`
  .custom-toast {
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const toastStyles = {
  loading: {
    style: {
      background: '#FF9800',
      color: 'white',
    },
  },
  success: {
    style: {
      background: '#4CAF50',
      color: 'white',
    },
  },
  error: {
    style: {
      background: '#F44336',
      color: 'white',
    },
  },
};

interface ContractConfig {
  name: string;
  protocol: string;
  logoUrl?: string;
  address: string;
  abi: string[];
  asset: string;
  apy: string;
  tokenAddress: string;
  tokenAbi: string[];
  aTokenAddress?: string;
}

// Contract configurations
const CONTRACTS: ContractConfig[] = [
  {
    name: "USDC Lending Pool",
    protocol: "RHO Markets",
    logoUrl: "/rho-markets.svg",
    address: "0xAE1846110F72f2DaaBC75B7cEEe96558289EDfc5",
    abi: [
      "function mint(uint256 mintAmount) external returns (uint256)",
      "function balanceOf(address account) external view returns (uint256)",
      "function exchangeRateStored() external view returns (uint256)",
      "function redeem(uint256 redeemTokens) external returns (uint256)"
    ],
    tokenAddress: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    tokenAbi: [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function balanceOf(address account) external view returns (uint256)"
    ],
    asset: "USDC",
    apy: "4.5%"
  },
  {
    name: "USDT Lending Pool",
    protocol: "Lore Finance",
    logoUrl: "/lore-finance.svg",
    address: "0x4cE1A1eC13DBd9084B1A741b036c061b2d58dABf",
    abi: [
      "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external",
      "function withdraw(address asset, uint256 amount, address to) external",
      "function balanceOf(address account) external view returns (uint256)"
    ],
    tokenAddress: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
    tokenAbi: [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function balanceOf(address account) external view returns (uint256)"
    ],
    aTokenAddress: "0xC5776416Ea3e88e04E95bCd3fF99b27902da7892",
    asset: "USDT",
    apy: "5.2%"
  }
];

interface EarnContractCardProps {
  sendHash: (hash: string) => void;
  contractIndex: number;
}

export const EarnContractCard = ({ sendHash, contractIndex }: EarnContractCardProps) => {
  if (contractIndex >= CONTRACTS.length) {
    return (
      <CardContent>
        <CardTitle>No Contract Available</CardTitle>
      </CardContent>
    );
  }

  const contract = CONTRACTS[contractIndex];
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [walletUsdcBalance, setWalletUsdcBalance] = useState<string>('0');
  const [rUsdcBalance, setRUsdcBalance] = useState<bigint>(BigInt(0));

  // Function to fetch USDC wallet balance
  const fetchWalletBalance = async () => {
    if (!walletProvider || !address) return;

    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const tokenContract = new Contract(contract.tokenAddress, contract.tokenAbi, provider);
      const balance = await tokenContract.balanceOf(address);
      const formattedBalance = formatUnits(balance, 6);
      setWalletUsdcBalance(Number(formattedBalance).toFixed(2));
    } catch (error) {
      console.error(`Failed to fetch ${contract.asset} balance:`, error);
    }
  };

  // Function to fetch and calculate the actual USDC balance
  const fetchBalance = async () => {
    if (!walletProvider || !address) return;

    try {
      const provider = new BrowserProvider(walletProvider, chainId);

      if (contract.protocol === "RHO Markets") {
        const rUSDCContract = new Contract(contract.address, contract.abi, provider);
        
        const [rUSDCBalance, exchangeRate] = await Promise.all([
          rUSDCContract.balanceOf(address),
          rUSDCContract.exchangeRateStored()
        ]);

        setRUsdcBalance(rUSDCBalance);

        const actualBalance = (BigInt(rUSDCBalance) * BigInt(exchangeRate)) / BigInt(1e18);
        const formattedBalance = formatUnits(actualBalance, 6);
        const roundedBalance = Number(formattedBalance).toFixed(2);
        
        setUsdcBalance(roundedBalance);
      } else {
        // Lore Finance balance checking using aToken
        const aTokenContract = new Contract(
          contract.aTokenAddress!,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        
        const balance = await aTokenContract.balanceOf(address);
        setRUsdcBalance(balance);
        
        const formattedBalance = formatUnits(balance, 6);
        const roundedBalance = Number(formattedBalance).toFixed(2);
        
        setUsdcBalance(roundedBalance);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setUsdcBalance('Error');
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchWalletBalance();
  }, [address, walletProvider, chainId]);

  const handleApprove = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    const loadingToast = toast.loading('Approving USDC...', toastStyles.loading);
    
    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      const usdcContract = new Contract(contract.tokenAddress, contract.tokenAbi, signer);
      
      const tx = await usdcContract.approve(
        contract.address, 
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        const success = await usdcContract.approve.staticCall(
          contract.address,
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        );
        
        if (success) {
          toast.success('USDC approved successfully!', { id: loadingToast, ...toastStyles.success });
          sendHash(tx.hash);
        } else {
          toast.error('Approval returned false', { id: loadingToast, ...toastStyles.error });
        }
      }
    } catch (error) {
      console.error("Failed to approve USDC:", error);
      toast.error('Failed to approve USDC', { id: loadingToast, ...toastStyles.error });
    }
  };

  const handleDeposit = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    const loadingToast = toast.loading(`Depositing ${contract.asset}...`, toastStyles.loading);
    
    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      const poolContract = new Contract(contract.address, contract.abi, signer);
      
      let tx;
      if (contract.protocol === "RHO Markets") {
        tx = await poolContract.mint("1000000");
      } else {
        // Lore Finance deposit
        tx = await poolContract.deposit(
          contract.tokenAddress, // asset address
          "1000000", // amount (1 USDT)
          address, // onBehalfOf
          0 // referralCode
        );
      }

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success(`${contract.asset} deposited successfully!`, { 
          id: loadingToast, 
          ...toastStyles.success 
        });
        sendHash(tx.hash);
        await Promise.all([fetchBalance(), fetchWalletBalance()]);
      }
    } catch (error) {
      console.error(`Failed to deposit ${contract.asset}:`, error);
      toast.error(`Failed to deposit ${contract.asset}`, { 
        id: loadingToast, 
        ...toastStyles.error 
      });
    }
  };

  const handleWithdraw = async () => {
    if (!walletProvider || !address || rUsdcBalance === BigInt(0)) {
      throw Error('user is disconnected or has no balance');
    }

    const loadingToast = toast.loading(`Withdrawing ${contract.asset}...`, toastStyles.loading);
    
    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      const poolContract = new Contract(contract.address, contract.abi, signer);
      
      let tx;
      if (contract.protocol === "RHO Markets") {
        tx = await poolContract.redeem(rUsdcBalance);
      } else {
        // Lore Finance withdraw
        tx = await poolContract.withdraw(
          contract.tokenAddress, // asset address
          rUsdcBalance, // amount
          address // to address
        );
      }

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success(`${contract.asset} withdrawn successfully!`, { 
          id: loadingToast, 
          ...toastStyles.success 
        });
        sendHash(tx.hash);
        await Promise.all([fetchBalance(), fetchWalletBalance()]);
      }
    } catch (error) {
      console.error(`Failed to withdraw ${contract.asset}:`, error);
      toast.error(`Failed to withdraw ${contract.asset}`, { 
        id: loadingToast, 
        ...toastStyles.error 
      });
    }
  };

  return (
    <ToastContainer>
      <CardContent>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 5000,
            style: {
              minWidth: '250px',
              maxWidth: '500px',
              padding: '16px',
              textAlign: 'center',
            },
          }}
        />
        <CardTitle>{contract.name}</CardTitle>
        {contract.logoUrl && (
          <ProtocolLogo src={contract.logoUrl} alt={contract.protocol} />
        )}
        <div>Protocol: {contract.protocol}</div>
        <div>APY: {contract.apy}</div>
        <BalanceDisplay>
          Your Lending Balance: ${usdcBalance} {contract.asset}
        </BalanceDisplay>
        <BalanceDisplay>
          Your Wallet Balance: ${walletUsdcBalance} {contract.asset}
        </BalanceDisplay>
        <ButtonContainer>
          <button onClick={handleApprove}>Approve</button>
          <button onClick={handleDeposit}>Deposit $1</button>
          <button onClick={handleWithdraw} disabled={rUsdcBalance === BigInt(0)}>
            Withdraw All
          </button>
        </ButtonContainer>
      </CardContent>
    </ToastContainer>
  );
}; 