import { createAppKit } from '@reown/appkit/react'
import { networks, projectId, metadata, ethersAdapter } from './config'
import { ActionButtonList } from './components/ActionButtonList'
import { PageContainer } from './components/PageContainer'
import styled from 'styled-components'
import { useState } from 'react'

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
    analytics: true // Optional - defaults to your Cloud configuration
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
  const [transactionHash, setTransactionHash] = useState('');
  const [signedMsg, setSignedMsg] = useState('');
  const [balance, setBalance] = useState('');

  const handleHash = (hash: string) => {
    setTransactionHash(hash);
    console.log('Transaction hash:', hash);
  };

  const handleSignMsg = (sig: string) => {
    setSignedMsg(sig);
    console.log('Signature:', sig);
  };

  const handleBalance = (balance: string) => {
    setBalance(balance);
    console.log('Balance:', balance);
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
