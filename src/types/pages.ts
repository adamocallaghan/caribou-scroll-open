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
    color: '#FFA6A6',
    textColor: '#222222',
    subPages: []
  },
  {
    name: 'Swap',
    color: '#96DCED',
    textColor: '#3D3D3D',
    subPages: []
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
    color: '#f3c86c', // #353f54
    textColor: '#222222', // #0AEB9A
    subPages: Array.from({ length: 3 }, (_, i) => ({ 
      name: `Earn ${i + 1}`, 
      index: i 
    }))
  },
  {
    name: 'Mint',
    color: '#FFA6A6', // #dee6ff
    textColor: '#222222', // #143199
    subPages: Array.from({ length: 3 }, (_, i) => ({ 
      name: `NFT ${i + 1}`, 
      index: i 
    }))
  },
  {
    name: 'Launch',
    color: '#537b83',
    textColor: '#e5f0f0',
    subPages: []
  },
  {
    name: 'Social',
    color: '#cad9e5',
    textColor: '#222222',
    subPages: []
  },
]; 