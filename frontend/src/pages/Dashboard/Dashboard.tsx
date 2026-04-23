import { Grid, Typography, Box, Button, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RecentOrders from "../../components/RecentOrders";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";

const StatCard = ({ title, value, growth, icon, color, bgColor }: any) => (
  <Card
    sx={{
      p: 3,
      borderRadius: 4,
      boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box
        sx={{
          width: 45,
          height: 45,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: bgColor,
          color: color,
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          fontSize: 13,
          fontWeight: 600,
          bgcolor: "#E6F7EE",
          color: "#22C55E",
        }}
      >
        ↗ {growth}%
      </Box>
    </Box>

    <Typography sx={{ fontSize: 15, color: "#6b7280", mb: 1 }}>
      {title}
    </Typography>

    <Typography sx={{ fontSize: 30, fontWeight: 700 }}>
      {value}
    </Typography>
  </Card>
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>({
    totalMockups: 0,
    activeOrders: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  let user: any = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard API error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;


  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Hey, {user?.name || "User"} 👋
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            Here's what's happening today.
          </Typography>
        </Box>

        <Button
          startIcon={<AddIcon />}
          onClick={() => navigate("/upload")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: "20px",
            background: "linear-gradient(90deg, #6366f1, #a855f7)",
            color: "#fff",
            boxShadow: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #5b5cf6, #9333ea)",
              boxShadow: "0px 4px 12px rgba(99,102,241,0.3)",
            },
          }}
        >
          Upload mockup
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Mockups"
            value={stats.totalMockups}
            growth={12}
            icon={<ImageIcon />}
            color="#6366f1"
            bgColor="#EEF2FF"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            growth={8}
            icon={<MonitorHeartIcon />}
            color="#3b82f6"
            bgColor="#EFF6FF"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            growth={24}
            icon={<ShoppingBagIcon />}
            color="#f59e0b"
            bgColor="#FFFBEB"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Revenue"
            value={`₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`}
            growth={18}
            icon={<AttachMoneyIcon />}
            color="#10b981"
            bgColor="#ECFDF5"
          />
        </Grid>
      </Grid>

      <RecentOrders />
    </Box>
  );
}