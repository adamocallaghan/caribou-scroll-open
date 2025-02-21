import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, formatUnits } from 'ethers';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ToastPortal } from '../../Toast';
import { EarnCardV2 } from './EarnCardV2';
import { EarnCardBackV2 } from './EarnCardBackV2';

const CardWrapper = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 100dvh;
  max-height: calc(100dvh - env(safe-area-inset-bottom));
  overflow: auto;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  padding-top: 60px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  text-align: center;
  background-color: #f3c86c;
  color: #222222;

  @media (max-width: 768px) {
    padding-bottom: calc(120px + env(safe-area-inset-bottom));
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin: 0;
  color: #222222;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 300px;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #222222;
  color: #f3c86c;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 2px;
`;

const SliderSection = styled.div`
  width: 100%;
  margin: 0;
`;

const AmountText = styled.div`
  font-size: 0.9rem;
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
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
      "function allowance(address owner, address spender) external view returns (uint256)",
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
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function balanceOf(address account) external view returns (uint256)"
    ],
    aTokenAddress: "0xC5776416Ea3e88e04E95bCd3fF99b27902da7892",
    asset: "USDT",
    apy: "5.2%"
  },
  {
    name: "USDC Lending Pool",
    protocol: "AAVE",
    logoUrl: "/aave-scroll.svg",
    address: "0x11fCfe756c05AD438e312a7fd934381537D3cFfe",
    abi: [
      "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external",
      "function withdraw(address asset, uint256 amount, address to) external returns (uint256)",
      "function balanceOf(address account) external view returns (uint256)",
      "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
    ],
    tokenAddress: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    tokenAbi: [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function balanceOf(address account) external view returns (uint256)"
    ],
    aTokenAddress: "0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD",
    asset: "USDC",
    apy: "3.8%"
  }
];

interface EarnContractCardProps {
  sendHash: (hash: string) => void;
  contractIndex: number;
}

// Add flip-related styled components
const FlipContainer = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 15px;
  padding-top: 60px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-bottom: calc(120px + env(safe-area-inset-bottom));
  }
`;

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 15px;
  padding-top: 60px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-bottom: calc(120px + env(safe-area-inset-bottom));
  }
`;

const FlipButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    bottom: calc(env(safe-area-inset-bottom) + 120px);
    right: max(20px, env(safe-area-inset-right));
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: invert(13%) sepia(0%) saturate(11%) hue-rotate(213deg) brightness(95%) contrast(86%);
  }
`;

export const EarnContractCard = ({ sendHash, contractIndex }: EarnContractCardProps) => {
  if (contractIndex >= CONTRACTS.length) {
    return (
      <CardContent>
        <Title>No Contract Available</Title>
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
  const [depositAmount, setDepositAmount] = useState<string>('0');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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
        // Lore Finance and AAVE balance checking using aToken
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

  const handleDeposit = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');
    if (parseFloat(depositAmount) === 0) return;

    setIsDepositing(true);
    const loadingToast = toast.loading(`Depositing ${contract.asset}...`, toastStyles.loading);
    
    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      
      // Convert amount to BigInt with 6 decimals
      const depositAmountBigInt = BigInt(Math.floor(parseFloat(depositAmount) * 1_000_000));
      
      // First approve
      const tokenContract = new Contract(contract.tokenAddress, contract.tokenAbi, signer);
      const allowance = await tokenContract.allowance(address, contract.address);
      if (allowance < depositAmountBigInt) {
        const approveTx = await tokenContract.approve(contract.address, depositAmountBigInt);
        await approveTx.wait();
      }
      
      // Then deposit
      const poolContract = new Contract(contract.address, contract.abi, signer);
      
      let tx;
      if (contract.protocol === "RHO Markets") {
        tx = await poolContract.mint(depositAmountBigInt.toString());
      } else if (contract.protocol === "Lore Finance") {
        tx = await poolContract.deposit(
          contract.tokenAddress,
          depositAmountBigInt.toString(),
          address,
          0
        );
      } else {
        tx = await poolContract.supply(
          contract.tokenAddress,
          depositAmountBigInt.toString(),
          address,
          0
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
        setDepositAmount('0');
      }
    } catch (error) {
      console.error(`Failed to deposit ${contract.asset}:`, error);
      toast.error(`Failed to deposit ${contract.asset}`, { 
        id: loadingToast, 
        ...toastStyles.error 
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');
    if (parseFloat(withdrawAmount) === 0) return;

    setIsWithdrawing(true);
    const loadingToast = toast.loading(`Withdrawing ${contract.asset}...`, toastStyles.loading);
    
    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      const poolContract = new Contract(contract.address, contract.abi, signer);
      
      // For RHO Markets, we need to use the rToken amount directly
      let withdrawAmountBigInt;
      if (contract.protocol === "RHO Markets") {
        // If withdrawing 100%, use the full rToken balance
        if (parseFloat(withdrawAmount) === parseFloat(usdcBalance)) {
          withdrawAmountBigInt = rUsdcBalance;
        } else {
          // Otherwise calculate the proportion of rTokens to withdraw
          const proportion = parseFloat(withdrawAmount) / parseFloat(usdcBalance);
          withdrawAmountBigInt = BigInt(Math.floor(Number(rUsdcBalance) * proportion));
        }
      } else {
        // For other protocols, convert the amount to BigInt with 6 decimals
        withdrawAmountBigInt = BigInt(Math.floor(parseFloat(withdrawAmount) * 1_000_000));
      }
      
      let tx;
      if (contract.protocol === "RHO Markets") {
        tx = await poolContract.redeem(withdrawAmountBigInt.toString());
      } else {
        tx = await poolContract.withdraw(
          contract.tokenAddress,
          withdrawAmountBigInt.toString(),
          address
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
        setWithdrawAmount('0');
      }
    } catch (error) {
      console.error(`Failed to withdraw ${contract.asset}:`, error);
      toast.error(`Failed to withdraw ${contract.asset}`, { 
        id: loadingToast, 
        ...toastStyles.error 
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <>
      <ToastPortal />
      <CardWrapper>
        <FlipContainer isFlipped={isFlipped}>
          <CardFront>
            <EarnCardV2
              poolName={contract.name}
              apr={contract.apy.replace('%', '')}
              available={walletUsdcBalance}
              supplied={usdcBalance}
              symbol={contract.asset}
              protocol={contract.protocol}
            />
            <FlipButton onClick={() => setIsFlipped(!isFlipped)}>
              <img src="/flip-over.svg" alt="Flip card" />
            </FlipButton>
          </CardFront>

          <CardBack>
            <EarnCardBackV2
              poolName={contract.name}
              symbol={contract.asset}
              walletBalance={walletUsdcBalance}
              depositedBalance={usdcBalance}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              isDepositing={isDepositing}
              isWithdrawing={isWithdrawing}
            />
            <FlipButton onClick={() => setIsFlipped(!isFlipped)}>
              <img src="/flip-over.svg" alt="Flip card" />
            </FlipButton>
          </CardBack>
        </FlipContainer>
      </CardWrapper>
    </>
  );
}; 