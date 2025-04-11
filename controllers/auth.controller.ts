import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error: any = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const hash = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, hash);
    const [newUser] = await User.create(
      {
        name,
        email,
        password: hashedPassword,
      },
      { session }
    );

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {};

const signOut = async (req: Request, res: Response, next: NextFunction) => {};

export { signIn, signUp, signOut };
