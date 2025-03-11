import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';

// Define the markets
const EARN_MARKETS = [
  {
    name: "USDC Lending Pool",
    protocol: "RHO Markets",
    address: "0xAE1846110F72f2DaaBC75B7cEEe96558289EDfc5",
    asset: "USDC",
    rewardToken: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df"
  },
  {
    name: "USDT Lending Pool",
    protocol: "Lore Finance",
    address: "0xC5776416Ea3e88e04E95bCd3fF99b27902da7892",  // Use aToken address for balance
    asset: "USDT",
    rewardToken: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
  },
  {
    name: "USDC Lending Pool",
    protocol: "AAVE",
    address: "0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD",  // Use aToken address for balance
    asset: "USDC",
    rewardToken: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df"
  }
];

// Define the ABI (copy from your EarnContractCard)
const EARN_MARKET_ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function rewardToken() view returns (address)",
  "function rewardRate() view returns (uint256)"
];

interface Position {
  id: string;
  protocol: string;
  token: string;
  balance: number;
  apy: number;
}

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
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletReady, setIsWalletReady] = useState(false);

  // First, check if wallet is ready
  useEffect(() => {
    if (walletProvider && address && chainId) {
      setIsWalletReady(true);
    } else {
      setIsWalletReady(false);
    }
  }, [walletProvider, address, chainId]);

  // Then fetch positions only when wallet is ready
  useEffect(() => {
    if (!isWalletReady) return;

    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const provider = new BrowserProvider(walletProvider!, chainId);

        const positionPromises = EARN_MARKETS.map(async (market) => {
          try {
            console.log(`Fetching position for ${market.name} at address ${market.address}`);
            
            const contract = new Contract(
              market.address,
              EARN_MARKET_ABI,
              provider
            );

            // Log the contract methods we're calling
            console.log(`Calling balanceOf for ${market.name}`);
            const balance = await contract.balanceOf(address);
            console.log(`Raw balance for ${market.name}:`, balance.toString());
            
            const decimals = await contract.decimals();
            const formattedBalance = Number(formatUnits(balance, decimals));
            console.log(`Formatted balance for ${market.name}:`, formattedBalance);

            // Only proceed if there's a balance
            if (formattedBalance >= 0.01) {
              try {
                // Get other contract data
                const [totalSupply, rewardRate, rewardToken] = await Promise.all([
                  contract.totalSupply(),
                  contract.rewardRate(),
                  contract.rewardToken()
                ]);

                // Get reward token decimals
                const rewardTokenContract = new Contract(
                  rewardToken,
                  ["function decimals() view returns (uint8)"],
                  provider
                );
                const rewardDecimals = await rewardTokenContract.decimals();

                // Calculate APY
                const yearlyRewards = Number(formatUnits(rewardRate, rewardDecimals)) * 31536000;
                const poolSize = Number(formatUnits(totalSupply, decimals));
                const apy = (yearlyRewards / poolSize) * 100;

                console.log(`Successfully fetched ${market.name} position:`, {
                  balance: formattedBalance,
                  apy
                });

                return {
                  id: market.address,
                  protocol: market.name,
                  token: market.asset,
                  balance: formattedBalance,
                  apy: Number(apy.toFixed(2))
                };
              } catch (error) {
                console.error(`Error calculating APY for ${market.name}:`, error);
                // Return position with balance but no APY if APY calculation fails
                return {
                  id: market.address,
                  protocol: market.name,
                  token: market.asset,
                  balance: formattedBalance,
                  apy: 0
                };
              }
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${market.name} position:`, error);
            return null;
          }
        });

        const fetchedPositions = (await Promise.all(positionPromises))
          .filter((position): position is Position => position !== null);

        console.log("Final positions:", fetchedPositions);
        setPositions(fetchedPositions);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [isWalletReady, address, chainId, walletProvider]);

  // Render logic
  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <Header>
            <Title>Earn Positions</Title>
            <Description>Your active DeFi earning positions</Description>
          </Header>

          {!isWalletReady ? (
            <div style={{ color: '#FFFFFF', textAlign: 'center' }}>Connect wallet to view positions</div>
          ) : isLoading ? (
            <div style={{ color: '#FFFFFF', textAlign: 'center' }}>Loading positions...</div>
          ) : positions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableCell>Protocol / Token</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>APY</TableCell>
              </TableHeader>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>
                    {position.protocol}
                    <span style={{ color: '#FF69B4', marginLeft: '0.5rem' }}>
                      {position.token}
                    </span>
                  </TableCell>
                  <TableCell>
                    {position.balance.toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <Badge>{position.apy}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <div style={{ color: '#FFFFFF', textAlign: 'center' }}>No active positions found</div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}; 