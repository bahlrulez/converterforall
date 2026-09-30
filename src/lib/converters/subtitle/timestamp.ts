export function parseTimestamp(timeString: string): number {
  // Try to match standard H:MM:SS.mmm or HH:MM:SS,mmm or MM:SS.mmm
  const cleanTime = timeString.trim().replace(',', '.');
  
  // Regex to capture groups: (hours):minutes:seconds.fraction
  const match = cleanTime.match(/(?:(\d+):)?(\d{2}):(\d{2})\.(\d+)/);
  if (!match) {
    return 0; // Return 0 or throw? Return 0 for robust parsing, but ideally we'd validate.
  }

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  
  // Fraction could be milliseconds (3 digits) or centiseconds (2 digits for ASS)
  let fraction = match[4];
  if (fraction.length === 2) {
    fraction += '0'; // ASS 00 -> 000
  } else if (fraction.length === 1) {
    fraction += '00';
  } else if (fraction.length > 3) {
    fraction = fraction.substring(0, 3);
  }
  const milliseconds = parseInt(fraction, 10);

  return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + milliseconds;
}

export function formatSrtTimestamp(ms: number): string {
  return formatTimestampInternal(ms, ',', 3, true);
}

export function formatVttTimestamp(ms: number): string {
  return formatTimestampInternal(ms, '.', 3, true);
}

export function formatSbvTimestamp(ms: number): string {
  return formatTimestampInternal(ms, '.', 3, false); // Single digit hours
}

function formatTimestampInternal(
  ms: number,
  separator: string,
  fractionDigits: number,
  padHours2: boolean
): string {
  // Ensure non-negative
  const safeMs = Math.max(0, Math.floor(ms));
  
  const hours = Math.floor(safeMs / 3600000);
  const minutes = Math.floor((safeMs % 3600000) / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  const milliseconds = safeMs % 1000;

  const hStr = padHours2 ? hours.toString().padStart(2, '0') : hours.toString();
  const mStr = minutes.toString().padStart(2, '0');
  const sStr = seconds.toString().padStart(2, '0');
  
  let fracStr = milliseconds.toString().padStart(3, '0');
  if (fractionDigits === 2) {
    fracStr = fracStr.substring(0, 2);
  }

  return `${hStr}:${mStr}:${sStr}${separator}${fracStr}`;
}
