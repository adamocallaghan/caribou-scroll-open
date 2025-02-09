import { createAppKit } from '@reown/appkit/react'
import { networks, projectId, metadata, ethersAdapter } from './config'
import { PageContainer } from './components/PageContainer'
import styled from 'styled-components'

import "./App.css"

// Create a AppKit instance
createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata,
  projectId,
  themeMode: 'light',
  chainImages: {
    534351: 'public/scroll.png',
  },
  features: {
    emailShowWallets: false,
    analytics: true
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  }
})

const AppContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const WalletControls = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const WalletButton = styled.div`
  appkit-button {
    display: block;
  }
`;

export function App() {
  const handleHash = (hash: string) => {
    console.log('Transaction hash:', hash);
  };

  return (
    <AppContainer>
      <WalletControls>
        <WalletButton>
          <appkit-button />
        </WalletButton>
      </WalletControls>
      <PageContainer sendHash={handleHash} />
    </AppContainer>
  );
}

export default App
