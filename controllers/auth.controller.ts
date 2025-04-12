import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
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

    const hashedPassword = await Bun.password.hash(password);
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: newUser[0]._id }, process.env.JWT_SECRET!);
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      message: "User created successfully",
      data: {
        user: {
          name: newUser[0].name,
          email: newUser[0].email,
        },
        token,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      const error: any = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req: Request, res: Response, next: NextFunction) => {};

export { signIn, signUp, signOut };
