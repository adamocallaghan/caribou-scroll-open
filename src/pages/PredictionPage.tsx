import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, Contract } from 'ethers';
import { PredictionCard } from '../components/contracts/prediction/PredictionCard';
import { PREDICTION_FACTORY } from '../contracts/prediction/types';
import { PREDICTION_MARKETS } from '../contracts/prediction/config';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainPageContent = styled.div`
  font-size: 2rem;
  text-align: center;
`;

interface PredictionPageProps {
  sendHash?: (hash: string) => void;
  pageIndex?: number;
  subPageCount?: number;
}

export const PredictionPage = ({ 
  sendHash = () => {}, 
  pageIndex,
  subPageCount 
}: PredictionPageProps) => {
  const [marketAddresses, setMarketAddresses] = useState<string[]>([]);
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  useEffect(() => {
    const fetchMarkets = async () => {
      if (!walletProvider) return;

      try {
        const provider = new BrowserProvider(walletProvider);
        const factory = new Contract(
          PREDICTION_FACTORY.address,
          PREDICTION_FACTORY.abi,
          provider
        );

        const markets = await factory.getMarkets();
        console.log('Fetched markets:', markets);
        const marketArray = Array.from(
          { length: Math.min(markets.length, subPageCount || markets.length) }, 
          (_, i) => markets[i]
        );
        setMarketAddresses(marketArray);
      } catch (error) {
        console.error('Failed to fetch markets:', error);
      }
    };

    fetchMarkets();
  }, [walletProvider, subPageCount]);

  console.log('Current pageIndex:', pageIndex);
  console.log('Current marketAddresses:', marketAddresses);

  if (typeof pageIndex === 'undefined') {
    return (
      <Container>
        <MainPageContent>
          Prediction Markets
        </MainPageContent>
      </Container>
    );
  }

  if (!marketAddresses.length || pageIndex >= marketAddresses.length) {
    return null;
  }

  const currentMarket = marketAddresses[pageIndex];
  console.log('Current market:', currentMarket);
  
  // Use the static config instead of fetching from contract
  const market = PREDICTION_MARKETS[pageIndex];
  
  if (!market) return null;

  return (
    <Container>
      <PredictionCard
        marketAddress={market.address}
        description={market.description}
        sendHash={sendHash}
      />
    </Container>
  );
}; 