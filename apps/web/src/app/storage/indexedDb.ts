const DB_NAME = "lla-storage";
const DB_VERSION = 1;

const stores = ["profiles", "library", "dictionary", "stats"] as const;

export type StoreName = (typeof stores)[number];

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id" });
        }
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const indexedDb = {
  async put<T extends { id: string }>(store: StoreName, value: T) {
    const db = await openDatabase();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
  async getAll<T>(store: StoreName) {
    const db = await openDatabase();
    return new Promise<T[]>((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const request = tx.objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }
};
