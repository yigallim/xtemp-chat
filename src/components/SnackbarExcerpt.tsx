import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";

type SnackbarExcerptProps = {
  open: boolean;
  onClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
  severity: Severity;
  autoHideDuration?: number;
};

function SnackbarExcerpt({
  open,
  onClose,
  message,
  severity,
  autoHideDuration = 3000,
}: SnackbarExcerptProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      style={{ position: "absolute" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

type UseSnackbarProps = {
  autoHideDuration?: number;
};

export const useSnackbar = ({ autoHideDuration = 3000 }: UseSnackbarProps = {}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<Severity>("info");

  const handleSnackbarOpen = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const SnackbarComponent: React.FC = () => (
    <SnackbarExcerpt
      open={snackbarOpen}
      onClose={handleSnackbarClose}
      message={snackbarMessage}
      severity={snackbarSeverity}
      autoHideDuration={autoHideDuration}
    />
  );

  return {
    handleSnackbarOpen,
    handleSnackbarClose,
    placeholder: <SnackbarComponent />,
  };
};
