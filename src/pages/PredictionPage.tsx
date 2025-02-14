import styled from 'styled-components';
import { PredictionCard } from '../components/contracts/prediction/PredictionCard';
import { PREDICTION_MARKETS } from '../contracts/prediction/config';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const MainPageContent = styled.div`
  font-size: 4rem;
  text-align: center;
`;

const PredictImage = styled.img`
  width: 200px;
  height: auto;
  margin-top: 1rem;
`;

interface PredictionPageProps {
  sendHash?: (hash: string) => void;
  pageIndex?: number;
  subPageCount?: number;
}

export const PredictionPage = ({ sendHash = () => {}, pageIndex }: PredictionPageProps) => {
  console.log('PredictionPage rendered with pageIndex:', pageIndex);
  console.log('Available markets:', PREDICTION_MARKETS);

  if (typeof pageIndex === 'undefined') {
    console.log('Rendering main Prediction Markets page');
    return (
      <Container>
        <MainContent>
          <MainPageContent>
            Predict
          </MainPageContent>
          <PredictImage src="/predict.svg" alt="Predict" />
        </MainContent>
      </Container>
    );
  }

  // Get market directly from config - remove the -1 here since we're already subtracting in PageContainer
  const market = PREDICTION_MARKETS[pageIndex];
  console.log('Selected market:', market, 'for index:', pageIndex);
  
  if (!market) {
    console.log('No market found for index:', pageIndex);
    return null;
  }

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