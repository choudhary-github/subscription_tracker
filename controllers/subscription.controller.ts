import type { Request, Response, NextFunction } from "express";
import Subscription from "../models/subscription.model";

const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
      return;
    }

    if (!req.body) {
      res.status(400).json({
        status: "fail",
        message: "Please provide a subscription",
      });
      return;
    }

    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: subscription,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export { createSubscription };
