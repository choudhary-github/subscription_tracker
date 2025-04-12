import express, { Router, type Request, type Response } from "express";
import { PORT } from "./config/env";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import subscriptionRouter from "./routes/subscription.routes";
import { connectDB } from "./database/mongodb";
import "dotenv/config";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const apiRouter = Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("hello world hello");
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/subscriptions", subscriptionRouter);

app.use("/api/v1", apiRouter);
app.use(errorMiddleware)

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`listening on port http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
