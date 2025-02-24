import styled from 'styled-components';

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
  background: rgba(243, 200, 108, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #222222;
`;

const TokenAmount = styled.span`
  font-size: 0.75rem;
  color: #666666;
`;

const TokenValues = styled.div`
  text-align: right;
`;

const TokenValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #222222;
  display: block;
`;

const TokenChange = styled.span<{ isPositive: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.isPositive ? '#15803d' : '#dc2626'};
`;

// Mock data
const tokens = [
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "2.45",
    value: 5123.45,
    priceChange: 2.5,
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: "0.12",
    value: 4892.32,
    priceChange: -1.2,
  },
  {
    name: "Solana",
    symbol: "SOL",
    amount: "145.32",
    value: 2341.87,
    priceChange: 5.7,
  },
];

export const PortfolioCardBack = () => {
  return (
    <CardContent>
      <TokenList>
        {tokens.map((token) => (
          <TokenItem key={token.symbol}>
            <TokenInfo>
              <TokenIcon>
                {token.symbol.charAt(0)}
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
    </CardContent>
  );
}; 