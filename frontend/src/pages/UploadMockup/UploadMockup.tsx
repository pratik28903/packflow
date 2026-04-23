import {
    Box,
    Typography,
    Card,
    TextField,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import api from "../../utils/axios";
import { useEffect } from "react";

export default function UploadMockup() {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading] = useState(false);
    const [progress] = useState(0);

    const [form, setForm] = useState<{
        title: string;
        description: string;
        price: string;
        file: File | null;
    }>({
        title: "",
        description: "",
        price: "",
        file: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setForm({ ...form, file });

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        if (!form.file && !form.title && !form.description && !form.price) {
            return showToast("Please fill all fields and upload image");
        }

        if (!form.file) {
            return showToast("Please upload an image");
        }

        if (!form.title || !form.description || !form.price) {
            return showToast("All fields are required");
        }

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("image", form.file);
            formData.append("price", form.price);
            formData.append("description", form.description);

            await api.post("/mockups", formData);

            showToast("Mockup uploaded successfully", "success");

            setForm({
                title: "",
                description: "",
                price: "",
                file: null,
            });

            setPreview(null);

        } catch (err) {
            console.error(err);
            showToast("Upload failed. Try again.");
        }
    };

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "error" as "error" | "success" | "warning" | "info",
    });

    const showToast = (message: string, severity: any = "error") => {
        setToast({ open: true, message, severity });
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);


    return (
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Upload a mockup
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Share a packaging design with our network of brand clients.
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" },
                    gap: 3,
                }}
            >
                <Card
                    sx={{
                        p: 3,
                        borderRadius: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 600, mb: 2 }}>
                        Design file
                    </Typography>

                    <Box
                        sx={{
                            border: "2px dashed #e5e7eb",
                            borderRadius: 4,
                            height: 260,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            cursor: "pointer",
                            textAlign: "center",
                            bgcolor: "#fafafa",
                        }}
                    >
                        <input
                            type="file"
                            hidden
                            id="upload-file"
                            onChange={handleFileChange}
                        />

                        <label htmlFor="upload-file" style={{ width: "100%" }}>
                            <Box>
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: "50%",
                                        bgcolor: "#ede9fe",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <CloudUploadIcon sx={{ color: "#7C3AED" }} />
                                </Box>

                                <Typography sx={{ fontWeight: 600 }}>
                                    Drop your design here
                                </Typography>

                                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                                    or click to browse · PNG, JPG up to 20MB
                                </Typography>
                            </Box>
                        </label>
                    </Box>

                    {preview && (
                        <Box
                            sx={{
                                mt: 3,
                                position: "relative",
                                borderRadius: 3,
                                overflow: "hidden",
                                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                            }}
                        >
                            <img
                                src={preview}
                                alt="preview"
                                style={{
                                    width: "100%",
                                    height: 250,
                                    objectFit: "cover",
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: 50,
                                    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                                    display: "flex",
                                    alignItems: "center",
                                    px: 2,
                                    color: "#fff",
                                    fontWeight: 500,
                                }}
                            >
                                Welcome, John Doe
                            </Box>

                            <Box
                                onClick={() => {
                                    setPreview(null);
                                }}
                                sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    width: 35,
                                    height: 35,
                                    borderRadius: "50%",
                                    bgcolor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                                }}
                            >
                                ✕
                            </Box>
                        </Box>
                    )}
                    {uploading && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Uploading... {progress}%
                            </Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    height: 8,
                                    borderRadius: 5,
                                    bgcolor: "#e5e7eb",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${progress}%`,
                                        height: "100%",
                                        background: "linear-gradient(90deg, #6366f1, #a855f7)",
                                        transition: "0.3s",
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Card>

                <Card
                    sx={{
                        p: 3,
                        borderRadius: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 600, mb: 2 }}>
                        Mockup details
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="TITLE e.g. Artisan Coffee Pouch"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="DESCRIPTION e.g. Tell clients about materials, dimensions, finish..."
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        placeholder="PRICE e.g. ₹24"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            py: 1.5,
                            borderRadius: 3,
                            background: "linear-gradient(90deg, #6366f1, #a855f7)",
                            color: "#fff",

                            "&:hover": {
                                background: "linear-gradient(90deg, #5b5cf6, #9333ea)",
                            },
                        }}
                    >
                        Publish mockup
                    </Button>
                </Card>
            </Box>

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}