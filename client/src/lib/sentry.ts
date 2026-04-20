import * as Sentry from "@sentry/react";

let initialized = false;

export function initSentry() {
  if (initialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.info("[sentry] VITE_SENTRY_DSN not set — skipping client init");
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_RELEASE_SHA,
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: import.meta.env.PROD ? 0.1 : 0,
      integrations: [Sentry.browserTracingIntegration()],
    });
    initialized = true;
  } catch (err) {
    console.warn("[sentry] client init failed", err);
  }
}
