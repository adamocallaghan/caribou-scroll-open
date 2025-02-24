import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';

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

const Balance = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 0.25rem;
`;

// Mock data
const portfolioData = [
  { date: "Mon", value: 31000 },
  { date: "Tue", value: 32400 },
  { date: "Wed", value: 31800 },
  { date: "Thu", value: 34200 },
  { date: "Fri", value: 35100 },
  { date: "Sat", value: 34800 },
  { date: "Sun", value: 36500 },
];

export const PortfolioCardFront = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const { address } = useAppKitAccount();

  useEffect(() => {
    // Calculate total value from PortfolioCardBack
    // This should ideally be lifted to a parent component or context
    // For now, we'll generate sample data based on the current total
    const generateChartData = (currentValue: number) => {
      const days = 7;
      const data = [];
      let value = currentValue;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toLocaleDateString(),
          value: i === 0 ? value : value / (1.05 ** (days - i))
        });
      }
      
      setChartData(data);
    };

    // Set a sample total value - this should be calculated from actual balances
    const sampleTotal = 10000; // Replace with actual total from token balances
    setTotalValue(sampleTotal);
    generateChartData(sampleTotal);
  }, [address]);

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