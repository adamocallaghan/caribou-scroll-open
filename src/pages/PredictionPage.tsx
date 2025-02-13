import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, Contract } from 'ethers';
import { PredictionCard } from '../components/contracts/prediction/PredictionCard';
import { PREDICTION_FACTORY } from '../contracts/prediction/types';

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
}

export const PredictionPage = ({ sendHash = () => {}, pageIndex }: PredictionPageProps) => {
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
        const marketArray = Array.from({ length: markets.length }, (_, i) => markets[i]);
        setMarketAddresses(marketArray);
      } catch (error) {
        console.error('Failed to fetch markets:', error);
      }
    };

    fetchMarkets();
  }, [walletProvider]);

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

  if (pageIndex >= marketAddresses.length) {
    return null;
  }

  const currentMarket = marketAddresses[pageIndex];
  console.log('Current market:', currentMarket);
  
  return (
    <Container>
      {currentMarket && (
        <PredictionCard
          marketAddress={currentMarket}
          sendHash={sendHash}
        />
      )}
    </Container>
  );
}; 