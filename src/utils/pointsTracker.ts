interface UserAction {
  address: string;
  action: 'earn_position' | 'prediction_bet' | 'nft_mint';
  timestamp: number;
}

interface UserPoints {
  [address: string]: UserAction[];
}

const POINTS_VALUES = {
  earn_position: 15,
  prediction_bet: 10,
  nft_mint: 5
};

const STORAGE_KEY = 'caribou_user_points';

export const logUserAction = async (address: string, action: UserAction['action']) => {
  try {
    let userPoints: UserPoints = {};
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      userPoints = JSON.parse(stored);
    }

    if (!userPoints[address]) {
      userPoints[address] = [];
    }

    userPoints[address].push({
      address,
      action,
      timestamp: Date.now()
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userPoints));
  } catch (error) {
    console.error('Failed to log user action:', error);
  }
};

export const calculateUserPoints = async (address: string): Promise<number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;

    const userPoints: UserPoints = JSON.parse(stored);
    if (!userPoints[address]) return 0;

    return userPoints[address].reduce((total, action) => {
      return total + POINTS_VALUES[action.action];
    }, 0);
  } catch (error) {
    console.error('Failed to calculate user points:', error);
    return 0;
  }
}; 