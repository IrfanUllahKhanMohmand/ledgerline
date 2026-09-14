import { createApp } from "./app.js";
import { createPool, migrate } from "./db/migrate.js";

const port = Number(process.env.PORT ?? 3001);

async function main() {
  if (process.env.DATABASE_URL) {
    const pool = createPool(process.env.DATABASE_URL);
    await migrate(pool);
    await pool.end();
  }

  createApp().listen(port, () => {
    console.log(`Ledgerline API listening on ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
