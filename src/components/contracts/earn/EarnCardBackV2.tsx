import styled from 'styled-components';
import { useState } from 'react';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #f3c86c 0%, #ffecd1 50%, #fff6e5 100%);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #92400e;
  margin: 0;
`;

const TabsContainer = styled.div`
  width: 100%;
`;

const TabsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: rgba(243, 200, 108, 0.2);
  padding: 0.25rem;
  border-radius: 0.5rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: ${props => props.active ? 'rgba(243, 200, 108, 0.4)' : 'transparent'};
  color: #92400e;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(243, 200, 108, 0.3);
  }
`;

const InputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const InputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #92400e;
`;

const Balance = styled.span`
  font-size: 0.875rem;
  color: #92400e;
  opacity: 0.8;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(243, 200, 108, 0.3);
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.5);
  text-align: right;
  font-size: 1rem;
  color: #92400e;

  &:focus {
    outline: none;
    border-color: rgba(243, 200, 108, 0.5);
  }
`;

const TokenSymbol = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #92400e;
  min-width: 60px;
`;

const SliderContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SliderMarkers = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #92400e;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #f59e0b, #f3c86c);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(to right, #d97706, #eab308);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface EarnCardBackV2Props {
  poolName: string;
  symbol: string;
  walletBalance: string;
  depositedBalance: string;
  apy: string;
  onDeposit: (amount: string) => Promise<void>;
  onWithdraw: (amount: string) => Promise<void>;
  isDepositing: boolean;
  isWithdrawing: boolean;
}

export const EarnCardBackV2 = ({
  poolName,
  symbol,
  walletBalance,
  depositedBalance,
  apy,
  onDeposit,
  onWithdraw,
  isDepositing,
  isWithdrawing
}: EarnCardBackV2Props) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('0.00');
  const [percentage, setPercentage] = useState(0);

  const maxAmount = activeTab === 'deposit' ? 
    parseFloat(walletBalance) : 
    parseFloat(depositedBalance);

  const handleSliderChange = (value: number) => {
    setPercentage(value);
    setAmount((maxAmount * (value / 100)).toFixed(2));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    setAmount(value.toFixed(2));
    setPercentage((value / maxAmount) * 100);
  };

  const handleAction = () => {
    if (activeTab === 'deposit') {
      onDeposit(amount);
    } else {
      onWithdraw(amount);
    }
  };

  return (
    <Card>
      <CardContent>
        <Header>
          <Title>{poolName}</Title>
        </Header>

        <TabsContainer>
          <TabsList>
            <TabButton 
              active={activeTab === 'deposit'} 
              onClick={() => setActiveTab('deposit')}
            >
              Deposit
            </TabButton>
            <TabButton 
              active={activeTab === 'withdraw'} 
              onClick={() => setActiveTab('withdraw')}
            >
              Withdraw
            </TabButton>
          </TabsList>

          <InputContainer>
            <InputHeader>
              <Label>Amount</Label>
              <Balance>
                {activeTab === 'deposit' ? 'Balance' : 'Deposited'}: {
                  activeTab === 'deposit' ? walletBalance : depositedBalance
                } {symbol}
              </Balance>
            </InputHeader>
            <InputWrapper>
              <Input 
                type="number"
                value={amount}
                onChange={handleAmountChange}
              />
              <TokenSymbol>{symbol}</TokenSymbol>
            </InputWrapper>
          </InputContainer>

          <SliderContainer>
            <SliderMarkers>
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </SliderMarkers>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </SliderContainer>

          <ActionButton
            onClick={handleAction}
            disabled={isDepositing || isWithdrawing || parseFloat(amount) === 0}
          >
            {activeTab === 'deposit' 
              ? (isDepositing ? 'Depositing...' : 'Deposit')
              : (isWithdrawing ? 'Withdrawing...' : 'Withdraw')
            }
          </ActionButton>
        </TabsContainer>
      </CardContent>
    </Card>
  );
}; 