import express from "express";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      name: "ledgerline-api",
      status: "ok",
      database: process.env.DATABASE_URL ? "configured" : "off",
    });
  });

  return app;
}
