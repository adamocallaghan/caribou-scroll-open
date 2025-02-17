export interface SubPageConfig {
  name: string;
  index: number;
}

export interface PageConfig {
  name: string;
  color: string;
  textColor: string;
  subPages: SubPageConfig[];
}

export const PAGES: PageConfig[] = [
  {
    name: 'Dashboard',
    color: '#48466d',
    textColor: '#f7579c',
    subPages: Array.from({ length: 4 }, (_, i) => ({ 
      name: `Dashboard ${i + 1}`, 
      index: i 
    }))
  },
  {
    name: 'Swap',
    color: '#96DCED',
    textColor: '#3D3D3D',
    subPages: Array.from({ length: 4 }, (_, i) => ({ 
      name: `Swap ${i + 1}`, 
      index: i 
    }))
  },
  {
    name: 'Predict',
    color: '#006b71',
    textColor: '#e5f0f0',
    subPages: Array.from({ length: 3 }, (_, i) => ({
      name: `Prediction ${i + 1}`,
      index: i
    }))
  },
  {
    name: 'Earn',
    color: '#f3c86c',
    textColor: '#222222',
    subPages: Array.from({ length: 3 }, (_, i) => ({ 
      name: `Earn ${i + 1}`, 
      index: i 
    }))
  },
  {
    name: 'Mint',
    color: '#FFA6A6',
    textColor: '#222222',
    subPages: Array.from({ length: 3 }, (_, i) => ({ 
      name: `NFT ${i + 1}`, 
      index: i 
    }))
  },
  {
    name: 'Launch',
    color: '#537b83',
    textColor: '#e5f0f0',
    subPages: Array.from({ length: 4 }, (_, i) => ({ 
      name: `Launch ${i + 1}`, 
      index: i 
    }))
  },
  {
    name: 'Social',
    color: '#cad9e5',
    textColor: '#222222',
    subPages: Array.from({ length: 4 }, (_, i) => ({ 
      name: `Social ${i + 1}`, 
      index: i 
    }))
  }
]; 