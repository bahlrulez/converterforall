// Client-side persistent file transfer cache for seamless auto-conversion across SPA & full page reloads
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
    const request = indexedDB.open(DB_NAME, 2);
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
 * Guarantees IndexedDB transaction completes before resolving.
 */
export async function storePendingFile(file: File, toolSlug: string): Promise<void> {
  const timestamp = Date.now();
  memoryPendingFile = {
    file,
    toolSlug,
    timestamp,
  };

  try {
    sessionStorage.setItem(
      "converter_pending_meta",
      JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        toolSlug,
        timestamp,
      })
    );
  } catch {}

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      
      store.put(
        {
          file,
          toolSlug,
          timestamp,
        },
        "latest_file"
      );

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("Could not save pending file to IndexedDB:", err);
  }
}

/**
 * Retrieves the pending file, checking in-memory, sessionStorage, and IndexedDB.
 * Retains file across page reloads (up to 10 minutes).
 */
export async function getPendingFile(targetToolSlug?: string): Promise<File | null> {
  const now = Date.now();
  const maxAge = 10 * 60 * 1000; // 10 minutes

  // 1. Check in-memory first
  if (memoryPendingFile && now - memoryPendingFile.timestamp < maxAge) {
    if (!targetToolSlug || memoryPendingFile.toolSlug === targetToolSlug || memoryPendingFile.toolSlug.includes(targetToolSlug) || targetToolSlug.includes(memoryPendingFile.toolSlug)) {
      const file = memoryPendingFile.file;
      return file;
    }
  }

  // 2. Check IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get("latest_file");

      req.onsuccess = () => {
        const data = req.result;
        if (data && data.file && (now - (data.timestamp || 0) < maxAge)) {
          if (!targetToolSlug || data.toolSlug === targetToolSlug || data.toolSlug.includes(targetToolSlug) || targetToolSlug.includes(data.toolSlug)) {
            // Update memory cache
            memoryPendingFile = data;
            resolve(data.file);
            return;
          }
        }
        resolve(null);
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Clears pending file storage after successful conversion start.
 */
export async function clearPendingFile(): Promise<void> {
  memoryPendingFile = null;
  try {
    sessionStorage.removeItem("converter_pending_meta");
  } catch {}
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete("latest_file");
  } catch {
    // Ignore cleanup errors
  }
}
