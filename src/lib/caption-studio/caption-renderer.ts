import { CaptionChunk } from './types';
import { StyleSettings, PositionSettings } from './style-types';
import { getActiveWordIndex } from './active-word';

export function roundRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export const DEFAULT_STYLE: StyleSettings = {
  fontFamily: '"Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
  fontSize: 0.065, // 6.5% of video height
  textColor: '#FFFFFF',
  outlineColor: '#000000',
  outlineWidth: 0.008,
  shadowColor: 'rgba(0,0,0,0.8)',
  shadowBlur: 0.01,
  shadowOffsetX: 0.005,
  shadowOffsetY: 0.005,
  backgroundColor: '#000000',
  backgroundOpacity: 0, 
  backgroundPadding: 0.02,
  backgroundRadius: 0.015,
  textAlign: 'center',
  lineHeight: 1.3
};

export const DEFAULT_POSITION: PositionSettings = {
  x: 0.5,
  y: 0.65 // 65% down the frame
};

export function renderCaptionToCanvas(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  caption: CaptionChunk,
  videoWidth: number,
  videoHeight: number,
  style: StyleSettings,
  position: PositionSettings,
  currentTime?: number
) {
  if (!caption.text) return;
  const text = caption.text.trim();
  if (!text) return;

  // 1. Resolve normalized sizes to pixels
  let fontSizePx = videoHeight * style.fontSize;
  const maxTextWidth = videoWidth * 0.85;

  ctx.font = `bold ${fontSizePx}px ${style.fontFamily}`;
  ctx.textAlign = style.textAlign;
  ctx.textBaseline = 'middle';

  // 2. Shrink-to-fit check
  const words = text.split(/\s+/).filter(Boolean);
  let maxWordWidth = 0;
  for (const word of words) {
    const w = ctx.measureText(word).width;
    if (w > maxWordWidth) maxWordWidth = w;
  }

  if (maxWordWidth > maxTextWidth) {
    const scale = maxTextWidth / maxWordWidth;
    fontSizePx *= scale;
    ctx.font = `bold ${fontSizePx}px ${style.fontFamily}`;
  }

  const strokeWidthPx = videoHeight * style.outlineWidth;
  const lineSpacingPx = fontSizePx * style.lineHeight;
  const paddingPx = videoHeight * style.backgroundPadding;
  const radiusPx = videoHeight * style.backgroundRadius;
  const blurPx = videoHeight * style.shadowBlur;
  const offsetX = videoHeight * style.shadowOffsetX;
  const offsetY = videoHeight * style.shadowOffsetY;

  // 3. Word-wrap calculation with per-word token tracking
  interface LineData {
    text: string;
    wordIndices: number[];
  }
  const lines: LineData[] = [];
  let currentLineText = words[0] || '';
  let currentLineWordIndices: number[] = [0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLineText + ' ' + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxTextWidth) {
      lines.push({ text: currentLineText, wordIndices: currentLineWordIndices });
      currentLineText = word;
      currentLineWordIndices = [i];
    } else {
      currentLineText = testLine;
      currentLineWordIndices.push(i);
    }
  }
  if (currentLineText) {
    lines.push({ text: currentLineText, wordIndices: currentLineWordIndices });
  }

  // 4. Compute Bounding Box
  let blockWidth = 0;
  for (const lineObj of lines) {
    const w = ctx.measureText(lineObj.text).width;
    if (w > blockWidth) blockWidth = w;
  }
  
  const blockHeight = (lines.length * lineSpacingPx) - (lineSpacingPx - fontSizePx);
  const boxWidth = blockWidth + (paddingPx * 2);
  const boxHeight = blockHeight + (paddingPx * 2);

  let centerX = videoWidth * position.x;
  let centerY = videoHeight * position.y;

  const halfBoxW = boxWidth / 2;
  const halfBoxH = boxHeight / 2;
  
  // Clamp inside frame
  if (centerX - halfBoxW < 0) centerX = halfBoxW;
  if (centerX + halfBoxW > videoWidth) centerX = videoWidth - halfBoxW;
  if (centerY - halfBoxH < 0) centerY = halfBoxH;
  if (centerY + halfBoxH > videoHeight) centerY = videoHeight - halfBoxH;

  const boxX = centerX - halfBoxW;
  const boxY = centerY - halfBoxH;

  // 5. Draw Background Box
  if (style.backgroundOpacity > 0) {
    ctx.save();
    ctx.fillStyle = style.backgroundColor;
    ctx.globalAlpha = style.backgroundOpacity;
    
    if (radiusPx > 0) {
      roundRect(ctx, boxX, boxY, boxWidth, boxHeight, radiusPx);
      ctx.fill();
    } else {
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    }
    ctx.restore();
  }

  // 6. Draw Text
  const startY = centerY - (blockHeight / 2) + (fontSizePx / 2);

  // Active-word determination
  const hasValidTime = typeof currentTime === 'number';
  const shouldHighlight = Boolean(
    style.activeWordHighlight &&
    hasValidTime &&
    caption.words &&
    caption.words.length > 0
  );
  const rawActiveWordIdx = (shouldHighlight && typeof currentTime === 'number')
    ? getActiveWordIndex(caption.words, currentTime)
    : -1;

  let effectiveActiveWordIdx = rawActiveWordIdx;
  if (rawActiveWordIdx >= 0 && caption.words && caption.words[rawActiveWordIdx]) {
    if (caption.words.length !== words.length) {
      const activeRawWord = caption.words[rawActiveWordIdx].word.trim().replace(/[.,?!।]/g, '');
      const foundIdx = words.findIndex((w, idx) => {
        const cleanW = w.trim().replace(/[.,?!।]/g, '');
        return cleanW === activeRawWord && Math.abs(idx - rawActiveWordIdx) <= 2;
      });
      if (foundIdx !== -1) {
        effectiveActiveWordIdx = foundIdx;
      } else if (rawActiveWordIdx < words.length) {
        effectiveActiveWordIdx = rawActiveWordIdx;
      } else {
        effectiveActiveWordIdx = -1;
      }
    }
  }

  const isNeon = style.shadowBlur > 0 && style.shadowOffsetX === 0 && style.shadowOffsetY === 0 && style.outlineWidth < 0.01;

  for (let i = 0; i < lines.length; i++) {
    const lineObj = lines[i];
    const line = lineObj.text;
    const drawY = startY + (i * lineSpacingPx);

    let drawX = centerX;
    if (style.textAlign === 'left') {
      drawX = boxX + paddingPx;
    } else if (style.textAlign === 'right') {
      drawX = boxX + boxWidth - paddingPx;
    }

    const hasActiveWord = shouldHighlight && effectiveActiveWordIdx !== -1 && lineObj.wordIndices.includes(effectiveActiveWordIdx);

    if (!hasActiveWord) {
      // Existing rendering path: identical to original
      // Outline
      if (strokeWidthPx > 0) {
        ctx.strokeStyle = style.outlineColor;
        ctx.lineWidth = strokeWidthPx;
        ctx.lineJoin = 'round';
        ctx.strokeText(line, drawX, drawY);
      }

      // Shadow / Glow
      if (blurPx > 0 || offsetX !== 0 || offsetY !== 0) {
        ctx.save();
        ctx.shadowColor = style.shadowColor;
        ctx.shadowBlur = blurPx;
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;
        
        if (isNeon) {
          ctx.fillStyle = style.textColor;
          ctx.fillText(line, drawX, drawY);
          ctx.fillText(line, drawX, drawY);
        } else {
          ctx.fillStyle = style.textColor;
          ctx.fillText(line, drawX, drawY);
        }
        ctx.restore();
      }

      // Main Fill
      if (!isNeon) {
        ctx.fillStyle = style.textColor;
        ctx.fillText(line, drawX, drawY);
      }
    } else {
      // Active-word highlighting path: render word tokens on this line with active styling
      const lineWidth = ctx.measureText(line).width;
      let lineStartX = centerX - (lineWidth / 2);
      if (style.textAlign === 'left') {
        lineStartX = boxX + paddingPx;
      } else if (style.textAlign === 'right') {
        lineStartX = boxX + boxWidth - paddingPx - lineWidth;
      }

      const prevAlign = ctx.textAlign;
      ctx.textAlign = 'left';

      // Measure word positions using line prefixes to guarantee sub-pixel positioning matches the intact line
      const lineWords: { text: string; idx: number; x: number; width: number }[] = [];
      let currentPrefix = '';
      for (let j = 0; j < lineObj.wordIndices.length; j++) {
        const wIdx = lineObj.wordIndices[j];
        const word = words[wIdx];
        const prefixWidth = j === 0 ? 0 : ctx.measureText(currentPrefix).width;
        const wordWidth = ctx.measureText(word).width;
        lineWords.push({
          text: word,
          idx: wIdx,
          x: lineStartX + prefixWidth,
          width: wordWidth
        });
        currentPrefix += word + ' ';
      }

      // 1. Draw active word background box if activeWordBackgroundColor is set
      if (style.activeWordBackgroundColor) {
        for (const item of lineWords) {
          if (item.idx === effectiveActiveWordIdx) {
            ctx.save();
            ctx.fillStyle = style.activeWordBackgroundColor;
            const padX = fontSizePx * 0.12;
            const padY = fontSizePx * 0.08;
            roundRect(
              ctx,
              item.x - padX,
              drawY - (fontSizePx / 2) - padY,
              item.width + (padX * 2),
              fontSizePx + (padY * 2),
              radiusPx > 0 ? radiusPx * 0.75 : fontSizePx * 0.12
            );
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 2. Draw outlines for all words on the line
      if (strokeWidthPx > 0) {
        ctx.strokeStyle = style.outlineColor;
        ctx.lineWidth = strokeWidthPx;
        ctx.lineJoin = 'round';
        for (const item of lineWords) {
          ctx.strokeText(item.text, item.x, drawY);
        }
      }

      // 3. Draw shadow/glow pass
      if (blurPx > 0 || offsetX !== 0 || offsetY !== 0) {
        ctx.save();
        ctx.shadowColor = style.shadowColor;
        ctx.shadowBlur = blurPx;
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;

        for (const item of lineWords) {
          const wordColor = (item.idx === effectiveActiveWordIdx)
            ? (style.activeWordColor || '#FFDE59')
            : style.textColor;
          ctx.fillStyle = wordColor;
          ctx.fillText(item.text, item.x, drawY);
          if (isNeon) {
            ctx.fillText(item.text, item.x, drawY);
          }
        }
        ctx.restore();
      }

      // 4. Main Fill (if not neon)
      if (!isNeon) {
        for (const item of lineWords) {
          const wordColor = (item.idx === effectiveActiveWordIdx)
            ? (style.activeWordColor || '#FFDE59')
            : style.textColor;
          ctx.fillStyle = wordColor;
          ctx.fillText(item.text, item.x, drawY);
        }
      }

      ctx.textAlign = prevAlign;
    }
  }
}
