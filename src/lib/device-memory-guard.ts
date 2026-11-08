export type StabilityRisk = "safe" | "caution" | "danger";

export interface DeviceProfile {
  isMobile: boolean;
  isIos: boolean;
  isAndroid: boolean;
  deviceMemoryGb?: number;
  hardwareConcurrency?: number;
  isLowEndDevice: boolean;
}

export interface MemoryCheckResult {
  risk: StabilityRisk;
  title: string;
  message: string;
  recommendedAction?: string;
  targetResolution?: "720p" | "480p" | "original";
  dismissible: boolean;
}

/**
 * Inspects device environment safely on client.
 */
export function getDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isMobile: false,
      isIos: false,
      isAndroid: false,
      isLowEndDevice: false,
    };
  }

  const ua = navigator.userAgent || "";
  const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIos || isAndroid || /Mobi|Tablet/i.test(ua) || (window.innerWidth < 768 && navigator.maxTouchPoints > 0);

  // Read deviceMemory hint if provided by Chromium
  const navAny = navigator as unknown as { deviceMemory?: number };
  const deviceMemoryGb = typeof navAny.deviceMemory === "number" ? navAny.deviceMemory : undefined;
  const hardwareConcurrency = typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : undefined;

  const isLowEndDevice =
    isMobile ||
    (typeof deviceMemoryGb === "number" && deviceMemoryGb <= 3) ||
    (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4);

  return {
    isMobile,
    isIos,
    isAndroid,
    deviceMemoryGb,
    hardwareConcurrency,
    isLowEndDevice,
  };
}

/**
 * Checks stability risk for in-browser video compression / WASM conversion.
 */
export function checkVideoMemoryRisk(fileSizeBytes: number, durationSeconds?: number): MemoryCheckResult {
  const profile = getDeviceProfile();
  const sizeMb = fileSizeBytes / (1024 * 1024);

  // Mobile risk thresholds
  if (profile.isMobile) {
    if (sizeMb >= 160) {
      return {
        risk: "danger",
        title: "High Mobile Memory Risk",
        message: `Your video is ${sizeMb.toFixed(0)} MB. Mobile phone browsers enforce strict per-tab memory limits (often 500 MB–1 GB). Because our compression runs 100% inside your browser rather than on a server, processing a file this large on a phone can cause your browser tab to reload.`,
        recommendedAction: "Downscale to 480p or compress on a computer",
        targetResolution: "480p",
        dismissible: true,
      };
    }

    if (sizeMb >= 65) {
      return {
        risk: "caution",
        title: "Memory Advisory for Phones",
        message: `Your video is ${sizeMb.toFixed(0)} MB. Processing in your phone's browser works best when scaling to 720p or 480p to prevent memory pressure.`,
        recommendedAction: "Switch to 720p Safe Mode",
        targetResolution: "720p",
        dismissible: true,
      };
    }
  }

  // Desktop risk thresholds
  if (!profile.isMobile) {
    if (sizeMb >= 400) {
      return {
        risk: "caution",
        title: "Large Video Notice",
        message: `Your video is ${sizeMb.toFixed(0)} MB. Because processing runs entirely on your device, compressing this file may take several minutes depending on your computer's CPU.`,
        recommendedAction: "Keep tab active during compression",
        dismissible: true,
      };
    }
  }

  return {
    risk: "safe",
    title: "Safe",
    message: "File size is well within client-side memory safety boundaries.",
    dismissible: true,
  };
}

/**
 * Checks stability risk for multi-page PDF canvas rendering.
 */
export function checkPdfMemoryRisk(fileSizeBytes: number, pageCount?: number): MemoryCheckResult {
  const profile = getDeviceProfile();
  const sizeMb = fileSizeBytes / (1024 * 1024);

  if (profile.isMobile) {
    if ((pageCount && pageCount > 25) || sizeMb > 40) {
      return {
        risk: "caution",
        title: "Large Document Advisory",
        message: `This PDF contains ${pageCount ? `${pageCount} pages` : `${sizeMb.toFixed(0)} MB`}. Rendering numerous high-resolution pages on a mobile phone can slow down your browser. Processing may take a moment.`,
        recommendedAction: "Proceeding with adaptive page budgeting",
        dismissible: true,
      };
    }
  }

  return {
    risk: "safe",
    title: "Safe",
    message: "PDF is within safe processing bounds.",
    dismissible: true,
  };
}

