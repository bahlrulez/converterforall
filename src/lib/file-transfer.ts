// In-memory and IndexedDB client-side file transfer cache for seamless auto-conversion
const DB_NAME = "converter_transfer_db";
const STORE_NAME = "pending_files";

// In-memory storage for super-fast SPA transitions
let memoryPendingFile: { file: File; toolSlug: string; timestamp: number } | null = null;

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores a pending file to be consumed by the destination tool page.
 */
export async function storePendingFile(file: File, toolSlug: string): Promise<void> {
  memoryPendingFile = {
    file,
    toolSlug,
    timestamp: Date.now(),
  };

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(
      {
        file,
        toolSlug,
        timestamp: Date.now(),
      },
      "latest_file"
    );
  } catch (err) {
    console.warn("Could not save pending file to IndexedDB:", err);
  }
}

/**
 * Retrieves the pending file, optionally checking matching toolSlug.
 */
export async function getPendingFile(targetToolSlug?: string): Promise<File | null> {
  // Check in-memory first (valid for 5 minutes)
  if (memoryPendingFile && Date.now() - memoryPendingFile.timestamp < 300000) {
    if (!targetToolSlug || memoryPendingFile.toolSlug === targetToolSlug) {
      const file = memoryPendingFile.file;
      memoryPendingFile = null; // Consume once
      clearPendingFile();
      return file;
    }
  }

  // Fallback to IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get("latest_file");

      req.onsuccess = () => {
        const data = req.result;
        if (data && data.file && (!targetToolSlug || data.toolSlug === targetToolSlug)) {
          // Clean up
          store.delete("latest_file");
          resolve(data.file);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Clears pending file storage
 */
export async function clearPendingFile(): Promise<void> {
  memoryPendingFile = null;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete("latest_file");
  } catch {
    // Ignore cleanup errors
  }
}
