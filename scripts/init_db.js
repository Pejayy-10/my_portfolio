const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.axllbwlghtutpilbvqkz:Kylafrandilbert123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres'
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase DB");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        username TEXT NOT NULL,
        gender TEXT NOT NULL,
        location TEXT NOT NULL,
        content TEXT NOT NULL
      );
    `;
    await client.query(createTableQuery);
    console.log("Table 'messages' ensured.");

    // Enable Realtime for the table
    try {
      await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE messages;`);
      console.log("Realtime enabled for 'messages' table.");
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('already in publication')) {
        console.log("Realtime already enabled for 'messages'.");
      } else {
        throw err;
      }
    }

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing DB:", err);
  } finally {
    await client.end();
  }
}

run();
