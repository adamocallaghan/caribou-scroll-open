import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, MaxUint256 } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { AmountSlider } from './AmountSlider';
import { ToastPortal } from '../../Toast';

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
  background-color: #96DCED;
  color: #3D3D3D;

  @media (max-width: 768px) {
    padding-bottom: calc(120px + env(safe-area-inset-bottom));
  }
`;

const TokenSelect = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #3D3D3D;
  background: white;
  color: #3D3D3D;
  font-size: 1rem;
  width: 200px;
  margin: 10px 0;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3D3D3D;
  }
`;

const SwapButton = styled.button`
  padding: 15px 40px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #3D3D3D;
  color: #96DCED;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SliderContainer = styled.div`
  width: 80%;
  max-width: 300px;
  margin: 20px 0;
`;

const TOKENS = [
  {
    symbol: 'WETH',
    address: '0x5300000000000000000000000000000000000004',
    decimals: 18
  },
  {
    symbol: 'USDC',
    address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
    decimals: 6
  },
  {
    symbol: 'USDT',
    address: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
    decimals: 6
  },
  {
    symbol: 'SCROLL',
    address: '0xd29687c813D741E2F938F4aC377128810E217b1b',
    decimals: 18
  }
];

const NURI_ROUTER = '0xAAAE99091Fbb28D400029052821653C1C752483B';

const TOKEN_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)'
];

const ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut)'
];

export const SwapContractCard = ({ sendHash }: { sendHash: (hash: string) => void }) => {
  const [inputToken, setInputToken] = useState('');
  const [outputToken, setOutputToken] = useState('');
  const [amount, setAmount] = useState('0');
  const [isSwapping, setIsSwapping] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');

  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletProvider || !address || !inputToken) return;

      try {
        const provider = new BrowserProvider(walletProvider, chainId);
        const tokenContract = new Contract(inputToken, TOKEN_ABI, provider);
        const rawBalance = await tokenContract.balanceOf(address);
        const selectedToken = TOKENS.find(t => t.address === inputToken);
        const formattedBalance = (Number(rawBalance) / 10 ** (selectedToken?.decimals || 18)).toString();
        setTokenBalance(formattedBalance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setTokenBalance('0');
      }
    };

    fetchBalance();
  }, [inputToken, address, walletProvider, chainId]);

  const handleInputTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputToken(e.target.value);
    setAmount('0');
  };

  const handleOutputTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputToken(e.target.value);
  };

  const handleSwap = async () => {
    if (!walletProvider || !address || !inputToken || !outputToken) return;
    if (parseFloat(amount) === 0) return;

    setIsSwapping(true);
    const loadingToast = toast.loading('Approving token...');

    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);

      // First approve
      const tokenContract = new Contract(inputToken, TOKEN_ABI, signer);
      const approveTx = await tokenContract.approve(NURI_ROUTER, MaxUint256);
      await approveTx.wait();

      toast.loading('Swapping tokens...', { id: loadingToast });

      // Then swap
      const routerContract = new Contract(NURI_ROUTER, ROUTER_ABI, signer);
      const selectedToken = TOKENS.find(t => t.address === inputToken);
      const amountIn = BigInt(Math.floor(parseFloat(amount) * 10 ** (selectedToken?.decimals || 18)));

      const params = {
        tokenIn: inputToken,
        tokenOut: outputToken,
        fee: 3000,
        recipient: address,
        deadline: 3000000000,
        amountIn,
        amountOutMinimum: 1,
        sqrtPriceLimitX96: 0
      };

      const tx = await routerContract.exactInputSingle(params);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success('Swap successful!', { id: loadingToast });
        sendHash(tx.hash);
      }
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed', { id: loadingToast });
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <>
      <ToastPortal />
      <CardWrapper>
        <CardContent>
          <TokenSelect 
            value={inputToken} 
            onChange={handleInputTokenChange}
          >
            <option value="">Select input token</option>
            {TOKENS.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </TokenSelect>

          <TokenSelect 
            value={outputToken} 
            onChange={handleOutputTokenChange}
          >
            <option value="">Select output token</option>
            {TOKENS.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </TokenSelect>

          <SliderContainer>
            <AmountSlider
              maxAmount={tokenBalance}
              onChange={setAmount}
            />
          </SliderContainer>

          <SwapButton 
            onClick={handleSwap}
            disabled={isSwapping || !inputToken || !outputToken || parseFloat(amount) === 0}
          >
            {isSwapping ? 'Swapping...' : 'Swap'}
          </SwapButton>
        </CardContent>
      </CardWrapper>
    </>
  );
}; 