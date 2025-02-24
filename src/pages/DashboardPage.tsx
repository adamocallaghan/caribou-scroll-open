import styled from 'styled-components';
import { HorizontalPages } from '../components/HorizontalPages';
import { PortfolioCardV2 } from '../components/contracts/portfolio/PortfolioCardV2';

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

const DashboardCard = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DashboardPage = () => {
  const subPages = [
    { name: 'Portfolio', index: 0 },
    { name: 'Dashboard 2', index: 1 },
    { name: 'Dashboard 3', index: 2 }
  ];

  return (
    <HorizontalPages 
      subPages={subPages}
      bgColor="#48466D"
      textColor="#3D3D3D"
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