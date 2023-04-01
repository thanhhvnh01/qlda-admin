import React, { useRef } from 'react';
import { SnackbarProvider } from 'notistack';
// Component
import { IconButtonAnimate } from '@components/animate';
import Iconify from '@components/iconify';
//

const NotistackProvider = ({ children }) => {
  const notistackRef = useRef(null);

  const onClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      dense
      maxSnack={2}
      preventDuplicate
      autoHideDuration={2000}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      action={(key) => (
        <IconButtonAnimate size="small" onClick={onClose(key)} sx={{ p: 0.5 }}>
          <Iconify icon={'eva:close-fill'} />
        </IconButtonAnimate>
      )}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotistackProvider;
