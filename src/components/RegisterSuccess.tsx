import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function RegisterSuccess() {
  return (
    <div style={{ height: "100%", display: "grid", placeItems: "center" }}>
      <Stack alignItems="center" textAlign="center">
        <Typography variant="h3" gutterBottom> 
          Account Registered Successfully
        </Typography>
        <Link component={RouterLink} to="/login" variant="body2">
          Back to Login Page
        </Link>
      </Stack>
    </div>
  );
}
