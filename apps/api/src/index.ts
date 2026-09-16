import { createApp } from "./app.js";
import { secretFrom } from "./auth/token.js";
import { createPool, migrate } from "./db/migrate.js";
import { LedgerStore } from "./store/ledger-store.js";

const port = Number(process.env.PORT ?? 3001);
const jwtSecret = secretFrom(process.env.JWT_SECRET ?? "dev-only-change-me");

async function main() {
  if (process.env.DATABASE_URL) {
    const pool = createPool(process.env.DATABASE_URL);
    await migrate(pool);
    await pool.end();
  }

  createApp({ store: new LedgerStore(), jwtSecret }).listen(port, () => {
    console.log(`Ledgerline API listening on ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
