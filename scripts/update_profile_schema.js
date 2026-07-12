const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.axllbwlghtutpilbvqkz:Kylafrandilbert123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres'
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase DB for schema update");

    const query = `
      ALTER TABLE portfolio_profile 
      ADD COLUMN IF NOT EXISTS experience_years TEXT DEFAULT '4+ yrs',
      ADD COLUMN IF NOT EXISTS uptime TEXT DEFAULT '100%',
      ADD COLUMN IF NOT EXISTS projects_count TEXT DEFAULT '10+',
      ADD COLUMN IF NOT EXISTS alma_mater TEXT DEFAULT 'WMSU';

      UPDATE portfolio_profile 
      SET experience_years = '4+ yrs',
          uptime = '100%',
          projects_count = '10+',
          alma_mater = 'WMSU'
      WHERE name = 'Fran Peruso';
    `;
    await client.query(query);
    console.log("Profile schema updated with metrics.");
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    await client.end();
  }
}

run();
