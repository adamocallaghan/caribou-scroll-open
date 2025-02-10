import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, formatUnits } from 'ethers';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AmountSlider } from './AmountSlider';

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px;
  max-width: 100%;
  box-sizing: border-box;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const ProtocolLogo = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const ProtocolName = styled.div`
  font-size: 1.1rem;
  margin: 0;
`;

const MarketInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 0.9rem;
`;

const MarketName = styled.div`
  font-size: 1rem;
`;

const APY = styled.div`
  font-size: 1rem;
  color: #0AEB9A;
  &:before {
    content: '•';
    margin-right: 5px;
  }
`;

const BalanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  margin: 10px 0;
  gap: 20px;
`;

const Balance = styled.div`
  text-align: center;
  flex: 1;
  
  .label {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-bottom: 3px;
  }
  
  .amount {
    font-size: 0.9rem;
    white-space: nowrap;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 2px;

  button {
    min-width: 100px;
    padding: 8px;
    font-size: 0.9rem;
    white-space: nowrap;
  }
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

// Update AmountSlider styles
const SliderContainer = styled.div`
  width: 100%;
  margin: 5px 0;
`;

const SliderTrack = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 5px;
`;

const AmountDisplay = styled.div`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 3px;
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
const CardWrapper = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 100%;
`;

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
  padding-bottom: 60px;
  max-width: 100%;
  box-sizing: border-box;
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
  padding-bottom: 60px;
  max-width: 100%;
  box-sizing: border-box;
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
    bottom: calc(env(safe-area-inset-bottom) + 60px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

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
    <CardWrapper>
      <FlipContainer isFlipped={isFlipped}>
        <CardFront>
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
          {contract.logoUrl && (
            <ProtocolLogo src={contract.logoUrl} alt={contract.protocol} />
          )}
          <ProtocolName>{contract.protocol}</ProtocolName>
          
          <MarketInfo>
            <MarketName>{contract.name}</MarketName>
            <APY>{contract.apy}</APY>
          </MarketInfo>

          <BalanceContainer>
            <Balance>
              <div className="label">Available</div>
              <div className="amount">${walletUsdcBalance} {contract.asset}</div>
            </Balance>
            <Balance>
              <div className="label">Supplied</div>
              <div className="amount">${usdcBalance} {contract.asset}</div>
            </Balance>
          </BalanceContainer>

          <FlipButton onClick={() => setIsFlipped(!isFlipped)}>
            <img src="/flip-card.png" alt="Flip card" />
          </FlipButton>
        </CardFront>

        <CardBack>
          <ButtonContainer>
            <SliderSection>
              <AmountSlider
                maxAmount={walletUsdcBalance}
                asset={contract.asset}
                onChange={setDepositAmount}
              />
            </SliderSection>
            <ActionRow>
              <button 
                onClick={handleDeposit}
                disabled={isDepositing || parseFloat(depositAmount) === 0}
              >
                {isDepositing ? 'Depositing...' : 'Deposit'}
              </button>
              <AmountText>
                ${parseFloat(depositAmount).toFixed(2)} {contract.asset}
              </AmountText>
            </ActionRow>

            <SliderSection>
              <AmountSlider
                maxAmount={usdcBalance}
                asset={contract.asset}
                onChange={setWithdrawAmount}
              />
            </SliderSection>
            <ActionRow>
              <button 
                onClick={handleWithdraw}
                disabled={isWithdrawing || parseFloat(withdrawAmount) === 0}
              >
                {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
              </button>
              <AmountText>
                ${parseFloat(withdrawAmount).toFixed(2)} {contract.asset}
              </AmountText>
            </ActionRow>
          </ButtonContainer>

          <FlipButton onClick={() => setIsFlipped(!isFlipped)}>
            <img src="/flip-card.png" alt="Flip card" />
          </FlipButton>
        </CardBack>
      </FlipContainer>
    </CardWrapper>
  );
}; 