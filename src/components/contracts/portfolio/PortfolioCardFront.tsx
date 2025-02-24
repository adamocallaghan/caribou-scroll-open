import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';

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

export const PortfolioCardFront = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const { address } = useAppKitAccount();

  useEffect(() => {
    const generateChartData = (currentValue: number) => {
      const days = 7;
      const data: ChartDataPoint[] = [];
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

    const sampleTotal = 10000;
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