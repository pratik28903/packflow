import { useState } from "react";
import { register } from "../../context/authService";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Container,
  Box,
  TextField,
  Button,
  Link,
  Typography,
  Paper,
  MenuItem
} from "@mui/material";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const [errors, setErrors] = useState<any>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: any = {};

    if (!form.name) {
      newErrors.name = "Name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await register(form);
      alert("Registration successful");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 10, borderRadius: 3 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Create Account 🚀
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            error={!!errors.name}
            helperText={errors.name}
          />

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

          <TextField
            select
            fullWidth
            label="Role"
            margin="normal"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="designer">Designer</MenuItem>
          </TextField>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, borderRadius: 2 }}
            type="submit"
            disabled={!form.name || !form.email || !form.password}
          >
            Register
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;