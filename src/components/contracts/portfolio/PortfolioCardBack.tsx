import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;  // Add horizontal padding
  box-sizing: border-box;
  margin-top: 30px;  // Add this to move it down
`;

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #48466D 0%, #6B6992 50%, #E6A4B4 100%);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TokenList = styled.div`
  margin-top: 1.5rem;
  width: 100%;
`;

const TokenItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(243, 200, 108, 0.2);

  &:last-child {
    border-bottom: none;
  }
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TokenIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #FFFFFF;  // White background for the icons
`;

const TokenIconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.25rem;  // Add some padding to prevent icons from touching the edges
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #FFFFFF;
`;

const TokenAmount = styled.span`
  font-size: 0.75rem;
  color: #FF69B4;
`;

const TokenValues = styled.div`
  text-align: right;
`;

const TokenValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #FFFFFF;
  display: block;
`;

const TokenChange = styled.span<{ isPositive: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.isPositive ? '#15803d' : '#dc2626'};
`;

// Update the token interface to fix the ABI type
interface Token {
  symbol: string;
  name: string;
  address?: string;
  abi?: string[];
}

const TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    abi: [
      "function balanceOf(address account) external view returns (uint256)",
      "function decimals() external view returns (uint8)"
    ]
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
    abi: [
      "function balanceOf(address account) external view returns (uint256)",
      "function decimals() external view returns (uint8)"
    ]
  }
];

// Add token icon URLs
const TOKEN_ICONS = {
  ETH: "https://scrollscan.com/token/images/weth_28.png",
  USDC: "https://scrollscan.com/token/images/usdc_ofc_32.png",
  USDT: "https://scrollscan.com/token/images/tetherusd_new_32.png"
};

export const PortfolioCardBack = () => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const [tokenBalances, setTokenBalances] = useState<Array<{
    symbol: string;
    name: string;
    amount: string;
    value: number;
    priceChange: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      setIsLoading(true);
      if (!walletProvider || !address) {
        console.log("No wallet connected");
        setIsLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider(walletProvider, chainId);
        const balances = await Promise.all(
          TOKENS.map(async (token) => {
            try {
              let balance;
              let decimals = 18;

              if (token.symbol === 'ETH') {
                balance = await provider.getBalance(address);
                console.log(`ETH balance: ${balance}`);
              } else {
                const contract = new Contract(
                  token.address!,
                  token.abi as string[],  // Type assertion here
                  provider
                );
                balance = await contract.balanceOf(address);
                decimals = await contract.decimals();
                console.log(`${token.symbol} balance: ${balance}`);
              }

              const prices: { [key: string]: number } = {
                'ETH': 3500,
                'USDC': 1,
                'USDT': 1
              };

              const formattedBalance = formatUnits(balance, decimals);
              const value = Number(formattedBalance) * prices[token.symbol];

              return {
                symbol: token.symbol,
                name: token.name,
                amount: Number(formattedBalance).toFixed(4),
                value: value,
                priceChange: 5
              };
            } catch (error) {
              console.error(`Error fetching ${token.symbol} balance:`, error);
              return {
                symbol: token.symbol,
                name: token.name,
                amount: '0.0000',
                value: 0,
                priceChange: 0
              };
            }
          })
        );

        console.log("Token balances:", balances);
        setTokenBalances(balances);
      } catch (error) {
        console.error("Failed to fetch token balances:", error);
        setTokenBalances([]);
      }
      setIsLoading(false);
    };

    fetchBalances();
  }, [address, chainId, walletProvider]);

  return (
    <CardWrapper>
      <Card>
        <CardContent>
          {isLoading ? (
            <div style={{ color: '#FFFFFF' }}>Loading balances...</div>
          ) : tokenBalances.length > 0 ? (
            <TokenList>
              {tokenBalances.map((token) => (
                <TokenItem key={token.symbol}>
                  <TokenInfo>
                    <TokenIcon>
                      <TokenIconImage 
                        src={TOKEN_ICONS[token.symbol]} 
                        alt={token.symbol}
                      />
                    </TokenIcon>
                    <TokenDetails>
                      <TokenName>{token.name}</TokenName>
                      <TokenAmount>
                        {token.amount} {token.symbol}
                      </TokenAmount>
                    </TokenDetails>
                  </TokenInfo>
                  <TokenValues>
                    <TokenValue>${token.value.toLocaleString()}</TokenValue>
                    <TokenChange isPositive={token.priceChange >= 0}>
                      {token.priceChange >= 0 ? '+' : ''}{token.priceChange}%
                    </TokenChange>
                  </TokenValues>
                </TokenItem>
              ))}
            </TokenList>
          ) : (
            <div style={{ color: '#FFFFFF' }}>No tokens found</div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}; 