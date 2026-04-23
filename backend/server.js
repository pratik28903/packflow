import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import cors from "cors";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://packflow-mocha.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS:", origin); // debug
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();