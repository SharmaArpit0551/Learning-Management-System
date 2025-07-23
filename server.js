import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import purchaseCourseRoutes from "./routes/purchaseCourseRoutes.js";
import progressCourseRoutes from "./routes/courseProgressRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// configing the dotenv file
dotenv.config();

const app = express();

// creating the middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Connection to database
connectDB();

//ROUTES
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/purchase", purchaseCourseRoutes);
app.use("/api/progress", progressCourseRoutes);

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name
const __dirname = path.dirname(__filename);

// Serve static files from the assets folder
app.use(express.static(path.join(__dirname, "./client/dist")));

// Route to serve `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
