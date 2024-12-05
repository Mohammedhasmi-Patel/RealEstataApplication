import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { DbCon } from "./utils/db.js";
import UserRoutes from "./routes/user.route.js";
import AuthRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT;

// mognodb connection
DbCon();

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/listing", listingRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
