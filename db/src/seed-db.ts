import { Client } from "pg";

const client = new Client({
  user: "exchange",
  host: "localhost",
  database: "my_database",
  password: "toughpassword",
  port: 5432,
});

async function initializeDB() {
  try {
    await client.connect();

    // 1. Drop and create the base table
    await client.query(`DROP TABLE IF EXISTS "ETH_INR"`);

    await client.query(`
      CREATE TABLE "ETH_INR" (
        time TIMESTAMPTZ NOT NULL,
        price DOUBLE PRECISION,
        volume DOUBLE PRECISION,
        currency_code VARCHAR(10)
      );
    `);

    // 2. Convert to hypertable (TimescaleDB)
    await client.query(`SELECT create_hypertable('"ETH_INR"', 'time', if_not_exists => TRUE);`);


    // 3. Seed sample data
    const now = new Date();
    const insertQuery = `
      INSERT INTO "ETH_INR" (time, price, volume, currency_code)
      VALUES ($1, $2, $3, $4);
    `;

    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000); // 1-minute intervals
      const price = 2000 + Math.random() * 100;
      const volume = Math.random() * 5;
      const currency = "ETHINR";

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
  
  await client.query(viewQuery("1_minute", "1 minute"));
  await client.query(viewQuery("1_hour", "1 hour"));
  await client.query(viewQuery("1_week", "1 week"));
  
    console.log("✅ Database initialized and seeded successfully.");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    await client.end();
  }
}

initializeDB();
