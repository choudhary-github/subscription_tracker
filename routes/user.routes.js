import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller";
import authorize from "../middleware/auth.middleware";
const userRouter = Router();
userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);
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
