"use client";

import { Snackbar } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

interface SnackbarContextType {
  open: boolean;
  message: string;
  showSnackbar: (message: string) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ open, message, showSnackbar, closeSnackbar }}>
      {children}
      {open && (
        <Snackbar open={open} autoHideDuration={3000} onClose={closeSnackbar} message={message} />
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
