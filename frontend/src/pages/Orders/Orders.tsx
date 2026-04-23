import {
  Box,
  Typography,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  CircularProgress,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

import API from "../../utils/axios";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTabChange = (_: any, newValue: string) => {
    setTab(newValue);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);

      await API.put(`/orders/${id}`, { status });

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );

      setSnackbar({
        open: true,
        message: `Status updated to ${status}`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return { bgcolor: "#EFF6FF", color: "#2563eb" };
      case "Pending":
        return { bgcolor: "#FFFBEB", color: "#d97706" };
      case "Completed":
        return { bgcolor: "#ECFDF5", color: "#059669" };
      case "Rejected":
        return { bgcolor: "#FEE2E2", color: "#dc2626" };
      case "Editing":
        return { bgcolor: "#F3E8FF", color: "#7c3aed" };
      default:
        return {};
    }
  };

  const filteredOrders =
    tab === "All" ? orders : orders.filter((o) => o.status === tab);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Orders
          </Typography>
          <Typography color="text.secondary">
            Track and manage all packaging orders.
          </Typography>
        </Box>
      </Box>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All" value="All" />
        <Tab label="Pending" value="Pending" />
        <Tab label="Approved" value="Approved" />
        <Tab label="Completed" value="Completed" />
        <Tab label="Rejected" value="Rejected" />
      </Tabs>

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mockup</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              {role === "designer" && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((item, i) => {

                return (
                  <TableRow key={i}>
                    {/* Mockup */}
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Avatar
                          variant="rounded"
                          src={`http://localhost:5000${item.mockup?.imageUrl}`}
                          sx={{ width: 50, height: 50 }}
                        />
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {item.mockup?.title || "No Title"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.client?.name || "Unknown"} ·{" "}
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : ""}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Order ID */}
                    <TableCell>{item._id}</TableCell>

                    {/* Description */}
                    <TableCell>
                      {item.mockup?.description || "—"}
                    </TableCell>

                    {/* Total */}
                    <TableCell>
                      ₹{item.mockup?.price || 0}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={item.status}
                        sx={{
                          borderRadius: 3,
                          fontWeight: 500,
                          ...getStatusStyle(item.status),
                        }}
                      />
                    </TableCell>

                    {/* Action */}
                    {role === "designer" && (
                      <TableCell>
                        <Select
                          size="small"
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) =>
                            updateStatus(item._id, e.target.value as string)
                          }
                          sx={{ minWidth: 140 }}
                        >
                          {["Pending", "Approved", "Completed", "Rejected"].map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}