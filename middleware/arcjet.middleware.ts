import type { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet";

const arcjectMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).send({ error: "Too Many Requests" });
        return;
      } else if (decision.reason.isBot()) {
        res.status(403).send({ error: "No bots allowed" });
        return;
      } else {
        res.status(403).send({ error: "Forbidden" });
        return;
      }
    }
    // else if (decision.results.some(isSpoofedBot)) {
    //   res.status(403).send({ error: "Forbidden" });
    //   return;
    // }
    next();
  } catch (error) {
    console.log("arcjectMiddleware error", error);
    next(error);
  }
};

export default arcjectMiddleware;
