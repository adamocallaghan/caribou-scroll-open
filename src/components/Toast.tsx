import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';

export const ToastPortal = () => {
  return createPortal(
    <Toaster 
      position="bottom-center"
      containerStyle={{
        position: 'fixed',
        zIndex: 9999,
        transform: 'none',
        perspective: 'none',
        bottom: 'calc(env(safe-area-inset-bottom) + 100px)'
      }}
      toastOptions={{
        duration: 5000,
        style: {
          minWidth: '200px',
          maxWidth: '300px',
          padding: '12px',
          fontSize: '0.9rem',
          textAlign: 'center',
          transform: 'none',
          perspective: 'none'
        },
      }}
    />,
    document.body
  );
}; 