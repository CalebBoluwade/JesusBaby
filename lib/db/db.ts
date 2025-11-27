import path from "path";
import { mkdirSync } from "fs";
import * as schema from './schema';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

type DbType = BetterSQLite3Database<typeof schema>;
let db: DbType | undefined;

async function initializeDb() {
  const dbDir = path.join("/tmp", "jesus-baby");
  mkdirSync(dbDir, { recursive: true });
  
  const { drizzle } = await import('drizzle-orm/better-sqlite3');
  const Database = (await import('better-sqlite3')).default;
  
  const dbPath = path.join(dbDir, "app.db");
  const dbConn = new Database(dbPath);
  db = drizzle(dbConn, { schema });
}

initializeDb();

export { db };
