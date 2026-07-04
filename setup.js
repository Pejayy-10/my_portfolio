const { Client } = require('pg');

const run = async () => {
  const client = new Client({
    connectionString: "postgresql://postgres.axllbwlghtutpilbvqkz:Kylafrandilbert123@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
  });
  
  await client.connect();
  console.log("Connected to Supabase Postgres.");

  // Enable Realtime on the table we are about to create
  await client.query(`
    CREATE TABLE IF NOT EXISTS metrics (
      id integer PRIMARY KEY DEFAULT 1,
      views integer NOT NULL DEFAULT 51
    );
  `);
  
  await client.query(`
    INSERT INTO metrics (id, views) VALUES (1, 51)
    ON CONFLICT (id) DO NOTHING;
  `);

  // To allow anonymous users to view/increment the metrics
  // Wait, actually since this is a public portfolio we can just allow read/write or handle writes via server actions using service_role key, or anon key if RLS allows it.
  // We'll set up basic RLS
  await client.query(`
    ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
  `);
  
  // Create policy to allow all reads
  await client.query(`
    DROP POLICY IF EXISTS "Allow public read" ON metrics;
    CREATE POLICY "Allow public read" ON metrics FOR SELECT USING (true);
  `);

  // Create policy to allow all updates
  await client.query(`
    DROP POLICY IF EXISTS "Allow public update" ON metrics;
    CREATE POLICY "Allow public update" ON metrics FOR UPDATE USING (true);
  `);
  
  // Enable realtime for the table
  await client.query(`
    begin;
    drop publication if exists supabase_realtime;
    create publication supabase_realtime;
    commit;
    alter publication supabase_realtime add table metrics;
  `).catch(e => console.log("Publication might already exist", e.message));

  console.log("Table metrics created and realtime configured!");
  await client.end();
};

run().catch(console.error);
