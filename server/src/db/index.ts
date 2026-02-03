import Database from "better-sqlite3";
import path from "path";

const dbFile = path.join(process.cwd(), "lla.db");

export const db = new Database(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function saveRecommendation(id: string, payload: string) {
  const stmt = db.prepare("INSERT OR REPLACE INTO recommendations (id, payload) VALUES (?, ?)");
  stmt.run(id, payload);
}

export function getRecommendation(id: string) {
  const stmt = db.prepare("SELECT payload FROM recommendations WHERE id = ?");
  return stmt.get(id) as { payload: string } | undefined;
}
