import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #f3c86c 0%, #ffecd1 50%, #fff6e5 100%);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  color: #666666;
  margin: 0;
  margin-bottom: 0.25rem;
`;

const PortfolioValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #222222;
  margin-bottom: 0.25rem;
`;

const ChangeIndicator = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.isPositive ? '#15803d' : '#dc2626'};
`;

const ChartContainer = styled.div`
  height: 180px;
  width: 100%;
  margin: 1rem 0;
`;

const TokenList = styled.div`
  margin-top: 1.5rem;
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

// Mock data (you can replace this with real data)
const portfolioData = [
  { date: "Mon", value: 31000 },
  { date: "Tue", value: 32400 },
  { date: "Wed", value: 31800 },
  { date: "Thu", value: 34200 },
  { date: "Fri", value: 35100 },
  { date: "Sat", value: 34800 },
  { date: "Sun", value: 36500 },
];

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

interface PortfolioCardV2Props {
  // Add any props you need
}

export const PortfolioCardV2 = ({}: PortfolioCardV2Props) => {
  const totalValue = tokens.reduce((acc, token) => acc + token.value, 0);
  const weekChange = 4.2;

  return (
    <Card>
      <CardContent>
        <Header>
          <Title>Total Portfolio Value</Title>
          <PortfolioValue>${totalValue.toLocaleString()}</PortfolioValue>
          <ChangeIndicator isPositive={weekChange >= 0}>
            {weekChange >= 0 ? '↑' : '↓'} {Math.abs(weekChange)}% past week
          </ChangeIndicator>
        </Header>

        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioData}>
              <XAxis 
                dataKey="date" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{
                        background: 'white',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '0.25rem',
                      }}>
                        <div>${payload[0].value}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#92400e" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

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
    </Card>
  );
}; 