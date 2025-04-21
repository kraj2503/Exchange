import { Client } from "pg";
import { login } from "./login";

const client = new Client(login);

async function initializeDB() {
  try {
    await client.connect();

    // 1. Drop and create the base table
    await client.query(`DROP TABLE IF EXISTS "ETH_INR" CASCADE`);

    await client.query(`
      CREATE TABLE "ETH_INR" (
        time TIMESTAMPTZ NOT NULL,
        price DOUBLE PRECISION,
        volume DOUBLE PRECISION,
        currency_code VARCHAR(10)
      );
    `);

    // 2. Convert to hypertable (TimescaleDB)
    await client.query(
      `SELECT DISTINCT create_hypertable('"ETH_INR"', 'time', if_not_exists => TRUE);`
    );

    // 3. Seed sample data
    const now = new Date();
    const insertQuery = `
      INSERT INTO "ETH_INR" (time, price, volume, currency_code)
      VALUES ($1, $2, $3, $4);
    `;

    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(now.getTime() - (Math.random()*10) * 60 * 1000); // 1-minute intervals
      const price = 2000 + Math.random() * 100;
      const volume = Math.random() * 5;
      const currency = "ETH_INR";
console.log("seeding: \n",insertQuery, [timestamp, price, volume, currency]);

      await client.query(insertQuery, [timestamp, price, volume, currency]);
    }

    // 4. Create materialized views
    const viewQuery = (intervalLabel: string, intervalSQL: string) => `
    CREATE MATERIALIZED VIEW IF NOT EXISTS klines_${intervalLabel} AS
    SELECT
      time_bucket(INTERVAL '${intervalSQL}', time) AS bucket,
      first(price, time) AS open,
      max(price) AS high,
      min(price) AS low,
      last(price, time) AS close,
      sum(volume) AS volume,
      currency_code
    FROM "ETH_INR"
    GROUP BY bucket, currency_code;
  `;

    await client.query(viewQuery("1m", "1 minute"));
    await client.query(viewQuery("1h", "1 hour"));
    await client.query(viewQuery("1w", "1 week"));

    console.log("✅ Database initialized and seeded successfully.");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    await client.end();
  }
}

initializeDB();
