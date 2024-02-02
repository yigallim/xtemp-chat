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
import { Link as RouterLink } from "react-router-dom";
import { MenuItem } from "@mui/material";
import { Gender } from "./Profile";
import { useState } from "react";
import registerRequest from "../api/registerRequest";
import RegisterSuccess from "../components/RegisterSuccess";

export default function Register() {
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    gender: "",
    password: "",
    agreedNotSohai: "",
  });

  const [agreedNotSohai, setAgreedNotSohai] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const username = data.get("username") as string;
    const bio = data.get("bio") as string;
    const gender = data.get("gender") as string;
    const password = data.get("password") as string;

    const errors = {
      firstName: firstName ? "" : "Please enter your first name.",
      lastName: lastName ? "" : "Please enter your last name.",
      username: username ? "" : "Please enter a username.",
      bio: bio ? "" : "Please enter your bio.",
      gender: gender ? "" : "Please select a gender.",
      password: password.length >= 8 ? "" : "Password should be at least 8 characters long.",
      agreedNotSohai: agreedNotSohai ? "" : "Please agree not to be sohai.",
    };

    setValidationErrors(errors);
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    async function asyncRegisterRequest() {
      try {
        await registerRequest({
          username,
          firstName,
          lastName,
          bio,
          gender,
          password,
        });
        setSuccess(true);
      } catch (error: any) {
        if (error.response && error.response.status === 409)
          setValidationErrors({
            ...validationErrors,
            username: "This username is used by someone, try another one",
          });
      }
    }
    asyncRegisterRequest();
  };

  return (
    <Container className="inner-container" style={{ display: "flow-root", paddingBottom: 32 }}>
      {success ? (
        <RegisterSuccess />
      ) : (
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  error={!!validationErrors.username}
                  helperText={validationErrors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Bio"
                  fullWidth
                  id="bio"
                  name="bio"
                  autoComplete="bio"
                  multiline
                  rows={4}
                  error={!!validationErrors.bio}
                  helperText={validationErrors.bio}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="Gender" id="gender" name="gender" value={"MALE"}>
                  {Object.values(Gender).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreedNotSohai}
                      onChange={(element) => setAgreedNotSohai(element.target.checked)}
                      color="primary"
                    />
                  }
                  label="I'm not going to be sohai."
                />
                {validationErrors.agreedNotSohai && (
                  <div>
                    <Typography variant="caption" color="error">
                      {validationErrors.agreedNotSohai}
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Container>
  );
}
