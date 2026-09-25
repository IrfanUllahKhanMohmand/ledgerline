import express from "express";

import { readAccessToken, secretFrom, signAccessToken } from "./auth/token.js";
import {
  LedgerStore,
  serializeItem,
  serializeUploadJob,
  serializeUser,
} from "./store/ledger-store.js";

export type AppOptions = {
  store?: LedgerStore;
  jwtSecret?: Uint8Array;
};

function bearer(header: string | undefined): string | undefined {
  if (!header?.startsWith("Bearer ")) {
    return undefined;
  }
  return header.slice("Bearer ".length).trim();
}

export function createApp(options: AppOptions = {}) {
  const store = options.store ?? new LedgerStore();
  const jwtSecret =
    options.jwtSecret ??
    secretFrom(process.env.JWT_SECRET ?? "dev-only-change-me");
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      name: "ledgerline-api",
      status: "ok",
      database: process.env.DATABASE_URL ? "configured" : "off",
    });
  });

  app.post("/auth/register", async (req, res) => {
    try {
      const email = typeof req.body?.email === "string" ? req.body.email : "";
      const password =
        typeof req.body?.password === "string" ? req.body.password : "";
      const user = await store.register(email, password);
      const token = await signAccessToken(user.id, jwtSecret);
      res.status(201).json({ token, user: serializeUser(user) });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "invalid registration",
      });
    }
  });

  app.post("/auth/login", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";
    const user = await store.authenticate(email, password);
    if (!user) {
      res.status(401).json({ error: "invalid credentials" });
      return;
    }
    const token = await signAccessToken(user.id, jwtSecret);
    res.json({ token, user: serializeUser(user) });
  });

  async function currentUser(req: express.Request) {
    const token = bearer(req.headers.authorization);
    if (!token) {
      return undefined;
    }
    const userId = await readAccessToken(token, jwtSecret);
    return userId ? store.getUser(userId) : undefined;
  }

  app.post("/items", async (req, res) => {
    const user = await currentUser(req);
    if (!user) {
      res.status(401).json({ error: "missing token" });
      return;
    }
    try {
      const title = typeof req.body?.title === "string" ? req.body.title : "";
      const notes =
        typeof req.body?.notes === "string" ? req.body.notes : undefined;
      const item = store.addItem(user.id, title, notes);
      res.status(201).json(serializeItem(item));
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "invalid item",
      });
    }
  });

  app.get("/items", async (req, res) => {
    const user = await currentUser(req);
    if (!user) {
      res.status(401).json({ error: "missing token" });
      return;
    }
    res.json(store.listItems(user.id).map(serializeItem));
  });

  app.post("/items/:id/upload", async (req, res) => {
    const user = await currentUser(req);
    if (!user) {
      res.status(401).json({ error: "missing token" });
      return;
    }
    try {
      const imageKey =
        typeof req.body?.imageKey === "string" ? req.body.imageKey : "";
      const job = store.startUpload(user.id, req.params.id, imageKey);
      res.status(202).json(serializeUploadJob(job));
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "invalid upload",
      });
    }
  });

  app.get("/upload-jobs", async (req, res) => {
    const user = await currentUser(req);
    if (!user) {
      res.status(401).json({ error: "missing token" });
      return;
    }
    res.json(store.listUploadJobs(user.id).map(serializeUploadJob));
  });

  app.post("/upload-jobs/:id/retry", async (req, res) => {
    const user = await currentUser(req);
    if (!user) {
      res.status(401).json({ error: "missing token" });
      return;
    }
    try {
      const job = store.retryUpload(user.id, req.params.id);
      res.json(serializeUploadJob(job));
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "invalid retry",
      });
    }
  });

  return app;
}
