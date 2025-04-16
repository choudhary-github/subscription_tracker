import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User from "../models/user.model";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url, req.method, req.ip);
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error: any = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, JWT_SECRET!);

    if (typeof decoded === "object" && decoded !== null) {
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        const error: any = new Error("User not found");
        error.statusCode = 401;
        throw error;
      }

      req.user = user;
      next();
    } else {
      const error: any = new Error("Invalid token");
      error.statusCode = 401;
      throw error;
    }
  } catch (error: any) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authorize;
