import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract, parseEther } from 'ethers';
import toast from 'react-hot-toast';
import { PREDICTION_MARKET_ABI } from '../../../contracts/prediction/types';
import { ToastPortal } from '../../Toast';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  border-radius: 0.5rem;
`;

const CardContent = styled.div`
  padding: 1rem 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const QuestionSection = styled.div`
  display: flex;
  gap: 0.75rem;
  flex: 1;
`;

const ProfileImage = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(243, 244, 246, 0.3);
  flex-shrink: 0;
`;

const Question = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25;
  margin: 0;
  color: inherit;
`;

const GaugeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const Gauge = styled.div`
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
`;

const GaugeLabel = styled.span`
  font-size: 0.75rem;
  color: inherit;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant: 'yes' | 'no' }>`
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'yes' ? `
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.3);
    color: #e5f0f0;
    &:hover {
      background: rgba(34, 197, 94, 0.2);
      border-color: rgba(34, 197, 94, 0.4);
    }
  ` : `
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #e5f0f0;
    &:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
`;

const Volume = styled.span`
  font-size: 0.875rem;
  color: inherit;
  opacity: 0.8;
`;

interface PredictionCardV2Props {
  marketAddress: string;
  description: string;
  sendHash: (hash: string) => void;
}

export const PredictionCardV2 = ({ marketAddress, description, sendHash }: PredictionCardV2Props) => {
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
  const truePercentage = parseFloat(calculatePercentage(totalTrue, totalBets));
  const isYesWinning = truePercentage >= 50;

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
        // Refresh totals
        const [newTrueBets, newFalseBets] = await Promise.all([
          contract.totalTrueBets(),
          contract.totalFalseBets()
        ]);
        setTotalTrue(newTrueBets);
        setTotalFalse(newFalseBets);
      }
    } catch (error) {
      console.error('Failed to place bet:', error);
      toast.error('Failed to place bet', { id: loadingToast });
    } finally {
      setIsBetting(false);
    }
  };

  return (
    <>
      <ToastPortal />
      <Card>
        <CardContent>
          <Header>
            <QuestionSection>
              <ProfileImage />
              <Question>{description}</Question>
            </QuestionSection>
            <GaugeContainer>
              <Gauge>
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke={isYesWinning ? "#22c55e" : "#ef4444"}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${(truePercentage / 100) * 150.8} 150.8`}
                    style={{ transition: 'all 0.7s ease-out' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {truePercentage}%
                  </span>
                </div>
              </Gauge>
              <GaugeLabel>chance</GaugeLabel>
            </GaugeContainer>
          </Header>

          <ButtonContainer>
            <Button
              variant="yes"
              onClick={() => handleBet(true)}
              disabled={isBetting}
            >
              Buy Yes ↑
            </Button>
            <Button
              variant="no"
              onClick={() => handleBet(false)}
              disabled={isBetting}
            >
              Buy No ↓
            </Button>
          </ButtonContainer>

          <Footer>
            <Volume>Vol: {Number(totalBets) / 1e18} ETH</Volume>
          </Footer>
        </CardContent>
      </Card>
    </>
  );
}; 