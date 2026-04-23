import { Box, Typography, Avatar, Divider, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";

const RecentOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/recent");
        setOrders(res.data);
      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Typography sx={{ mt: 4 }}>Loading orders...</Typography>;
  }

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        bgcolor: "#fff",
        borderRadius: 4,
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Recent orders
          </Typography>
          <Typography color="text.secondary">
            Latest activity across your account
          </Typography>
        </Box>

        <Typography
          onClick={() => navigate("/orders")}
          sx={{ cursor: "pointer", fontWeight: 500 }}
        >
          View all →
        </Typography>
      </Box>

      {orders.length === 0 && (
        <Typography>No recent orders found</Typography>
      )}

      {orders.map((order, index) => (

        <Box key={order._id || index}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            {/* Left */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                variant="rounded"
                src={`http://localhost:5000${order.imageUrl}`}
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#f3f4f6",
                }}
              />

              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {order.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {`ORID-${order._id?.slice(-4)} · ${order.clientName} `}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontWeight: 600 }}>
                ₹{order.amount}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>

              <Chip
                label={order.status}
                sx={{
                  mt: 1,
                  bgcolor:
                    order.status === "Completed"
                      ? "#ECFDF5"
                      : order.status === "Pending"
                        ? "#FFFBEB"
                        : "#EFF6FF",
                  color:
                    order.status === "Completed"
                      ? "#10b981"
                      : order.status === "Pending"
                        ? "#f59e0b"
                        : "#3b82f6",
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>

          {index !== orders.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

export default RecentOrders;