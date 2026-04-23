import { useEffect, useState } from "react";
import API from "../../utils/axios";

import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const BASE_URL = "http://localhost:5000";

const Mockups = () => {
  const [mockups, setMockups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<any>(null);

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    price: "",
    image: null,
  });


  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showToast = (message: string, severity: "success" | "error" = "success") => {
    setToast({ open: true, message, severity });
  };

  const fetchMockups = async () => {
    try {
      const res = await API.get("/mockups");
      setMockups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockups();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
    }
  };



  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this mockup?")) return;

    try {
      await API.delete(`/mockups/${id}`);
      showToast("Deleted successfully");
      fetchMockups();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleEditOpen = (mockup: any) => {
    setSelectedMockup(mockup);
    setForm({
      title: mockup.title,
      description: mockup.description,
      price: mockup.price,
      image: null,
    });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);

      if (form.image) {
        data.append("image", form.image);
      }

      await API.put(`/mockups/${selectedMockup._id}`, data);

      showToast("Updated successfully");
      setOpenEdit(false);
      fetchMockups();
    } catch {
      showToast("Update failed", "error");
    }
  };

  const placeOrder = async (mockupId: string) => {
    try {
      await API.post("/orders", {
        mockupId,
        quantity: 1,
      });

      showToast("Order placed");
    } catch {
      showToast("Order failed", "error");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Mockups
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {mockups.map((mockup) => (
            <Grid sx={{ xs: 12, md: 4 }} key={mockup._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${BASE_URL}${mockup.imageUrl}`}
                />

                <CardContent>
                  <Typography variant="h6">{mockup.title}</Typography>
                  <Typography>₹{mockup.price}</Typography>
                  <Typography variant="body2">
                    {mockup.description}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                  {user?.role === "designer" && (
                    <>
                      <Button onClick={() => handleEditOpen(mockup)}>
                        Edit
                      </Button>

                      <Button color="error" onClick={() => handleDelete(mockup._id)}>
                        Delete
                      </Button>
                    </>
                  )}

                  {user?.role === "client" && (
                    <Button variant="contained" onClick={() => placeOrder(mockup._id)}>
                      Order
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Mockup</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />

          <input type="file" onChange={handleImage} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Mockups;