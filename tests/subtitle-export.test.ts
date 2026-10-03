import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatSrtTimestamp,
  formatVttTimestamp,
  generateSrt,
  generateVtt,
  getSubtitleFilename
} from '../src/lib/caption-studio/subtitle-export';
import { CaptionChunk } from '../src/lib/caption-studio/types';

test('formatSrtTimestamp: sub-second milliseconds precision', () => {
  assert.equal(formatSrtTimestamp(0), '00:00:00,000');
  assert.equal(formatSrtTimestamp(0.045), '00:00:00,045');
  assert.equal(formatSrtTimestamp(0.5), '00:00:00,500');
  assert.equal(formatSrtTimestamp(0.999), '00:00:00,999');
});

test('formatSrtTimestamp: seconds and rollover to minutes', () => {
  assert.equal(formatSrtTimestamp(12.345), '00:00:12,345');
  assert.equal(formatSrtTimestamp(59.999), '00:00:59,999');
  assert.equal(formatSrtTimestamp(60), '00:01:00,000');
  assert.equal(formatSrtTimestamp(75.12), '00:01:15,120');
});

test('formatSrtTimestamp: hour rollover and large durations', () => {
  assert.equal(formatSrtTimestamp(3599.999), '00:59:59,999');
  assert.equal(formatSrtTimestamp(3600), '01:00:00,000');
  assert.equal(formatSrtTimestamp(3665.4), '01:01:05,400');
  assert.equal(formatSrtTimestamp(7325.008), '02:02:05,008');
});

test('formatSrtTimestamp: handles negative and non-finite timestamps safely', () => {
  assert.equal(formatSrtTimestamp(-5), '00:00:00,000');
  assert.equal(formatSrtTimestamp(NaN), '00:00:00,000');
  assert.equal(formatSrtTimestamp(Infinity), '00:00:00,000');
});

test('formatVttTimestamp: uses period separator for milliseconds', () => {
  assert.equal(formatVttTimestamp(0), '00:00:00.000');
  assert.equal(formatVttTimestamp(1.234), '00:00:01.234');
  assert.equal(formatVttTimestamp(65.789), '00:01:05.789');
  assert.equal(formatVttTimestamp(3661.05), '01:01:01.050');
  assert.equal(formatVttTimestamp(-1), '00:00:00.000');
});

test('generateSrt: correctly structures sequential cues and timecodes', () => {
  const captions: CaptionChunk[] = [
    {
      id: 'c1',
      start: 0.5,
      end: 2.1,
      text: 'First caption segment',
      words: []
    },
    {
      id: 'c2',
      start: 2.3,
      end: 4.8,
      text: 'Second caption segment',
      words: []
    }
  ];

  const srt = generateSrt(captions);
  const expected = 
`1
00:00:00,500 --> 00:00:02,100
First caption segment

2
00:00:02,300 --> 00:00:04,800
Second caption segment
`;

  assert.equal(srt, expected);
});

test('generateSrt & generateVtt: preserves Hindi (Devanagari) script and punctuation', () => {
  const captions: CaptionChunk[] = [
    {
      id: 'c1',
      start: 1.0,
      end: 3.5,
      text: 'नमस्ते दोस्तों! क्या हाल है?',
      words: []
    },
    {
      id: 'c2',
      start: 3.8,
      end: 6.2,
      text: 'थोड़े शांत हो गए।',
      words: []
    }
  ];

  const srt = generateSrt(captions);
  assert.ok(srt.includes('नमस्ते दोस्तों! क्या हाल है?'));
  assert.ok(srt.includes('थोड़े शांत हो गए।'));
  assert.ok(srt.includes('00:00:01,000 --> 00:00:03,500'));

  const vtt = generateVtt(captions);
  assert.ok(vtt.startsWith('WEBVTT\n\n'));
  assert.ok(vtt.includes('नमस्ते दोस्तों! क्या हाल है?'));
  assert.ok(vtt.includes('थोड़े शांत हो गए।'));
  assert.ok(vtt.includes('00:00:01.000 --> 00:00:03.500'));
});

test('generateSrt & generateVtt: supports multiline text preserving line breaks', () => {
  const captions: CaptionChunk[] = [
    {
      id: 'c1',
      start: 0,
      end: 2.5,
      text: 'Line 1 of subtitle\nLine 2 of subtitle',
      words: []
    }
  ];

  const srt = generateSrt(captions);
  assert.ok(srt.includes('Line 1 of subtitle\nLine 2 of subtitle'));

  const vtt = generateVtt(captions);
  assert.ok(vtt.includes('Line 1 of subtitle\nLine 2 of subtitle'));
});

test('generateSrt & generateVtt: filters empty captions and trims whitespace', () => {
  const captions: CaptionChunk[] = [
    { id: 'c1', start: 0, end: 1, text: '   ', words: [] },
    { id: 'c2', start: 1.2, end: 3.0, text: '  Valid Text  ', words: [] },
    { id: 'c3', start: 3.5, end: 5.0, text: '', words: [] }
  ];

  const srt = generateSrt(captions);
  // Should only have 1 cue, numbered 1
  assert.ok(srt.startsWith('1\n00:00:01,200 --> 00:00:03,000\nValid Text\n'));
  assert.ok(!srt.includes('2\n'));

  const vtt = generateVtt(captions);
  assert.ok(vtt.includes('1\n00:00:01.200 --> 00:00:03.000\nValid Text'));
  assert.ok(!vtt.includes('2\n'));
});

test('generateSrt: enforces sequential cue ordering regardless of input ordering', () => {
  const captions: CaptionChunk[] = [
    { id: 'c2', start: 5.0, end: 7.0, text: 'Second in time', words: [] },
    { id: 'c1', start: 1.0, end: 3.0, text: 'First in time', words: [] }
  ];

  const srt = generateSrt(captions);
  const firstIndex = srt.indexOf('First in time');
  const secondIndex = srt.indexOf('Second in time');
  assert.ok(firstIndex < secondIndex, 'Cues must be sorted sequentially in time');
});

test('generateSrt: handles zero or negative duration gracefully (final cue timing)', () => {
  const captions: CaptionChunk[] = [
    { id: 'c1', start: 10.0, end: 10.0, text: 'Zero duration cue', words: [] },
    { id: 'c2', start: 15.0, end: 12.0, text: 'Inverted timing cue', words: [] }
  ];

  const srt = generateSrt(captions);
  // Minimum duration of 100ms enforced
  assert.ok(srt.includes('00:00:10,000 --> 00:00:10,100'));
  assert.ok(srt.includes('00:00:15,000 --> 00:00:15,100'));
});

test('getSubtitleFilename: cleans filename and handles edge cases', () => {
  assert.equal(getSubtitleFilename('my-video.mp4', 'srt'), 'my-video.srt');
  assert.equal(getSubtitleFilename('travel reel 2026.webm', 'vtt'), 'travel_reel_2026.vtt');
  assert.equal(getSubtitleFilename('funny:clip?.mov', 'srt'), 'funny_clip_.srt');
  assert.equal(getSubtitleFilename('', 'srt'), 'captions.srt');
});
