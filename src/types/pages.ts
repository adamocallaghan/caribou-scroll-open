export interface PageConfig {
  name: string;
  color: string;
  textColor: string;
}

export const PAGES: PageConfig[] = [
  { name: 'Dashboard', color: '#FFA6A6', textColor: '#222222' },
  { name: 'Launch', color: '#96DCED', textColor: '#3D3D3D' },
  { name: 'Swap', color: '#4D1A28', textColor: '#EBADCB' },
  { name: 'Lend', color: '#cad9e5', textColor: '#222222' },
  { name: 'Borrow', color: '#143199', textColor: '#dee6ff' },
  { name: 'Mint', color: '#222222', textColor: '#FF4445' },
  { name: 'Earn', color: '#353f54', textColor: '#0AEB9A' },
]; 