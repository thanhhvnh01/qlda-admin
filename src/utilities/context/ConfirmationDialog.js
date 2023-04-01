import { FormattedMessage } from 'react-intl';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';

const ConfirmationDialog = ({ open, title, message, onConfirm, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{message}</DialogContent>

    <DialogActions>
      <Button variant="contained" onClick={onConfirm}>
        <FormattedMessage id="button.agree" defaultMessage="Agree" />
      </Button>
      <Button variant="outlined" onClick={onClose}>
        <FormattedMessage id="button.cancel" defaultMessage="Close" />
      </Button>
    </DialogActions>
  </Dialog>
);

const ConfirmationDialogContext = React.createContext({});

const ConfirmationDialogProvider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const openDialog = ({ title, message, actionCallback }) => {
    setDialogOpen(true);
    setDialogConfig({ title, message, actionCallback });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig.actionCallback(true);
  };

  const onClose = () => {
    resetDialog();
    dialogConfig.actionCallback(false);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ openDialog }}>
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title}
        message={dialogConfig?.message}
        onConfirm={onConfirm}
        onClose={onClose}
      />
      {children}
    </ConfirmationDialogContext.Provider>
  );
};

const useConfirmationDialog = () => {
  const { openDialog } = React.useContext(ConfirmationDialogContext);

  const showConfirmationDialog = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { showConfirmationDialog };
};

export default ConfirmationDialog;
export { ConfirmationDialogProvider, useConfirmationDialog };
