// ============================================================
// Resend Client (server-side)
// Initialized from RESEND_API_KEY. Used by the email-sequence
// infrastructure to send the Crash Course and buyer sequences.
// ============================================================

import { Resend } from 'resend';

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY is not set. Add it to your environment to send email.');
    }
    client = new Resend(key);
  }
  return client;
}

export function getFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    'The Archivist <archivist@thearchivistmethod.com>'
  );
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResendClient() as any)[prop];
  },
});
