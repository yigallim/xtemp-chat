import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Stack,
  Typography,
  TextField,
  Container,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Grid,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Input,
} from "@mui/material";
import { Link, Link as RouterLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  getProfileRequest,
  updateProfileRequest,
  uploadProfilePicture,
} from "../api/profileRequest";
import Loading from "../components/Loading";
import { pfpUrlRoot } from "../api/instance";
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  MENTAL_ILLNESS = "MENTAL_ILLNESS",
}

export default function Profile() {
  const { id, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [changed, setChanged] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfileRequest(id!);
        setEditableProfile({
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          bio: profile.bio,
          gender: profile.gender,
        });
        console.log(profile.pfpUrl);
        setPfpUrl(profile.pfpUrl);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [editableProfile, setEditableProfile] = useState({
    username: "",
    firstName: "",
    lastName: "",
    bio: "",
    gender: Gender.MALE,
  });
  const { username, firstName, lastName, bio, gender } = editableProfile;
  const [validation, setValidation] = useState<Record<string, boolean>>({
    username: true,
    firstName: true,
    lastName: true,
    bio: true,
    gender: true,
  });

  const validateFields = () => {
    const newValidation: Record<string, boolean> = {};
    let isValid = true;

    for (const field in editableProfile) {
      const value = editableProfile[field as keyof typeof editableProfile];
      const isFieldValid = value.trim() !== "";
      newValidation[field] = isFieldValid;
      isValid = isValid && isFieldValid;
    }

    setValidation(newValidation);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      [field]: true,
    }));
    if (!changed) setChanged(true);
  };

  const handleSaveChanges = async () => {
    try {
      const isValid = validateFields();
      if (isValid && changed) {
        await updateProfileRequest(id!, {
          username,
          firstName,
          lastName,
          bio,
          gender,
        });
        setChanged(false);
        setConflict(false);
        setSuccess(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) setConflict(true);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Link to="/chat">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Link>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Profile
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      {loading ? (
        <Loading />
      ) : failed ? (
        <>Failed...</>
      ) : (
        <Container
          className="profile inner-container"
          style={{ paddingTop: 16, paddingBottom: 32 }}
        >
          <Stack gap={4} alignItems="center">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={handleClickOpen}
            >
              <Badge
                badgeContent={
                  <IconButton
                    style={{ backgroundColor: "#1976d2", color: "white", borderRadius: "100px" }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                }
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                overlap="circular"
              >
                <Avatar
                  alt={firstName + " " + lastName}
                  src={pfpUrl ? pfpUrlRoot + "/" + pfpUrl : "/pfp.gif"}
                  sx={{ height: 150, width: 150 }}
                />
              </Badge>
            </IconButton>

            <Grid container spacing={2}>
              {changed && (
                <Grid item xs={12}>
                  <Alert severity="warning">Profile Change Not Saved</Alert>
                </Grid>
              )}
              {conflict && (
                <Grid item xs={12}>
                  <Alert severity="error">Username existed, try another one</Alert>
                </Grid>
              )}
              {success && !changed && (
                <Grid item xs={12}>
                  <Alert severity="success">Profile changes saved successfully!</Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  fullWidth
                  error={!validation.username}
                  helperText={!validation.username && "Username cannot be empty"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={!validation.firstName}
                  helperText={!validation.firstName && "First Name cannot be empty"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={!validation.lastName}
                  helperText={!validation.lastName && "Last Name cannot be empty"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  value={bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  error={!validation.bio}
                  helperText={!validation.bio && "Bio cannot be empty"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  value={gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  error={!validation.gender}
                  helperText={!validation.gender && "Please select a gender"}
                >
                  {Object.values(Gender).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button to="/login" onClick={logout} component={RouterLink}>
              Logout
            </Button>
          </Stack>
        </Container>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData();
            formData.append("file", selectedFile!);
            try {
              const pfpUrl = await uploadProfilePicture(id!, formData);
              setPfpUrl(pfpUrl);
            } catch (error) {
              console.error("Error uploading profile picture:", error);
            } finally {
              handleClose();
            }
          },
        }}
        fullWidth
      >
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            You can change your profile picture by uploading it.
          </DialogContentText>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box ml={3}>
              <Input
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={handleFileChange}
                sx={{ display: "none" }}
                id="upload-file"
                name="imageFile"
              />
              <label htmlFor="upload-file">
                <Button variant="outlined" component="span" size="small">
                  Upload
                </Button>
              </label>
            </Box>
            <Box ml={4}>
              <Avatar
                alt={selectedFile === null ? "File Not Found" : "Invalid File Type"}
                src={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
                sx={{ height: 150, width: 150, my: 2 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={selectedFile === null} type="submit">
            Change Profile Picture
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
