import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import authRouter from "./routes/auth.route.js";
import contentRouter from "./routes/content.route.js";
import groupRouter from "./routes/group.route.js";
import userRouter from "./routes/user.route.js";
import statsRouter from "./routes/stats.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/group", groupRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/stats", statsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  
  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
});

export { app }