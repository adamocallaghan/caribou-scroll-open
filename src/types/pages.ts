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
    color: '#6356E4',
    textColor: '#dee6ff',
    subPages: Array.from({ length: 4 }, (_, i) => ({ name: `Dashboard ${i + 1}`, index: i }))
  },
  {
    name: 'Swap',
    color: '#96DCED',
    textColor: '#3D3D3D',
    subPages: Array.from({ length: 4 }, (_, i) => ({ name: `Launch ${i + 1}`, index: i }))
  },
  {
    name: 'Predict',
    color: '#4D1A28',
    textColor: '#EBADCB',
    subPages: Array.from({ length: 4 }, (_, i) => ({ name: `Swap ${i + 1}`, index: i }))
  },
  {
    name: 'Earn',
    color: '#353f54',
    textColor: '#0AEB9A',
    subPages: Array.from({ length: 4 }, (_, i) => ({ name: `Earn ${i + 1}`, index: i }))
  },
  {
    name: 'Mint',
    color: '#143199',
    textColor: '#dee6ff',
    subPages: Array.from({ length: 4 }, (_, i) => ({ name: `Borrow ${i + 1}`, index: i }))
  },
  {
    name: 'Launch',
    color: '#222222',
    textColor: '#FF4445',
    subPages: Array.from({ length: 4 }, (_, i) => ({ name: `Mint ${i + 1}`, index: i }))
  },
  {
    name: 'Social',
    color: '#cad9e5',
    textColor: '#222222',
    subPages: Array.from({ length: 4 }, (_, i) => ({ name: `Earn ${i + 1}`, index: i }))
  },
]; 