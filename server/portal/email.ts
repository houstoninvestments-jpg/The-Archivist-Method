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

interface PurchaseEmailData {
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
  const html = buildPurchaseEmailHtml(data);
  const text = buildPurchaseEmailText(data);

  console.log(`\n========== CONFIRMATION EMAIL ==========`);
  console.log(`To: ${data.email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Pattern: ${data.patternName || "none"}`);
  console.log(`Product: ${data.productName}`);
  console.log(`Portal Link: ${data.portalLink}`);
  console.log(`=========================================\n`);

  if (process.env.NODE_ENV === "development") {
    console.log("[EMAIL] Development mode - email logged to console only");
    console.log("[EMAIL] Text version:", text);
    return true;
  }

  // Production: attempt to send via configured email provider
  // When SendGrid or Resend is configured, add the sending logic here
  try {
    // Placeholder for email provider integration
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to: data.email, from: 'noreply@archivistmethod.com', subject, html, text });
    
    console.log("[EMAIL] No email provider configured. Email not sent.");
    return false;
  } catch (error) {
    console.error("[EMAIL] Failed to send:", error);
    return false;
  }
}
