import { removeBackground } from "@imgly/background-removal";

self.addEventListener("message", async (e: MessageEvent) => {
  const { file, quality, id } = e.data;
  
  try {
    const blob = await removeBackground(file, { model: quality });
    self.postMessage({ id, success: true, blob });
  } catch (error: any) {
    self.postMessage({ id, success: false, error: error.message || "Failed to remove background" });
  }
});
