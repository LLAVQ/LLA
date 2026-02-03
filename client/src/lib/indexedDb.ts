import { openDB } from "idb";
import { BookRecommendation } from "@/types";

const DB_NAME = "lla-db";
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("library")) {
      db.createObjectStore("library", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("dictionary")) {
      db.createObjectStore("dictionary", { keyPath: "term" });
    }
  }
});

export async function saveBookToLibrary(book: BookRecommendation) {
  const db = await dbPromise;
  await db.put("library", book);
}

export async function loadLibrary(): Promise<BookRecommendation[]> {
  const db = await dbPromise;
  return db.getAll("library");
}
