import type { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet";

const arcjectMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url, req.method, req.ip, "form arcjet middleware");

  try {
    const decision = await aj.protect(req, { requested: 10 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).send({ error: "Too Many Requests" });
        console.log("Rate limit exceeded", decision.reason);
        return;
      } else if (decision.reason.isBot()) {
        res.status(403).send({ error: "No bots allowed" });
        return;
      } else {
        res.status(403).send({ error: "Forbidden" });
        return;
      }
    }

    next();
  } catch (error) {
    console.log("arcjectMiddleware error", error);
    next(error);
  }
};

export default arcjectMiddleware;
