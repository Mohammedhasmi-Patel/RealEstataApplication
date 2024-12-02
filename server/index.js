import express from "express";
import dotenv from "dotenv";
import { DbCon } from "./utils/db.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT;

// mognodb connection
DbCon();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
