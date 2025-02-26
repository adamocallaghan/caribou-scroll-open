import styled from 'styled-components';
import { HorizontalPages } from '../components/HorizontalPages';
import { EarnPositionsCard } from '../components/contracts/portfolio/EarnPositionsCard';

const PageContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Logo = styled.img`
  max-width: 300px;
  height: auto;
`;

export const DashboardPage = () => {
  const subPages = [
    { name: 'Portfolio', index: 0 },
    { name: 'Earn Positions', index: 1 }
  ];

  return (
    <HorizontalPages 
      subPages={subPages}
      bgColor="#48466D"
      textColor="#FF69B4"
      pageType="Dashboard"
    >
      <PageContent>
        <LogoContainer>
          <Logo src="caribou-logo-text-2.png" alt="Caribou Logo" />
        </LogoContainer>
      </PageContent>
    </HorizontalPages>
  );
}; 