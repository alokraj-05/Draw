import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/routes";

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors({credentials:true, origin: process.env.FRONTEND_URL}))
app.use(cookieParser());
app.use("/api",router)

export default app;