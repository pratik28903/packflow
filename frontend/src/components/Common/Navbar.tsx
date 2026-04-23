import {
  Box,
  TextField,
  IconButton,
  Avatar,
  Popover,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function Navbar({ collapsed, setCollapsed }: any) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  let user: any = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        height: 70,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder="Search mockups, orders..."
          sx={{ width: 300 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton>
          <DarkModeIcon />
        </IconButton>

        <IconButton>
          <NotificationsIcon />
        </IconButton>

        <Avatar
          sx={{ bgcolor: "#7C3AED", cursor: "pointer" }}
          onClick={handleOpen}
        >
          {user?.name ? user.name[0].toUpperCase() : "U"}
        </Avatar>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                width: 220,
                borderRadius: 3,
                p: 1,
                mt: 1,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>
              {user?.name || "User"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user?.email || "No email"}
            </Typography>
          </Box>

          <Divider />

          <Button
            fullWidth
            onClick={handleLogout}
            sx={{
              justifyContent: "center",
              px: 2,
              color: "red",
            }}
          >
            Log out
          </Button>
        </Popover>
      </Box>
    </Box>
  );
}