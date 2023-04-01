import React from "react";
// @mui
import { Dialog } from "@mui/material";

// ----------------------------------------------------------------------

export default function CustomDialog({
  open = false,
  maxWidth = "xs",
  scroll = "body",
  onClose,
  children,
  sx,
  ...other
}) {
  const closeDialog = (e, reason) => {
    if (!!reason && reason === "backdropClick") {
      return;
    }
    onClose();
  };
  return (
    <Dialog fullWidth maxWidth={maxWidth} scroll={scroll} open={open} onClose={closeDialog} {...other}>
      {children}
    </Dialog>
  );
}
