import type { Request, Response, NextFunction } from "express";
import Subscription from "../models/subscription.model";
import { workflowClient } from "../config/upstash";
import { QSTASH_URL, SERVER_URL } from "../config/env";

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

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
    });

    res.status(201).json({
      status: "success",
      data: { subscription, workflowRunId },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export { createSubscription };
