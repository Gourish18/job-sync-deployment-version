// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();


// export const sendEmail = async ({ to, subject, html }: any) => {
//  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
//   throw new Error(
//     `SMTP missing. USER=${process.env.SMTP_USER}, PASS_EXISTS=${!!process.env.SMTP_PASS}`
//   );
// }
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from:`Job-dhundho <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });

//   console.log(`📧 Email sent to ${to}`);
// };
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }: any) => {

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      `ENV CHECK FAILED | USER=${process.env.SMTP_USER} | PASS_EXISTS=${!!process.env.SMTP_PASS}`
    );
  }

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
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};