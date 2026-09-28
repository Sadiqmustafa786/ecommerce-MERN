import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);

  return info;
};
