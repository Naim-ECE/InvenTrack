import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter = null;

export const setupEmailService = () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    if (env.NODE_ENV === "development") {
      console.warn("SMTP is not fully configured. Emails will not be sent.");
      return null;
    }
    throw new Error("SMTP configuration is missing.");
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    // If transporter is null, we initialize it
    transporter = setupEmailService();
    // If it's STILL null, we're in dev mode without SMTP, so just log it
    if (!transporter) {
      console.log(`[Dev Mode] Skipped sending email to ${to}: ${subject}`);
      return;
    }
  }

  const mailOptions = {
    from: `"InventoryMaster Pro" <${env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
