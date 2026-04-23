import { useEffect, useState } from "react";
import API from "../../utils/axios";

import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Card,
  Grid,
  Alert,
  TextField,
  Chip,
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      const data = res.data;

      setUser({
        name:
          data.name ||
          `${data.userFirstName || ""} ${data.userLastName || ""}`,
        email: data.email || data.emailAddress,
        role: data.role || (data.isSupport ? "Designer" : "Client"),
        avatar: data.avatar || "",
        bio: data.bio || "No bio added",
        createdAt: data.createdAt,
      });
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ borderRadius: 4, overflow: "hidden", mb: 3 }}>
        <Box
          sx={{
            height: 140,
            background: "linear-gradient(90deg, #7b61ff, #4dabf7)",
          }}
        />

        <Box sx={{ p: 3, mt: -6 }}>
          <Grid container sx={{ alignItems: "center", spacing: 2 }}>
            <Grid >
              <Avatar
                src={user?.avatar}
                sx={{
                  width: 90,
                  height: 90,
                  border: "4px solid white",
                  fontSize: 32,
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </Grid>

            <Grid >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {user?.name}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip label={user?.role} color="primary" size="small" />
                <Chip label="Verified" color="success" size="small" />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid sx={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personal information
            </Typography>

            <Grid container spacing={2}>
              <Grid sx={{ md: 6, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full name"
                  value={user?.name}
                  disabled
                />
              </Grid>

              <Grid sx={{ md: 6, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  disabled
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Bio"
                  value={user?.bio}
                  multiline
                  rows={3}
                  disabled
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;