import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


export const sendEmail = async ({ to, subject, html }: any) => {
 console.log("SMTP_USER =", process.env.SMTP_USER);
 console.log("SMTP_PASS exists =", !!process.env.SMTP_PASS);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from:`Job-dhundho <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`📧 Email sent to ${to}`);
};