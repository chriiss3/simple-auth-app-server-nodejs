import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import sgMail from "@sendgrid/mail";
import helmet from "helmet";
import { connect } from "mongoose";
import { CLIENT_URL, SENDGRID_API_KEY, PORT, DB_URL, NODE_ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import handleCritialError from "./utils/criticalErrorHandler.js";
// import { handler } from "./utils/criticalErrorHandler.js";
console.log(SENDGRID_API_KEY);
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
sgMail.setApiKey(SENDGRID_API_KEY);
app.use(helmet());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);
app.all("*", (req, res) => {
    return res.status(404).json({ error: `Ruta ${req.originalUrl} no encontrada` });
});
process.on("uncaughtException", (err) => {
    handleCritialError(err);
});
const startServer = async () => {
    try {
        await connect(DB_URL);
        console.log("Connected to DB");
        console.log(NODE_ENV.trim() === "development");
        app.listen(PORT, () => {
            console.log("Servidor iniciado");
        });
    }
    catch (err) {
        handleCritialError(err);
    }
};
startServer();
