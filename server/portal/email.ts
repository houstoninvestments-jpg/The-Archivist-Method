import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const patternDisplayNames: Record<string, string> = {
  disappearing: "The Disappearing Pattern",
  apologyLoop: "The Apology Loop",
  testing: "The Testing Pattern",
  attractionToHarm: "Attraction to Harm",
  complimentDeflection: "Compliment Deflection",
  drainingBond: "The Draining Bond",
  successSabotage: "Success Sabotage",
  perfectionism: "The Perfectionism Trap",
  rage: "The Rage Pattern",
};

export type PurchaseTier = "field_guide" | "complete_archive" | null;

interface PurchaseEmailData {
  email: string;
  firstName?: string;
  patternName?: string | null;
  productName: string;
  portalLink: string;
  // When set, selects the tier-specific template. Defaults to the generic
  // "archive is open" template for unknown or test-mode purchases.
  tier?: PurchaseTier;
  amountPaid?: number; // dollars, for receipt line
}

function receiptLine(amount?: number) {
  if (typeof amount !== "number" || amount <= 0) return "";
  return `<p style="color:#A3A3A3;font-size:14px;margin:8px 0 24px;">Receipt: $${amount.toFixed(2)} — a copy from Stripe will arrive separately.</p>`;
}

function receiptLineText(amount?: number) {
  if (typeof amount !== "number" || amount <= 0) return "";
  return `Receipt: $${amount.toFixed(2)} — a copy from Stripe will arrive separately.\n\n`;
}

function patternLineHtml(patternName?: string | null) {
  if (!patternName) return "";
  const display = patternDisplayNames[patternName] || patternName;
  return `<p style="color:#14B8A6;font-size:14px;margin:16px 0;">Your identified pattern: <strong>${display}</strong></p>`;
}

function patternLineText(patternName?: string | null) {
  if (!patternName) return "";
  const display = patternDisplayNames[patternName] || patternName;
  return `Your identified pattern: ${display}\n\n`;
}

interface TemplateStrings {
  subject: string;
  headline: string;
  opener: string;
  howToStart: string;
  ctaLabel: string;
}

function templateFor(tier: PurchaseTier, firstName: string): TemplateStrings {
  if (tier === "field_guide") {
    return {
      subject: "Your Field Guide is ready",
      headline: `Your Field Guide is ready, ${firstName}.`,
      opener:
        "You have the full markup on one pattern now — what it is, how it fires, how to interrupt it, and the 90-day rewrite. This is the one that matches the signal your body is already sending.",
      howToStart:
        "Start with 1.1 What This Is, then skim your pattern's At a Glance. Don't read the whole guide in one sitting. One section a day, for seven days. That's the method.",
      ctaLabel: "Open the Field Guide",
    };
  }
  if (tier === "complete_archive") {
    return {
      subject: "The Complete Archive is open",
      headline: `The Complete Archive is open, ${firstName}.`,
      opener:
        "All nine patterns. The Four Doors framework. The 90-day implementation map. The advanced protocols, context chapters, and field notes. Every file you'll need to read yourself differently.",
      howToStart:
        "Start where your body points: your primary pattern's At a Glance. From there, either drill down into that pattern or widen out through the Four Doors. Pace is one section a day; depth beats speed.",
      ctaLabel: "Open the Archive",
    };
  }
  return {
    subject: `Your archive is open, ${firstName}.`,
    headline: `Your archive is open, ${firstName}.`,
    opener:
      "The patterns have been running long enough. Time to read them differently.",
    howToStart:
      "Open your portal and start at the first section.",
    ctaLabel: "Enter Your Portal",
  };
}

function buildPurchaseEmailHtml(data: PurchaseEmailData, tpl: TemplateStrings): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#737373;margin-bottom:32px;">The Archivist Method</p>

    <h1 style="color:#FAFAFA;font-size:24px;font-weight:700;margin-bottom:24px;">${tpl.headline}</h1>

    <p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:24px;">${tpl.opener}</p>

    ${patternLineHtml(data.patternName)}

    <p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:8px;">Your purchase: <strong style="color:#FAFAFA;">${data.productName}</strong></p>
    ${receiptLine(data.amountPaid)}

    <p style="color:#FAFAFA;font-size:14px;line-height:1.7;margin:32px 0 8px;font-weight:600;">Here's how to start</p>
    <p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:24px;">${tpl.howToStart}</p>

    <div style="margin:32px 0;">
      <a href="${data.portalLink}" style="display:inline-block;padding:14px 32px;background:#14B8A6;color:#000;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">${tpl.ctaLabel}</a>
    </div>

    <p style="color:#525252;font-size:12px;line-height:1.6;margin-top:48px;border-top:1px solid #1a1a1a;padding-top:24px;">
      This link gives you direct access to your portal. Bookmark it or save this email.<br>
      If you didn't make this purchase, you can ignore this email.
    </p>
  </div>
</body>
</html>`;
}

function buildPurchaseEmailText(data: PurchaseEmailData, tpl: TemplateStrings): string {
  return `THE ARCHIVIST METHOD

${tpl.headline}

${tpl.opener}

${patternLineText(data.patternName)}Your purchase: ${data.productName}
${receiptLineText(data.amountPaid)}Here's how to start
${tpl.howToStart}

${tpl.ctaLabel}: ${data.portalLink}

---
This link gives you direct access to your portal. Bookmark it or save this email.
If you didn't make this purchase, you can ignore this email.`;
}

export async function sendPurchaseConfirmationEmail(data: PurchaseEmailData): Promise<boolean> {
  const firstName = data.firstName || "there";
  const tpl = templateFor(data.tier ?? null, firstName);
  const html = buildPurchaseEmailHtml(data, tpl);
  const text = buildPurchaseEmailText(data, tpl);

  console.log(`[email.purchase] to=${data.email} tier=${data.tier ?? "generic"} product=${data.productName} subject="${tpl.subject}"`);

  if (process.env.NODE_ENV === "development") {
    console.log("[email.purchase] dev mode — not sending");
    console.log(text);
    return true;
  }

  try {
    const result = await resend.emails.send({
      from: 'The Archivist <hello@archiebase.com>',
      to: [data.email],
      subject: tpl.subject,
      html,
      text,
    });
    console.log(`[email.purchase] sent id=${(result as any)?.data?.id || "unknown"}`);
    return true;
  } catch (err) {
    console.error('[email.purchase] send failed:', err);
    return false;
  }
}
