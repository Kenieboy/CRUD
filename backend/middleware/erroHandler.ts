import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/index.js";

interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ApiResponse<never>>,
  _next: NextFunction,
): void => {
  console.error(err.stack);

  if (err.code === "ER_DUP_ENTRY") {
    res.status(409).json({
      success: false,
      message: "Duplicate entry detected",
    });
    return;
  }

  if (err.code === "ER_NO_REFERENCED_ROW") {
    res.status(400).json({
      success: false,
      message: "Invalid reference",
    });
    return;
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (
  _req: Request,
  res: Response<ApiResponse<never>>,
): void => {
  res.status(404).json({ success: false, message: "Route not found" });
};
