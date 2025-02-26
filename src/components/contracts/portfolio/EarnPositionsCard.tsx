import styled from 'styled-components';
import { useState } from 'react';

// Sample data
const earnPositions = [
  {
    id: "1",
    protocol: "Aave",
    token: "USDC",
    balance: 5000.75,
    apy: 4.2,
  },
  {
    id: "2",
    protocol: "Compound",
    token: "ETH",
    balance: 2.35,
    apy: 3.1,
  },
  {
    id: "3",
    protocol: "Curve",
    token: "ETH-USDC LP",
    balance: 10250.5,
    apy: 8.7,
  },
  {
    id: "4",
    protocol: "Lido",
    token: "stETH",
    balance: 5.75,
    apy: 3.8,
  },
];

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
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: #FFFFFF;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #FF69B4;
  margin: 0;
`;

const Table = styled.div`
  width: 100%;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled(TableRow)`
  color: #FF69B4;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TableCell = styled.div`
  color: #FFFFFF;
  font-size: 0.875rem;
  display: flex;
  align-items: center;

  &:nth-child(2), &:nth-child(3) {
    justify-content: flex-end;
  }
`;

const Badge = styled.span`
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

export const EarnPositionsCard = () => {
  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <Header>
            <Title>Earn Positions</Title>
            <Description>Your active DeFi earning positions</Description>
          </Header>

          <Table>
            <TableHeader>
              <TableCell>Protocol / Token</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>APY</TableCell>
            </TableHeader>
            {earnPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell>
                  {position.protocol}
                  <span style={{ color: '#FF69B4', marginLeft: '0.5rem' }}>
                    {position.token}
                  </span>
                </TableCell>
                <TableCell>
                  {position.balance.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge>{position.apy}%</Badge>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}; 