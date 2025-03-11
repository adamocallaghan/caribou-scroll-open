import styled from 'styled-components';
import { useState } from 'react';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
  margin-top: 30px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #4287f5 0%, #5C9FFF 50%, #76B7FF 100%);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: #FFFFFF;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const Table = styled.div`
  width: 100%;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: auto 2fr 1fr auto;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled(TableRow)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
`;

const TokenIcon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.span`
  color: #FFFFFF;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TokenTicker = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
`;

const Volume = styled.span`
  color: #FFFFFF;
  font-size: 0.875rem;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 1rem;
    height: 1rem;
    fill: #FFFFFF;
  }
`;

const CopiedTooltip = styled.div<{ isVisible: boolean }>`
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  pointer-events: none;
  transition: opacity 0.2s;
  opacity: ${props => props.isVisible ? 1 : 0};
`;

const TRENDING_TOKENS = [
  {
    name: "Pencils Protocol",
    ticker: "DAPP",
    address: "0xb0643F7b3e2E2F10FE4e38728a763eC05f4ADeC3",
    icon: "https://scrollscan.com/token/images/pencilstoken_32.png",
    volume: "$1.2M"
  },
  {
    name: "Scroll",
    ticker: "SCR",
    address: "0xd29687c813D741E2F938F4aC377128810E217b1b",
    icon: "https://scrollscan.com/token/images/scroll_32.png",
    volume: "$892K"
  },
  {
    name: "Nuri Exchange",
    ticker: "NURI",
    address: "0xAAAE8378809bb8815c08D3C59Eb0c7D1529aD769",
    icon: "https://dd.dexscreener.com/ds-data/tokens/scroll/0xaaae8378809bb8815c08d3c59eb0c7d1529ad769.png",
    volume: "$456K"
  }
];

export const TrendingTokens = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <Header>
            <Title>Trending Tokens</Title>
            <Description>Popular tokens on Scroll</Description>
          </Header>

          <Table>
            <TableHeader>
              <div></div>
              <div>Token</div>
              <div>Volume</div>
              <div></div>
            </TableHeader>
            {TRENDING_TOKENS.map((token) => (
              <TableRow key={token.address}>
                <TokenIcon src={token.icon} alt={token.name} />
                <TokenInfo>
                  <TokenName>{token.name}</TokenName>
                  <TokenTicker>{token.ticker}</TokenTicker>
                </TokenInfo>
                <Volume>{token.volume}</Volume>
                <CopyButton onClick={() => handleCopy(token.address)} title="Copy address">
                  <svg viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </CopyButton>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
      <CopiedTooltip 
        isVisible={!!copiedAddress}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        Address copied!
      </CopiedTooltip>
    </CardWrapper>
  );
}; 