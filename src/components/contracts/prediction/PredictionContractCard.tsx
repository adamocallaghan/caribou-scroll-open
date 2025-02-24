import { PredictionCardV2 } from './PredictionCardV2';
import { PREDICTION_MARKETS } from '../../../contracts/prediction/config';
import styled from 'styled-components';

interface PredictionContractCardProps {
  sendHash: (hash: string) => void;
  contractIndex: number;
}

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
`;

export const PredictionContractCard = ({ sendHash, contractIndex }: PredictionContractCardProps) => {
  const market = PREDICTION_MARKETS[contractIndex];
  
  if (!market) return null;

  return (
    <CardWrapper>
      <PredictionCardV2
        marketAddress={market.address}
        description={market.description}
        sendHash={sendHash}
      />
    </CardWrapper>
  );
}; 