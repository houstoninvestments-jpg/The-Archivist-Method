import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "archivist@archiebase.com";
const FROM_NAME = "The Archivist Method";

const patternDisplayNames: Record<string, string> = {
  disappearing: "The Disappearing Pattern",
  apologyLoop: "The Apology Loop",
  testing: "The Testing Pattern",
  attractionToHarm: "Attraction to Harm",
  complimentDeflection: "Compliment Deflection",
  drainingBond: "The Draining Bond",
  successSabotage: "Success Sabotage",
  perfectionism: "The Perfectionism Pattern",
  rage: "The Rage Pattern",
};

// ─── Purchase Confirmation ────────────────────────────────────────────────────

export interface PurchaseEmailData {
  email: string;
  firstName?: string;
  patternName?: string | null;
  productName: string;
  portalLink: string;
}

function getArchivistWelcome(patternName?: string | null): string {
  if (patternName) {
    const display = patternDisplayNames[patternName] || patternName;
    return `Your file on ${display} is open. The pattern has been running long enough. Time to read it differently.`;
  }
  return `Your archive is open. The patterns have been running long enough. Time to read them differently.`;
}

function buildPurchaseEmailHtml(data: PurchaseEmailData): string {
  const firstName = data.firstName || "there";
  const patternLine = data.patternName
    ? `<p style="color:#14B8A6;font-size:14px;margin:16px 0;">Your identified pattern: <strong>${patternDisplayNames[data.patternName] || data.patternName}</strong></p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#737373;margin-bottom:32px;">The Archivist Method</p>

    <h1 style="color:#FAFAFA;font-size:24px;font-weight:700;margin-bottom:24px;">Your archive is open, ${firstName}.</h1>

    <p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:24px;">${getArchivistWelcome(data.patternName)}</p>

    ${patternLine}

    <p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:8px;">Your purchase: <strong style="color:#FAFAFA;">${data.productName}</strong></p>

    <div style="margin:32px 0;">
      <a href="${data.portalLink}" style="display:inline-block;padding:14px 32px;background:#14B8A6;color:#000;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Enter Your Portal</a>
    </div>

    <p style="color:#525252;font-size:12px;line-height:1.6;margin-top:48px;border-top:1px solid #1a1a1a;padding-top:24px;">
      This link gives you direct access to your portal. Bookmark it or save this email.<br>
      If you didn't make this purchase, you can ignore this email.
    </p>
  </div>
</body>
</html>`;
}

function buildPurchaseEmailText(data: PurchaseEmailData): string {
  const firstName = data.firstName || "there";
  const patternLine = data.patternName
    ? `\nYour identified pattern: ${patternDisplayNames[data.patternName] || data.patternName}\n`
    : "";

  return `THE ARCHIVIST METHOD

Your archive is open, ${firstName}.

${getArchivistWelcome(data.patternName)}
${patternLine}
Your purchase: ${data.productName}

Enter your portal: ${data.portalLink}

---
This link gives you direct access to your portal. Bookmark it or save this email.
If you didn't make this purchase, you can ignore this email.`;
}

export async function sendPurchaseConfirmationEmail(data: PurchaseEmailData): Promise<boolean> {
  const firstName = data.firstName || "there";
  const subject = `Your archive is open, ${firstName}.`;

  console.log(`\n========== CONFIRMATION EMAIL ==========`);
  console.log(`To: ${data.email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Pattern: ${data.patternName || "none"}`);
  console.log(`Product: ${data.productName}`);
  console.log(`Portal Link: ${data.portalLink}`);
  console.log(`=========================================\n`);

  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] RESEND_API_KEY not set — skipping send");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_ADDRESS}>`,
      to: data.email,
      subject,
      html: buildPurchaseEmailHtml(data),
      text: buildPurchaseEmailText(data),
    });

    if (error) {
      console.error("[EMAIL] Resend error (purchase confirmation):", error);
      return false;
    }

    console.log(`[EMAIL] Purchase confirmation sent to ${data.email}`);
    return true;
  } catch (err) {
    console.error("[EMAIL] Failed to send purchase confirmation:", err);
    return false;
  }
}

// ─── Quiz Welcome Email ───────────────────────────────────────────────────────

export interface WelcomeEmailData {
  email: string;
  firstName?: string;
  primaryPattern?: string | null;
}

function buildWelcomeEmailHtml(data: WelcomeEmailData): string {
  const firstName = data.firstName || "there";
  const patternDisplay = data.primaryPattern
    ? patternDisplayNames[data.primaryPattern] || data.primaryPattern
    : null;

  const patternSection = patternDisplay
    ? `<p style="color:#14B8A6;font-size:14px;margin:16px 0;text-transform:uppercase;letter-spacing:0.08em;">Your pattern: <strong>${patternDisplay}</strong></p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#737373;margin-bottom:32px;">The Archivist Method</p>

    <h1 style="color:#FAFAFA;font-size:24px;font-weight:700;margin-bottom:24px;">Your results are in, ${firstName}.</h1>

    ${patternSection}

    <p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:24px;">
      The pattern has a name now. That changes things.
    </p>

    <p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:32px;">
      Your Crash Course is waiting — three days, one pattern, the mechanics underneath it. No journaling prompts. No healing frameworks. Just the architecture.
    </p>

    <p style="color:#525252;font-size:12px;line-height:1.6;margin-top:48px;border-top:1px solid #1a1a1a;padding-top:24px;">
      You received this because you completed the Pattern Recognition Quiz at thearchivistmethod.com.<br>
      Pattern Archaeology, NOT Therapy.
    </p>
  </div>
</body>
</html>`;
}

function buildWelcomeEmailText(data: WelcomeEmailData): string {
  const firstName = data.firstName || "there";
  const patternDisplay = data.primaryPattern
    ? patternDisplayNames[data.primaryPattern] || data.primaryPattern
    : null;

  const patternLine = patternDisplay ? `Your pattern: ${patternDisplay}\n\n` : "";

  return `THE ARCHIVIST METHOD

Your results are in, ${firstName}.

${patternLine}The pattern has a name now. That changes things.

Your Crash Course is waiting — three days, one pattern, the mechanics underneath it. No journaling prompts. No healing frameworks. Just the architecture.

---
You received this because you completed the Pattern Recognition Quiz at thearchivistmethod.com.
Pattern Archaeology, NOT Therapy.`;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const firstName = data.firstName || "there";
  const subject = `Your results are in, ${firstName}.`;

  console.log(`\n========== WELCOME EMAIL ==========`);
  console.log(`To: ${data.email}`);
  console.log(`Pattern: ${data.primaryPattern || "none"}`);
  console.log(`====================================\n`);

  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] RESEND_API_KEY not set — skipping send");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_ADDRESS}>`,
      to: data.email,
      subject,
      html: buildWelcomeEmailHtml(data),
      text: buildWelcomeEmailText(data),
    });

    if (error) {
      console.error("[EMAIL] Resend error (welcome):", error);
      return false;
    }

    console.log(`[EMAIL] Welcome email sent to ${data.email}`);
    return true;
  } catch (err) {
    console.error("[EMAIL] Failed to send welcome email:", err);
    return false;
  }
}
