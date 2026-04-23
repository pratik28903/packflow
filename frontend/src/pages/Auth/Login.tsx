import { useState } from "react";
import { login } from "../../context/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import Grid from "@mui/material/Grid";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
} from "@mui/material";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<any>({});

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: any = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Min 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const data = await login(form);
    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify(data.user));

    loginUser(data);

    navigate("/dashboard");

  } catch (err: any) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <Grid container sx={{ minHeight: "100vh" }}>

      {/* LEFT */}
      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "white",
          p: { md: 4, lg: 8 },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: "bold" }}>
            PackFlow 🚀
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Streamline your workflow
          </Typography>
        </Box>
      </Grid>

      {/* RIGHT */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
    px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        <Paper sx={{ p: { xs: 3, md: 4 }, width: "100%", maxWidth: 400, mx: "auto" }}>
          <Typography align="center" sx={{ mb: 2 }}>
            Welcome Back 👋
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
              Login
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Link component={RouterLink} to="/register">
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;