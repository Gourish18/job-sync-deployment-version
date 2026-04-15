import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay";
dotenv.config();
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});
const app = express();
app.use(cors());
app.use(express.json());
app.listen(process.env.PORT, () => {
    console.log(`Payment service is running on port ${process.env.PORT}`);
});
