import type { Request, Response, NextFunction } from "express";
import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.model";
import type { WorkflowContext } from "@upstash/workflow";
import dayjs, { Dayjs } from "dayjs";
import { sendReminderEmail } from "../utils/send-email";

const REMINDERS = [7, 5, 2, 1];

const sendReminder = serve<{ subscriptionId: string }>(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubcription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date is passed for subscription ${subscriptionId} stopping workflow`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepuntilReminder(context, `${daysBefore} days before reminder`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubcription = async (context: WorkflowContext, subscriptionId: string) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepuntilReminder = async (context: WorkflowContext, label: string, reminderDate: Dayjs) => {
  await context.sleepUntil(label, reminderDate.toDate());
};

const triggerReminder = async (context: WorkflowContext, label: string, subscription: any) => {
  return await context.run(label, async () => {
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};

export { sendReminder };
