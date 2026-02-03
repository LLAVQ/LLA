import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./lla.db");

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      title TEXT,
      author TEXT,
      difficulty TEXT,
      genreMatchScore REAL,
      reason TEXT
    )`
  );
});

export const saveRecommendations = (items: {
  id: string;
  title: string;
  author: string;
  difficulty: string;
  genreMatchScore: number;
  reason: string;
}[]) => {
  const statement = db.prepare(
    "INSERT OR REPLACE INTO recommendations (id, title, author, difficulty, genreMatchScore, reason) VALUES (?, ?, ?, ?, ?, ?)"
  );
  items.forEach((item) => {
    statement.run(item.id, item.title, item.author, item.difficulty, item.genreMatchScore, item.reason);
  });
  statement.finalize();
};
