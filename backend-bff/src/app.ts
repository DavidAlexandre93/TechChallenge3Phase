import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

export default app;
