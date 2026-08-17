import { removeBackground } from "@imgly/background-removal";

self.addEventListener("message", async (e: MessageEvent) => {
  const { file, quality, id } = e.data;
  
  try {
    const validModel = (quality === "isnet" || quality === "isnet_fp16" || quality === "isnet_quint8") ? quality : "isnet_fp16";
    const blob = await removeBackground(file, { 
      model: validModel,
      proxyToWorker: false
    });
    self.postMessage({ id, success: true, blob });
  } catch (error: any) {
    self.postMessage({ id, success: false, error: error?.message || String(error) || "Failed to remove background" });
  }
});
