import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const UILoader = ({ open }) => {
  return (
    <div sx={{ position: "relative" }}>
      <Backdrop open={open} sx={{ position: "absolute", color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UILoader;
