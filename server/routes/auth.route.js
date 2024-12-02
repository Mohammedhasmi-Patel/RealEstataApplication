import { signup } from "../controllers/auth.controllers.js";
import express from "express";

const router = express.Router();

router.post("/signup", signup);

export default router;
