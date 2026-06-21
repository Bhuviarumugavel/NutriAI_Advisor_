import crypto from "crypto";
import { setVerificationToken, verifyEmailToken } from "@/lib/db";
import nodemailer from "nodemailer";

export function generateVerificationToken() {
  return crypto.randomBytes(24).toString("hex");
}

function createTransporterFromEnv() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port) return null;
  return nodemailer.createTransport({ host, port: Number(port), secure: Number(port) === 465, auth: user && pass ? { user, pass } : undefined });
}

export async function createAndSendVerification(email, sendFn) {
  const token = generateVerificationToken();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
  await setVerificationToken(email, token, expires);

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify?token=${token}`;

  // use provided sendFn first
  if (typeof sendFn === "function") {
    await sendFn({ to: email, subject: "Verify your NutriAI account", text: `Click to verify: ${verifyUrl}`, html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>` });
    return { token, expires, verifyUrl };
  }

  // try env SMTP
  const transporter = createTransporterFromEnv();
  if (transporter) {
    await transporter.sendMail({ from: process.env.SMTP_FROM || `no-reply@${process.env.SMTP_HOST || "localhost"}`, to: email, subject: "Verify your NutriAI account", text: `Click to verify: ${verifyUrl}`, html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>` });
    return { token, expires, verifyUrl };
  }

  // Dev fallback: log verification URL when no send function provided
  try {
    console.log("[DEV EMAIL] Verification URL:", verifyUrl);
  } catch (err) {
    /* ignore */
  }

  return { token, expires, verifyUrl };
}

export async function verifyToken(token) {
  return await verifyEmailToken(token);
}
