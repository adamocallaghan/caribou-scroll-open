import { PredictionCard } from './PredictionCard';
import { PREDICTION_MARKETS } from '../../../contracts/prediction/config';
import toast from 'react-hot-toast';

interface PredictionContractCardProps {
  sendHash: (hash: string) => void;
  contractIndex: number;
}

export const PredictionContractCard = ({ sendHash, contractIndex }: PredictionContractCardProps) => {
  const market = PREDICTION_MARKETS[contractIndex];
  
  if (!market) return null;

  return (
    <PredictionCard
      marketAddress={market.address}
      description={market.description}
      sendHash={sendHash}
    />
  );
}; 