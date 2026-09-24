export { db } from "@/db";

import { db } from "@/db";

export function getDb() {
  return Promise.resolve(db);
}

export default db;
