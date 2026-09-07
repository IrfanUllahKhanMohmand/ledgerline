import express from "express";
import { createItem, createUser, enqueueUpload } from "./models/index.js";

const port = Number(process.env.PORT ?? 3001);
const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "ledgerline-api",
    status: "ok",
  });
});

app.listen(port, () => {
  const demoUser = createUser({ email: "maya@example.com" });
  const demoItem = createItem({ userId: demoUser.id, title: "Cafe receipt" });
  const demoJob = enqueueUpload({ itemId: demoItem.id });
  console.log(`Ledgerline API listening on ${port} (job ${demoJob.id})`);
});
