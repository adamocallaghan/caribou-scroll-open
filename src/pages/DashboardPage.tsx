import styled from 'styled-components';
import { PortfolioCardV2 } from '../components/contracts/portfolio/PortfolioCardV2';

const PageContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 80px; // Adjust this value to position below wallet button
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Logo = styled.img`
  max-width: 300px;
  height: auto;
`;

export const DashboardPage = () => {
  return (
    <PageContent>
      <LogoContainer>
        <Logo src="caribou-logo-text-2.png" alt="Caribou Logo" />
      </LogoContainer>
      <PortfolioCardV2 />
    </PageContent>
  );
}; 