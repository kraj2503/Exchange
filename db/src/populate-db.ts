import { Client } from "pg";
import { login } from "./login";

async function fixMaterializedViews() {
  const client = new Client(login);
  
  try {
    await client.connect();
    console.log("Connected to database");
    
    // First, let's verify we have data in the raw table
    const countCheck = await client.query(`SELECT COUNT(*) FROM "ETH_INR"`);
    const existingRows = parseInt(countCheck.rows[0].count, 10);
    console.log(`Table "ETH_INR" contains ${existingRows.toLocaleString()} rows.`);
    
    if (existingRows === 0) {
      console.error("No data found in ETH_INR table. Please seed the database first.");
      return;
    }
    
    // Let's check a sample of the time data to ensure it's properly formatted
    const timeSample = await client.query(`
      SELECT time FROM "ETH_INR" 
      ORDER BY time 
      LIMIT 5
    `);
    console.log("Time sample:", timeSample.rows.map(r => r.time));
    
    // Drop existing materialized views
    console.log("Dropping existing materialized views...");
    
    try {
      await client.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1m`);
      console.log("✓ Dropped klines_1m");
    } catch (err:any) {
      console.error("Error dropping klines_1m:", err.message);
    }
    
    try {
      await client.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1h`);
      console.log("✓ Dropped klines_1h");
    } catch (err:any) {
      console.error("Error dropping klines_1h:", err.message);
    }
    
    try {
      await client.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1w`);
      console.log("✓ Dropped klines_1w");
    } catch (err:any) {
      console.error("Error dropping klines_1w:", err.message);
    }
    
    // Create new materialized views with proper TimescaleDB functions
    console.log("Creating new materialized views...");
    
    // 1-minute klines
    try {
      await client.query(`
        CREATE MATERIALIZED VIEW klines_1m AS
        SELECT
          time_bucket('1 minute', time) AS bucket,
          currency_code,
          FIRST(price, time) AS open,
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, time) AS close,
          SUM(volume) AS volume
        FROM "ETH_INR"
        GROUP BY bucket, currency_code
        ORDER BY bucket;
      `);
      console.log("✓ Created klines_1m");
    } catch (err:any) {
      console.error("Error creating klines_1m:", err.message);
    }
    
    // 1-hour klines
    try {
      await client.query(`
        CREATE MATERIALIZED VIEW klines_1h AS
        SELECT
          time_bucket('1 hour', time) AS bucket,
          currency_code,
          FIRST(price, time) AS open,
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, time) AS close,
          SUM(volume) AS volume
        FROM "ETH_INR"
        GROUP BY bucket, currency_code
        ORDER BY bucket;
      `);
      console.log("✓ Created klines_1h");
    } catch (err:any) {
      console.error("Error creating klines_1h:", err.message);
    }
    
    // 1-week klines
    try {
      await client.query(`
        CREATE MATERIALIZED VIEW klines_1w AS
        SELECT
          time_bucket('1 week', time) AS bucket,
          currency_code,
          FIRST(price, time) AS open,
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, time) AS close,
          SUM(volume) AS volume
        FROM "ETH_INR"
        GROUP BY bucket, currency_code
        ORDER BY bucket;
      `);
      console.log("✓ Created klines_1w");
    } catch (err:any) {
      console.error("Error creating klines_1w:", err.message);
    }
    
    // Create some additional useful time frames
    try {
      await client.query(`
        CREATE MATERIALIZED VIEW klines_15m AS
        SELECT
          time_bucket('15 minutes', time) AS bucket,
          currency_code,
          FIRST(price, time) AS open,
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, time) AS close,
          SUM(volume) AS volume
        FROM "ETH_INR"
        GROUP BY bucket, currency_code
        ORDER BY bucket;
      `);
      console.log("✓ Created klines_15m");
    } catch (err:any) {
      console.error("Error creating klines_15m:", err.message);
    }
    
    try {
      await client.query(`
        CREATE MATERIALIZED VIEW klines_1d AS
        SELECT
          time_bucket('1 day', time) AS bucket,
          currency_code,
          FIRST(price, time) AS open,
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, time) AS close,
          SUM(volume) AS volume
        FROM "ETH_INR"
        GROUP BY bucket, currency_code
        ORDER BY bucket;
      `);
      console.log("✓ Created klines_1d");
    } catch (err:any) {
      console.error("Error creating klines_1d:", err.message);
    }
    
    // Check if the views have data
    console.log("\nVerifying data in materialized views...");
    
    try {
      const hourlyCount = await client.query(`SELECT COUNT(*) FROM klines_1h`);
      console.log(`klines_1h has ${hourlyCount.rows[0].count} rows`);
      
      const hourlyData = await client.query(`
        SELECT bucket, open, high, low, close, volume 
        FROM klines_1h 
        WHERE open IS NOT NULL
        ORDER BY bucket DESC 
        LIMIT 5
      `);
      
      console.log("Sample data from klines_1h:");
      console.table(hourlyData.rows);
      
      if (hourlyData.rows.length === 0) {
        console.warn("⚠️ No valid data found in klines_1h view. Check your source data.");
      }
    } catch (err:any) {
      console.error("Error checking klines_1h:", err.message);
    }
    
    // Check time ranges
    try {
      const timeRange = await client.query(`
        SELECT 
          MIN(time) as earliest_data,
          MAX(time) as latest_data,
          MAX(time) - MIN(time) as time_span
        FROM "ETH_INR"
      `);
      
      console.log("\nTime range in database:");
      console.table(timeRange.rows);
    } catch (err:any) {
      console.error("Error checking time range:", err.message);
    }
    
    console.log("\n✅ Materialized views have been recreated.");
    
  } catch (err:any) {
    console.error("❌ Error:", err);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

fixMaterializedViews().catch(console.error);