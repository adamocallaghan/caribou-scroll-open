import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, MaxUint256 } from 'ethers';
import toast from 'react-hot-toast';
import { ToastPortal } from '../../Toast';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 0.5rem;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.875rem;
`;

const CardContent = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const CardFooter = styled.div`
  padding: 0.5rem 1.5rem 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const TokenSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TokenHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
`;

const TokenBalance = styled.span`
  color: #666;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const TokenInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  min-width: 0;
  &:focus {
    outline: none;
    border-color: #96DCED;
  }
`;

const TokenSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
  width: 120px;
  flex-shrink: 0;
  &:focus {
    outline: none;
    border-color: #96DCED;
  }
`;

const SwapInfo = styled.div`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  width: 100%;
  box-sizing: border-box;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const SwapButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.25rem;
  background: #96DCED;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  box-sizing: border-box;
  display: block;
  margin: 0 auto;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

export const SwapContractCardV2 = ({ sendHash }: { sendHash: (hash: string) => void }) => {
  const [inputToken, setInputToken] = useState('');
  const [outputToken, setOutputToken] = useState('');
  const [amount, setAmount] = useState('');
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

  const handleSwap = async () => {
    if (!walletProvider || !address || !inputToken || !outputToken) return;
    if (parseFloat(amount) === 0) return;

    setIsSwapping(true);
    const loadingToast = toast.loading('Approving token...');

    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);

      const tokenContract = new Contract(inputToken, TOKEN_ABI, signer);
      const approveTx = await tokenContract.approve(NURI_ROUTER, MaxUint256);
      await approveTx.wait();

      toast.loading('Swapping tokens...', { id: loadingToast });

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
        setAmount('');
      }
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed', { id: loadingToast });
    } finally {
      setIsSwapping(false);
    }
  };

  const selectedToken = TOKENS.find(t => t.address === inputToken);
  const formattedBalance = selectedToken ? 
    `${parseFloat(tokenBalance).toFixed(4)} ${selectedToken.symbol}` : 
    '0.00';

  return (
    <>
      <ToastPortal />
      <Card>
        <CardHeader>
          <CardTitle>Swap Tokens</CardTitle>
          <CardDescription>Trade tokens instantly with low fees</CardDescription>
        </CardHeader>
        
        <CardContent>
          <TokenSection>
            <TokenHeader>
              <span>From</span>
              <TokenBalance>Balance: {formattedBalance}</TokenBalance>
            </TokenHeader>
            <InputGroup>
              <TokenInput
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <TokenSelect
                value={inputToken}
                onChange={(e) => {
                  setInputToken(e.target.value);
                  setAmount('');
                }}
              >
                <option value="">Select token</option>
                {TOKENS.map(token => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </TokenSelect>
            </InputGroup>
          </TokenSection>

          <TokenSection>
            <TokenHeader>
              <span>To</span>
              <TokenBalance>
                {outputToken ? 
                  `${TOKENS.find(t => t.address === outputToken)?.symbol}` : 
                  'Select token'}
              </TokenBalance>
            </TokenHeader>
            <InputGroup>
              <TokenInput
                type="number"
                placeholder="0.0"
                value={amount}
                disabled
              />
              <TokenSelect
                value={outputToken}
                onChange={(e) => setOutputToken(e.target.value)}
              >
                <option value="">Select token</option>
                {TOKENS.map(token => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </TokenSelect>
            </InputGroup>
          </TokenSection>

          <SwapInfo>
            <InfoRow>
              <span>Price Impact</span>
              <span>~0.04%</span>
            </InfoRow>
            <InfoRow>
              <span>Network Fee</span>
              <span>~$2.50</span>
            </InfoRow>
          </SwapInfo>
        </CardContent>

        <CardFooter>
          <SwapButton
            onClick={handleSwap}
            disabled={isSwapping || !inputToken || !outputToken || !amount}
          >
            {isSwapping ? 'Swapping...' : 'Swap'}
          </SwapButton>
        </CardFooter>
      </Card>
    </>
  );
}; 