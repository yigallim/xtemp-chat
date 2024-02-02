import Container from "@mui/material/Container";
import React from "react";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <Container className="root-container" maxWidth="sm">
      {children}
    </Container>
  );
}