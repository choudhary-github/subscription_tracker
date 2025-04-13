import { Router } from "express";
const subscriptionRouter = Router();
subscriptionRouter.get("/", (req, res) => {
    res.json({ ok: true, msg: "Get all Subscriptions" });
});
subscriptionRouter.get("/:id", (req, res) => {
    res.json({ ok: true, msg: "Get all Subscriptions" });
});
subscriptionRouter.post("/", (req, res) => {
    res.json({ ok: true, msg: "create new Subscription" });
});
subscriptionRouter.put("/:id", (req, res) => {
    res.json({ ok: true, msg: "update Subscriptions" });
});
subscriptionRouter.delete("/:id", (req, res) => {
    res.json({ ok: true, msg: "delete Subscription" });
});
subscriptionRouter.get("/users/:id", (req, res) => {
    res.json({ ok: true, msg: "Get all user Subscriptions" });
});
subscriptionRouter.put("/:id/cancel", (req, res) => {
    res.json({ ok: true, msg: "Cancel Subscription" });
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
    res.json({ ok: true, msg: "Get upcoming renewals" });
});
export default subscriptionRouter;
