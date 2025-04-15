import dayjs from "dayjs";
import { emailTemplates } from "./email-template";
import { EMAIL } from "../config/env";
import transporter from "../config/nodemailer";

const sendReminderEmail = async ({
  to,
  type,
  subscription,
}: {
  to: string;
  type: string;
  subscription: {
    user: { name: string };
    name: string;
    renewalDate: string;
    price: number;
    frequency: string;
    currency: string;
    paymentMethod: string;
  };
}) => {
  try {
    if (!to || !type) {
      throw new Error("Missing required parameters");
    }
    console.log("Sending email to:", to, "with type:", type);

    const template = emailTemplates.find((t) => t.label === type);

    if (!template) {
      throw new Error("Invalid email type");
    }

    const mailInfo = {
      userName: subscription.user.name,
      subscriptionName: subscription.name,
      renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
      planName: subscription.name,
      price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
      paymentMethod: subscription.paymentMethod,
    };

    const subject = template.generateSubject(mailInfo);
    const message = template.generateBody(mailInfo);

    const mailoptions = {
      from: EMAIL,
      to: to,
      subject: subject,
      html: message,
    };

    transporter.sendMail(mailoptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      }
      console.log("Email sent:", info.response);
    });
  } catch (error) {}
};

export { sendReminderEmail };
