import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import mockupRoutes from "./routes/mockup.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ FIXED CORS HERE
const allowedOrigins = [
  "http://localhost:5173",
  "https://packflow-mocha.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mockups", mockupRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorMiddleware);

export default app;