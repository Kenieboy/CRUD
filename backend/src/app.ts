import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import itemRoutes from "../routes/itemRoutes.js";
import { errorHandler, notFound } from "../middleware/erroHandler.js";
const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/items", itemRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
