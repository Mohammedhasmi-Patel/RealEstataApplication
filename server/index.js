import express from "express";
import dotenv from "dotenv";
import { DbCon } from "./utils/db.js";
import UserRoutes from "./routes/user.route.js";
import AuthRoutes from "./routes/auth.route.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT;

// mognodb connection
DbCon();

// middleware
app.use(express.json());
// routes
app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
