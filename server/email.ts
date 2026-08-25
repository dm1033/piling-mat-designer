/**
 * Email delivery for the Official Design Pack.
 *
 * Sends the paid PDF pack to the customer via SMTP (nodemailer). Configure with:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  — SMTP credentials
 *   EMAIL_FROM       — from address (defaults to SMTP_USER)
 *   EMAIL_BCC        — optional copy address for record-keeping (e.g. the office inbox)
 *
 * If SMTP is not configured, sending is skipped and callers fall back to
 * notifying the owner for manual fulfilment — a payment must never be lost
 * because email is down.
 */
import nodemailer from "nodemailer";
import type { Design } from "../drizzle/schema";
import { CERTIFICATE, formatPrice, PRODUCT } from "./products";

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransport() {
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface SendPackResult {
  sent: boolean;
  error?: string;
}

/**
 * Email the official design pack PDF to the customer.
 * Returns { sent: false } (never throws) when SMTP is unconfigured or fails.
 */
export async function sendDesignPackEmail(
  to: string,
  design: Design,
  pdf: Buffer
): Promise<SendPackResult> {
  if (!to) return { sent: false, error: "No customer email address" };
  if (!isEmailConfigured()) return { sent: false, error: "SMTP not configured" };

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER!;
  const bcc = process.env.EMAIL_BCC || undefined;
  const filename = `${design.certificateRef}-Design-Pack.pdf`;

  const text = [
    `Thank you for your purchase of the ${PRODUCT.name} (${formatPrice(design.amountPence)}).`,
    ``,
    `Your official design pack is attached as a PDF. It contains:`,
    `  • Working platform design certificate (signed check certificate)`,
    `  • Full calculation audit trail to BR 470 (BRE 2004)`,
    `  • Drawings — platform cross-section and plan`,
    `  • Working platform risk assessment`,
    `  • Notes, limitations and inspection requirements`,
    ``,
    `Certificate reference: ${design.certificateRef}`,
    `Project: ${design.projectName || "—"}`,
    design.siteLocation ? `Site: ${design.siteLocation}` : ``,
    ``,
    `This emailed PDF is the official design record. Please pass it to your Temporary Works`,
    `Coordinator and keep it with the site temporary works register. A Working Platform`,
    `Certificate (FPS format) must be signed before plant is accepted onto the platform.`,
    ``,
    `You can also view your certificate online at any time from the My Designs page.`,
    ``,
    `Any questions, reply to this email or call ${CERTIFICATE.phone}.`,
    ``,
    `${CERTIFICATE.designer}`,
    `${CERTIFICATE.title}`,
    `${CERTIFICATE.company}`,
    `${CERTIFICATE.email} | ${CERTIFICATE.phone}`,
  ]
    .filter(line => line !== undefined)
    .join("\n");

  try {
    await getTransport().sendMail({
      from: { name: "BRE470 Piling Mat Designer", address: from },
      to,
      bcc,
      replyTo: CERTIFICATE.email,
      subject: `Your BRE470 Official Design Pack — ${design.certificateRef}`,
      text,
      attachments: [{ filename, content: pdf, contentType: "application/pdf" }],
    });
    return { sent: true };
  } catch (err: any) {
    console.error("[Email] Failed to send design pack:", err?.message || err);
    return { sent: false, error: err?.message || String(err) };
  }
}
