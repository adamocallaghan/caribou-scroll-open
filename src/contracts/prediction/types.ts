export interface PredictionMarketFactory {
  address: string;
  abi: string[];
}

export interface PredictionMarket {
  address: string;
  abi: string[];
}

export const PREDICTION_FACTORY: PredictionMarketFactory = {
  address: "0xCAfA19a7252E58f8c7d5722117F0D3AAA6a1A28e",
  abi: [
    "function getMarkets() external view returns (address[] memory)"
  ]
};

export const PREDICTION_MARKET_ABI = [
  "function description() external view returns (string memory)",
  "function marketOutcome() external view returns (uint8)",
  "function isSettled() external view returns (bool)",
  "function trueBets(address) external view returns (uint256)",
  "function falseBets(address) external view returns (uint256)",
  "function totalTrueBets() external view returns (uint256)",
  "function totalFalseBets() external view returns (uint256)",
  "function betTrue() external payable",
  "function betFalse() external payable"
]; 