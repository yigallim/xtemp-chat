import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useSnackbar } from "../components/SnackbarExcerpt";
import { Link as RouterLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { Alert } from "@mui/material";

export default function Login() {
  const { handleSnackbarOpen, placeholder } = useSnackbar();
  const { login } = useAuth();
  const [failed, setFailed] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { username, password } = formData;

    if (username.trim() === "") {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        username: "Please enter a username.",
      }));
      return;
    }

    if (password.length < 8) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters long.",
      }));
      return;
    }

    const asyncLogin = async () => {
      const success = await login(username, password);
      if (!success) setFailed(true);
    };

    asyncLogin();
  };

  return (
    <Container className="inner-container" style={{ display: "flow-root", paddingBottom: 32 }}>
      {placeholder}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {failed && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Wrong Username or Password, Try Again !
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            error={Boolean(validationErrors.username)}
            helperText={validationErrors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(validationErrors.password)}
            helperText={validationErrors.password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                to=""
                component={RouterLink}
                onClick={() =>
                  handleSnackbarOpen("Congratulations, you've just lost your account.", "success")
                }
                variant="body2"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link variant="body2" to="/register" component={RouterLink}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
