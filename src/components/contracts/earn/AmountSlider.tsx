import styled from 'styled-components';
import { useState } from 'react';

const SliderContainer = styled.div`
  width: 100%;
  margin: 0;
`;

const SliderTrack = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 4px;
`;

const SliderInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #222222;
  outline: none;
  margin: 8px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #222222;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const Increment = styled.button<{ active: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${props => props.active ? '#222222' : '#f3c86c'};
  background: ${props => props.active ? '#22222222' : 'transparent'};
  color: ${props => props.active ? '#222222' : '#222222'};
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #222222;
  }
`;

interface AmountSliderProps {
  maxAmount: string;
  onChange: (amount: string) => void;
}

export const AmountSlider = ({ maxAmount, onChange }: AmountSliderProps) => {
  const [value, setValue] = useState(0);
  const increments = [0, 25, 50, 100];
  const maxAmountNum = parseFloat(maxAmount);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    const amount = (maxAmountNum * newValue / 100).toFixed(2);
    onChange(amount);
  };

  const handleIncrementClick = (increment: number) => {
    setValue(increment);
    const amount = (maxAmountNum * increment / 100).toFixed(2);
    onChange(amount);
  };

  return (
    <SliderContainer>
      <SliderTrack>
        {increments.map((increment) => (
          <Increment
            key={increment}
            active={value === increment}
            onClick={() => handleIncrementClick(increment)}
          >
            {increment}%
          </Increment>
        ))}
      </SliderTrack>
      <SliderInput
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleSliderChange}
      />
    </SliderContainer>
  );
}; 