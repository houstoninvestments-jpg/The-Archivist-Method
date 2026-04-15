/**
 * Seed a test user directly into the database.
 *
 * Usage:
 *   DATABASE_URL=postgres://... npx tsx scripts/seed-test-user.ts
 *
 * Or set the inputs via env vars:
 *   SEED_EMAIL=houstoninvestments@gmail.com \
 *   SEED_NAME="Aaron Houston" \
 *   SEED_PATTERN=disappearing \
 *   SEED_ACCESS=archive \
 *   npx tsx scripts/seed-test-user.ts
 *
 * Defaults match the Archivist Method test user:
 *   email=houstoninvestments@gmail.com, name="Aaron Houston",
 *   primaryPattern=disappearing, accessLevel=archive.
 */
import pg from "pg";
import crypto from "crypto";

const EMAIL = (process.env.SEED_EMAIL || "houstoninvestments@gmail.com").toLowerCase();
const NAME = process.env.SEED_NAME || "Aaron Houston";
const PATTERN = process.env.SEED_PATTERN || "disappearing";
const ACCESS = process.env.SEED_ACCESS || "archive";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL must be set.");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: dbUrl });
  const client = await pool.connect();

  try {
    console.log(`Seeding test user: ${EMAIL} (pattern=${PATTERN}, access=${ACCESS})`);

    await client.query("BEGIN");

    // 1. test_users — upsert by email
    const testUpsert = await client.query(
      `INSERT INTO test_users (id, email, access_level, god_mode, note)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
         SET access_level = EXCLUDED.access_level,
             god_mode = EXCLUDED.god_mode,
             note = EXCLUDED.note
       RETURNING id, email, access_level, god_mode`,
      [crypto.randomUUID(), EMAIL, ACCESS, true, "Seeded via scripts/seed-test-user.ts"],
    );
    console.log("  test_users:", testUpsert.rows[0]);

    // 2. quiz_users — upsert by email so the portal UI gets a pattern + name
    const quizUpsert = await client.query(
      `INSERT INTO quiz_users (id, email, name, primary_pattern, access_level)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
         SET name = COALESCE(quiz_users.name, EXCLUDED.name),
             primary_pattern = COALESCE(quiz_users.primary_pattern, EXCLUDED.primary_pattern),
             access_level = CASE
               WHEN quiz_users.access_level IN ('free', NULL) THEN EXCLUDED.access_level
               ELSE quiz_users.access_level
             END
       RETURNING id, email, name, primary_pattern, access_level`,
      [crypto.randomUUID(), EMAIL, NAME, PATTERN, ACCESS],
    );
    console.log("  quiz_users:", quizUpsert.rows[0]);

    await client.query("COMMIT");
    console.log("Done. You can now log in at /portal/login with this email.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
