import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, Contract } from 'ethers';

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
  background: linear-gradient(135deg, #48466D 0%, #6B6992 50%, #E6A4B4 100%);
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
  color: #FF69B4;
  margin: 0;
`;

const Table = styled.div`
  width: 100%;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: auto 2fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled(TableRow)`
  color: #FF69B4;
  font-size: 0.875rem;
  font-weight: 500;
`;

const NFTImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.25rem;
  object-fit: cover;
`;

const NFTName = styled.div`
  color: #FFFFFF;
  font-size: 0.875rem;
`;

const NFTAmount = styled.div`
  color: #FFFFFF;
  font-size: 0.875rem;
  text-align: right;
`;

// NFT Collection configuration from MintContractCard
const NFT_COLLECTIONS = [
  {
    name: "Caribou NFT",
    address: "0x36f4fa06Bbc44910F21db31B754fd91A699dD961",
    imageUrl: "https://cdn.leonardo.ai/users/5fa161d0-2570-4088-9b52-3ce39109b665/generations/1a0ebae2-90bf-496f-9423-cb68065234d5/Leonardo_Phoenix_10_A_stylized_geometrically_represented_Carib_0.jpg"
  },
  {
    name: "Scroll Tarot NFT",
    address: "0x46597C6ae7a02a17038a53a207eEdaDDF565B11f",
    imageUrl: "https://cdn.leonardo.ai/users/5fa161d0-2570-4088-9b52-3ce39109b665/generations/4fd356d0-12fb-4d06-a715-abd59c3e057e/Leonardo_Phoenix_10_A_vintage_style_tarot_card_with_the_word_S_1.jpg"
  },
  {
    name: "The Maze",
    address: "0xD85F3617D147a71e5482CC2Dd789E8bB0A29E04C",
    imageUrl: "/scroll_maze.jpg"
  }
];

const NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

interface NFTHolding {
  name: string;
  imageUrl: string;
  amount: number;
}

export const DigitalCollectiblesCard = () => {
  const [holdings, setHoldings] = useState<NFTHolding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  useEffect(() => {
    const fetchNFTHoldings = async () => {
      if (!walletProvider || !address) return;
      
      setIsLoading(true);
      try {
        const provider = new BrowserProvider(walletProvider, chainId);
        
        const holdingsPromises = NFT_COLLECTIONS.map(async (nft) => {
          try {
            const contract = new Contract(nft.address, NFT_ABI, provider);
            const balance = await contract.balanceOf(address);
            
            if (balance > 0) {
              return {
                name: nft.name,
                imageUrl: nft.imageUrl,
                amount: Number(balance)
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching balance for ${nft.name}:`, error);
            return null;
          }
        });

        const fetchedHoldings = (await Promise.all(holdingsPromises))
          .filter((holding): holding is NFTHolding => holding !== null);

        setHoldings(fetchedHoldings);
      } catch (error) {
        console.error('Failed to fetch NFT holdings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTHoldings();
  }, [address, chainId, walletProvider]);

  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <Header>
            <Title>Digital Collectibles</Title>
            <Description>Your NFT collection</Description>
          </Header>

          {!walletProvider || !address ? (
            <div style={{ color: '#FFFFFF', textAlign: 'center' }}>Connect wallet to view NFTs</div>
          ) : isLoading ? (
            <div style={{ color: '#FFFFFF', textAlign: 'center' }}>Loading NFTs...</div>
          ) : holdings.length > 0 ? (
            <Table>
              <TableHeader>
                <div></div>
                <div>Collection</div>
                <div style={{ textAlign: 'right' }}>Amount</div>
              </TableHeader>
              {holdings.map((nft) => (
                <TableRow key={nft.name}>
                  <NFTImage src={nft.imageUrl} alt={nft.name} />
                  <NFTName>{nft.name}</NFTName>
                  <NFTAmount>{nft.amount}</NFTAmount>
                </TableRow>
              ))}
            </Table>
          ) : (
            <div style={{ color: '#FFFFFF', textAlign: 'center' }}>No NFTs found</div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}; 