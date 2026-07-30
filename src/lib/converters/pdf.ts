import { compress } from "@quicktoolsone/pdf-compress";

export type CompressionPreset = "lossless" | "balanced" | "max";

export async function compressPdf(
  file: File, 
  preset: CompressionPreset = "balanced",
  onProgress?: (progress: number, message?: string) => void
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  const result = await compress(arrayBuffer, {
    preset,
    onProgress: (event) => {
      if (onProgress) {
        onProgress(event.progress, event.message);
      }
    }
  });

  return new Blob([result.pdf], { type: "application/pdf" });
}
