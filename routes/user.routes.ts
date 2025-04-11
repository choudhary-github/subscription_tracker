import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({ ok: true, msg: "Get all " });
});

userRouter.get("/:id", (req, res) => {
  res.json({ ok: true, msg: "get user details" });
});

userRouter.post("/", (req, res) => {
  res.json({ ok: true, msg: "create new user" });
});

userRouter.put("/:id", (req, res) => {
  res.json({ ok: true, msg: "update user" });
});

userRouter.delete("/:id", (req, res) => {
  res.json({ ok: true, msg: "delete User" });
});

export default userRouter;
