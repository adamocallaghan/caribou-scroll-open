import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';

export const ToastPortal = () => {
  return createPortal(
    <Toaster 
      position="bottom-center"
      containerStyle={{
        position: 'fixed',
        zIndex: 9999,
        transform: 'none'  // Ensure no inherited transforms
      }}
    />,
    document.body
  );
}; 