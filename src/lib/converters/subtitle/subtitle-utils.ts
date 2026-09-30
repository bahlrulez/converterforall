import { SubtitleFile, SubtitleValidation, ValidationIssue } from './types';

export function shiftTimestamps(file: SubtitleFile, offsetMs: number): SubtitleFile {
  if (offsetMs === 0) return file;

  const shiftedCues = file.cues.map(cue => {
    const startMs = Math.max(0, cue.startMs + offsetMs);
    // Try to preserve duration if start gets clamped to 0
    const originalDuration = cue.endMs - cue.startMs;
    const endMs = cue.startMs + offsetMs < 0 ? startMs + originalDuration : Math.max(0, cue.endMs + offsetMs);

    return {
      ...cue,
      startMs,
      endMs
    };
  });

  return {
    ...file,
    cues: shiftedCues
  };
}

export function cleanupSubtitle(file: SubtitleFile, removeEmpty: boolean, stripHtml: boolean, stripAssTags: boolean): SubtitleFile {
  let cues = file.cues;

  if (removeEmpty) {
    cues = cues.filter(cue => cue.text.trim().length > 0 && cue.endMs > cue.startMs);
  }

  // Renumbering is always applied for consistency in our internal model
  cues = cues.map((cue, index) => {
    let text = cue.text;

    if (stripHtml) {
      text = text.replace(/<[^>]*>/g, '');
    }

    if (stripAssTags) {
      text = text.replace(/\{\\[^}]*\}/g, '');
    }

    return {
      ...cue,
      id: String(index + 1),
      text: text.trim()
    };
  });

  return {
    ...file,
    cues
  };
}

export function validateSubtitle(file: SubtitleFile): SubtitleValidation {
  const issues: ValidationIssue[] = [];

  for (let i = 0; i < file.cues.length; i++) {
    const cue = file.cues[i];

    if (cue.endMs <= cue.startMs) {
      issues.push({
        type: 'negative_duration',
        cueIndex: i,
        message: `Cue ${cue.id || i + 1} has zero or negative duration.`
      });
    }

    if (cue.text.trim() === '') {
      issues.push({
        type: 'empty',
        cueIndex: i,
        message: `Cue ${cue.id || i + 1} has no text.`
      });
    }

    // Check overlap with next cue
    if (i < file.cues.length - 1) {
      const nextCue = file.cues[i + 1];
      if (cue.endMs > nextCue.startMs) {
        issues.push({
          type: 'overlap',
          cueIndex: i,
          message: `Cue ${cue.id || i + 1} overlaps with cue ${nextCue.id || i + 2}.`
        });
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    cuesCount: file.cues.length
  };
}
