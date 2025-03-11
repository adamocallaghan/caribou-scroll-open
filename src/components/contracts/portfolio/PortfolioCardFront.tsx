import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
  margin-top: 30px;
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
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  color: #FF69B4;
  margin: 0;
  margin-bottom: 0.25rem;
`;

const PortfolioValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 0.25rem;
`;

const ChartContainer = styled.div`
  height: 180px;
  width: 100%;
  margin: 1rem 0;
`;

// Add interface for chart data
interface ChartDataPoint {
  date: string;
  value: number;
}

// Add token configuration
const TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3500
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    price: 1,
    abi: [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ]
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
    price: 1,
    abi: [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ]
  }
];

// Add Earn markets configuration
const EARN_MARKETS = [
  {
    name: "USDC Lending Pool",
    protocol: "RHO Markets",
    address: "0xAE1846110F72f2DaaBC75B7cEEe96558289EDfc5",
    asset: "USDC",
    price: 1,
    abi: ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"]
  },
  {
    name: "USDT Lending Pool",
    protocol: "Lore Finance",
    address: "0xC5776416Ea3e88e04E95bCd3fF99b27902da7892",
    asset: "USDT",
    price: 1,
    abi: ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"]
  },
  {
    name: "USDC Lending Pool",
    protocol: "AAVE",
    address: "0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD",
    asset: "USDC",
    price: 1,
    abi: ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"]
  }
];

export const PortfolioCardFront = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  useEffect(() => {
    const calculateTotalValue = async () => {
      if (!walletProvider || !address) return;

      try {
        const provider = new BrowserProvider(walletProvider, chainId);
        let total = 0;

        // Calculate token values
        for (const token of TOKENS) {
          try {
            let balance;
            let decimals = 18;

            if (token.symbol === 'ETH') {
              balance = await provider.getBalance(address);
            } else {
              const contract = new Contract(token.address!, token.abi!, provider);
              balance = await contract.balanceOf(address);
              decimals = await contract.decimals();
            }

            const formattedBalance = Number(formatUnits(balance, decimals));
            total += formattedBalance * token.price;
          } catch (error) {
            console.error(`Error fetching ${token.symbol} balance:`, error);
          }
        }

        // Calculate Earn positions values
        for (const market of EARN_MARKETS) {
          try {
            const contract = new Contract(market.address, market.abi, provider);
            const balance = await contract.balanceOf(address);
            const decimals = await contract.decimals();
            const formattedBalance = Number(formatUnits(balance, decimals));
            total += formattedBalance * market.price;
          } catch (error) {
            console.error(`Error fetching ${market.name} balance:`, error);
          }
        }

        setTotalValue(total);

        // Generate chart data based on real total value
        const days = 7;
        const data: ChartDataPoint[] = [];
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // For past days, show 10% less each day back
          const value = i === 0 
            ? total 
            : total / (1.1 ** i); // This will show 10% increase each day
          
          data.push({
            date: date.toLocaleDateString(),
            value
          });
        }
        
        setChartData(data);
      } catch (error) {
        console.error('Error calculating total value:', error);
      }
    };

    calculateTotalValue();
  }, [address, chainId, walletProvider]);

  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <Header>
            <Title>Total Portfolio Value</Title>
            <PortfolioValue>${totalValue.toLocaleString()}</PortfolioValue>
          </Header>

          <ChartContainer>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#FF69B4" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#FF69B4"
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
                  stroke="#FF69B4" 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}; 