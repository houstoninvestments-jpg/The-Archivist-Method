import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server/index";

let appPromise: ReturnType<typeof createApp> | null = null;

function getApp() {
  if (!appPromise) {
    appPromise = createApp();
  }
  return appPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const { app } = await getApp();
  return app(req as any, res as any);
}
