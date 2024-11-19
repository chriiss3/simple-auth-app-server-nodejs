import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connect } from "mongoose";
import { CLIENT_URL, PORT, MONGODB_URL, NODE_ENV } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middlewares/error-handler.js";
import userRoutes from "./routes/user.js";
import { handleCritialError } from "./utils/index.js";

const app = express();

const corsOptions = {
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  origin: CLIENT_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
};

app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use(errorHandler);

app.all("*", (req: Request, res: Response) => {
  return res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

process.on("uncaughtException", (err) => {
  handleCritialError(err);
});

const startServer = async () => {
  try {
    await connect(MONGODB_URL);

    console.log("Connected to DB");
    console.log("Environment:", NODE_ENV.trim());

    app.listen(PORT, () => {
      console.log("Server started");
    });
  } catch (err) {
    handleCritialError(err);
  }
};

startServer();
