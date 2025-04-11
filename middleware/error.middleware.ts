import type { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error: any = { ...err };

    error.message = err.message;
    console.error(error);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      const message = `Resource not found`;
      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = `Duplicate field value entered`;
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((value: any) => value.message)
        .join(", ");
      error = new Error(message);
      error.statusCode = 400;
    }

    res.send({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
