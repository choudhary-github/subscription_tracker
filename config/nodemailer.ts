import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "./env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
})

export default transporter
