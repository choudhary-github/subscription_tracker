import type { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet";

const arcjectMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isBot()) res.status(403).send({ error: "Bot detected" });
      if (decision.reason.isRateLimit()) res.status(429).send({ error: "Rate limit exceeded" });

      res.status(403).send({ error: "Access denied" });
      return;
    }

    next();
  } catch (error) {
    console.log("arcjectMiddleware error", error);
    next(error);
  }
};

export default arcjectMiddleware;
