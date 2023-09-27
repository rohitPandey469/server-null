import express from "express";
const router = express.Router();
import { stripePayment } from "../controllers/stripe.js";

router.post("/", stripePayment);

export default router;
