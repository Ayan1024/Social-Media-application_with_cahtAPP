import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import {v2 as cloudinary} from "cloudinary"

dotenv.config();

connectDB()
const app = express();

app.get("/", (req, res) => {
  res.send("server is running");
});

const port = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_API_SECRET,
})

// 🟢 increase body size limit here
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//Routes

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
