import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 4002;
const URI = process.env.MONGODB_URI;

// Connect MongoDB
try {
  await mongoose.connect(URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("MongoDB connection error:", error);
}

// routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Deployment
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve(__dirname);
  app.use(express.static(path.join(dirPath, "./Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirPath, "./Frontend/dist", "index.html"));
  });
}

// Start Server
server.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
