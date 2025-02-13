export interface PredictionMarketConfig {
  address: string;
  description: string;
}

export const PREDICTION_MARKETS: PredictionMarketConfig[] = [
  {
    address: "0x9922379b9E530DE9070CaF74467CAd7B82f34Cb9",
    description: "Will Bitcoin reach $120,000 in Q1 2025"
  },
  {
    address: "0xe0AE3CeEBecDdBfb92710B37f5174970f3064d95",
    description: "Will the US confirm that aliens exist in 2025"
  },
  {
    address: "0x52B7d489ea8E6885C82b285b72cb5Cc22d5ec37b",
    description: "TikTok sale announced before April"
  }
]; 