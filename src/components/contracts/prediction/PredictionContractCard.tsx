import { PredictionCardV2 } from './PredictionCardV2';
import { PREDICTION_MARKETS } from '../../../contracts/prediction/config';

interface PredictionContractCardProps {
  sendHash: (hash: string) => void;
  contractIndex: number;
}

export const PredictionContractCard = ({ sendHash, contractIndex }: PredictionContractCardProps) => {
  const market = PREDICTION_MARKETS[contractIndex];
  
  if (!market) return null;

  return (
    <PredictionCardV2
      marketAddress={market.address}
      description={market.description}
      sendHash={sendHash}
    />
  );
}; 