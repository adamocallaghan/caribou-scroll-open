import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, parseEther } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { PREDICTION_MARKET_ABI } from '../../../contracts/prediction/types';

const CardWrapper = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 100dvh;
  max-height: calc(100dvh - env(safe-area-inset-bottom));
  overflow: auto;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  padding-top: 60px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  text-align: center;

  @media (max-width: 768px) {
    padding-bottom: calc(120px + env(safe-area-inset-bottom));
  }
`;

const Description = styled.h2`
  font-size: 1.8rem;
  margin: 0;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const BetButton = styled.button<{ variant: 'yes' | 'no' }>`
  padding: 15px 40px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.variant === 'yes' ? '#4CAF50' : '#F44336'};
  color: white;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Stat = styled.div<{ variant: 'yes' | 'no' }>`
  color: ${props => props.variant === 'yes' ? '#4CAF50' : '#F44336'};
`;

interface PredictionCardProps {
  marketAddress: string;
  description: string;
  sendHash: (hash: string) => void;
}

export const PredictionCard = ({ marketAddress, description, sendHash }: PredictionCardProps) => {
  const [totalTrue, setTotalTrue] = useState<bigint>(BigInt(0));
  const [totalFalse, setTotalFalse] = useState<bigint>(BigInt(0));
  const [isBetting, setIsBetting] = useState(false);

  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  useEffect(() => {
    const fetchTotals = async () => {
      if (!walletProvider) return;

      try {
        const provider = new BrowserProvider(walletProvider);
        const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);

        const [trueBets, falseBets] = await Promise.all([
          contract.totalTrueBets(),
          contract.totalFalseBets()
        ]);

        setTotalTrue(trueBets);
        setTotalFalse(falseBets);
      } catch (error) {
        console.error('Failed to fetch bet totals:', error);
      }
    };

    fetchTotals();
  }, [walletProvider, marketAddress]);

  const calculatePercentage = (value: bigint, total: bigint): string => {
    if (total === BigInt(0)) return '0';
    return ((Number(value) / Number(total)) * 100).toFixed(1);
  };

  const totalBets = totalTrue + totalFalse;
  const truePercentage = calculatePercentage(totalTrue, totalBets);
  const falsePercentage = calculatePercentage(totalFalse, totalBets);

  const handleBet = async (isTrue: boolean) => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    setIsBetting(true);
    const loadingToast = toast.loading(`Placing ${isTrue ? 'Yes' : 'No'} bet...`);

    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, signer);

      const tx = await (isTrue ? 
        contract.betTrue({ value: parseEther('0.000004') }) :
        contract.betFalse({ value: parseEther('0.000004') })
      );

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success('Bet placed successfully!', { id: loadingToast });
        sendHash(tx.hash);
        setTotalTrue(BigInt(0));
      }
    } catch (error) {
      console.error('Failed to place bet:', error);
      toast.error('Failed to place bet', { id: loadingToast });
    } finally {
      setIsBetting(false);
    }
  };

  return (
    <CardWrapper>
      <CardContent>
        <Toaster position="bottom-center" />
        <Description>{description}?</Description>

        <ButtonContainer>
          <div>
            <BetButton
              variant="yes"
              onClick={() => handleBet(true)}
              disabled={isBetting}
            >
              Yes
            </BetButton>
            <Stat variant="yes">{truePercentage}%</Stat>
          </div>

          <div>
            <BetButton
              variant="no"
              onClick={() => handleBet(false)}
              disabled={isBetting}
            >
              No
            </BetButton>
            <Stat variant="no">{falsePercentage}%</Stat>
          </div>
        </ButtonContainer>
      </CardContent>
    </CardWrapper>
  );
}; 