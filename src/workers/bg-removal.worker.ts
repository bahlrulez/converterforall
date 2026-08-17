import { removeBackground, Config } from "@imgly/background-removal";

self.addEventListener("message", async (e: MessageEvent) => {
  const { file, quality, id } = e.data;
  
  try {
    // 1. Attempt High-Performance WebGPU / WebGL hardware acceleration
    const gpuConfig: Config = {
      model: quality || "medium",
      device: "gpu",
    };
    const blob = await removeBackground(file, gpuConfig);
    self.postMessage({ id, success: true, blob, accelerated: true });
  } catch (gpuError: any) {
    console.warn("GPU background removal failed or unsupported, falling back to CPU WASM:", gpuError);
    try {
      // 2. Safe Graceful Fallback to CPU WASM for older devices
      const cpuConfig: Config = {
        model: quality || "medium",
        device: "cpu",
      };
      const blob = await removeBackground(file, cpuConfig);
      self.postMessage({ id, success: true, blob, accelerated: false });
    } catch (cpuError: any) {
      self.postMessage({ id, success: false, error: cpuError.message || "Failed to remove background" });
    }
  }
});
