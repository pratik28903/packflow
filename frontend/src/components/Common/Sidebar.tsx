import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import UploadIcon from "@mui/icons-material/Upload";
import PersonIcon from "@mui/icons-material/Person";

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

type MenuSection = {
  section: string;
  items: MenuItem[];
};

const Sidebar = ({ collapsed }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menu: MenuSection[] = [
    {
      section: "WORKSPACE",
      items: [
        { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { label: "Mockups", icon: <ImageIcon />, path: "/mockups" },
        { label: "Orders", icon: <ShoppingBagIcon />, path: "/orders" },
      ],
    },

    ...(user?.role === "designer"
      ? [
        {
          section: "DESIGNER",
          items: [
            {
              label: "Upload Mockup",
              icon: <UploadIcon />,
              path: "/upload",
            },
          ],
        },
      ]
      : []),

    {
      section: "ACCOUNT",
      items: [
        { label: "Profile", icon: <PersonIcon />, path: "/profile" },
      ],
    },
  ];

  return (
    <Box
      sx={{
        width: collapsed ? 70 : 200,
        transition: "0.3s",
        height: "100vh",
        bgcolor: "#fff",
        borderRight: "1px solid #eee",
        p: collapsed ? 1 : 2,
      }}
    >
      {/* LOGO */}
      {!collapsed && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Packly
        </Typography>
      )}

      {menu.map((section) => (
        <Box key={section.section} sx={{ mb: 2 }}>
          {!collapsed && (
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9ca3af",
                mb: 1,
                letterSpacing: "1px",
              }}
            >
              {section.section}
            </Typography>
          )}

          <List disablePadding>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;

              const content = (
                <ListItemButton
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1 : 1.5,
                    py: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    minHeight: 40,
                    color: isActive ? "#6366f1" : "#4b5563",

                    ...(isActive && {
                      bgcolor: "#e0e7ff",
                    }),

                    "&:hover": {
                      bgcolor: "#eef2ff",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 1,
                      justifyContent: "center",
                      color: isActive ? "#6366f1" : "#6b7280",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {!collapsed && (
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 500,
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              );

              return collapsed ? (
                <Tooltip title={item.label} placement="right" key={item.label}>
                  {content}
                </Tooltip>
              ) : (
                content
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default Sidebar;