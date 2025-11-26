import path from "path";
import { mkdirSync } from "fs";
import * as schema from './schema';
import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

type DbType = BunSQLiteDatabase<typeof schema> | BetterSQLite3Database<typeof schema>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConnType = any;

let dbConn: ConnType;
let db: DbType | undefined;

async function initializeDb() {
  const dbDir = path.join(process.cwd(), "data");
  mkdirSync(dbDir, { recursive: true });
  
  if (typeof Bun !== 'undefined') {
    const { Database } = await import('bun:sqlite');
    const { drizzle } = await import('drizzle-orm/bun-sqlite');
    
    const dbPath = path.join(dbDir, "app.db");
    dbConn = new Database(dbPath);
    db = drizzle(dbConn, { schema });
  } else {
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const Database = (await import('better-sqlite3')).default;
    
    const dbPath = path.join(dbDir, "app.db");
    dbConn = new Database(dbPath);
    db = drizzle(dbConn, { schema });
  }
}

initializeDb();

export { dbConn, db };
