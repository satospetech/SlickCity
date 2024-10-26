"use server";
import nodemailer from "nodemailer";
import { response } from "./res";

export const SendEmail = async (
  body: string,
  subject: string,
  email: string,
  attachments?: { fileName: string; content: Buffer, contentType:string }[]
) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: "johntagbo2@gmail.com",
      to: email, //springcarehospitalltd@gmail.com
      subject: subject,
      html: body,
      attachments,
    });
  } catch (err) {
    if (err instanceof Error) {
      return response(500, err.message);
    }
    return response(500, "An unknown error occurred");
  }
};
