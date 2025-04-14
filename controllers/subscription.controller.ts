import type { Request, Response, NextFunction } from "express";
import Subscription from "../models/subscription.model";

const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;

    if (!data) {
      res.status(400).json({ error: "Subscription is required" });
      return;
    }

    const subscription = await Subscription.create({
      ...data,
      user: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        ...subscription,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export { createSubscription };
