import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div style={{ height: "calc(100% - 64px)", display: "grid", placeItems: "center" }}>
      <CircularProgress />
    </div>
  );
}
