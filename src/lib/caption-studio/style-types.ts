export interface StyleSettings {
  fontFamily: string;
  fontSize: number; // Normalized (video-relative, e.g., 0.05)
  textColor: string;
  outlineColor: string;
  outlineWidth: number; // Normalized (video-relative, e.g., 0.005)
  shadowColor: string;
  shadowBlur: number; // Normalized
  shadowOffsetX: number; // Normalized
  shadowOffsetY: number; // Normalized
  backgroundColor: string;
  backgroundOpacity: number; // 0.0 to 1.0
  backgroundPadding: number; // Normalized
  backgroundRadius: number; // Normalized
  textAlign: CanvasTextAlign;
  lineHeight: number; // Multiplier, e.g., 1.3
}

export interface PositionSettings {
  x: number; // Normalized (0.0 to 1.0)
  y: number; // Normalized (0.0 to 1.0)
}

export interface FontPayload {
  name: string;
  buffer: ArrayBuffer;
}
