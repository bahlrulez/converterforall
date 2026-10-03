import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveWordIndex } from '../src/lib/caption-studio/active-word';
import { CaptionWord } from '../src/lib/caption-studio/types';

test('getActiveWordIndex: returns correct word index based on currentTime', () => {
  const words: CaptionWord[] = [
    { word: 'Hello', start: 0.0, end: 0.4 },
    { word: 'world', start: 0.4, end: 0.8 },
    { word: 'again', start: 1.0, end: 1.5 }
  ];

  // Inside word 0
  assert.equal(getActiveWordIndex(words, 0.0), 0);
  assert.equal(getActiveWordIndex(words, 0.2), 0);
  assert.equal(getActiveWordIndex(words, 0.399), 0);

  // Boundary check at 0.40: word.start <= currentTime < word.end -> word 1
  assert.equal(getActiveWordIndex(words, 0.4), 1);
  assert.equal(getActiveWordIndex(words, 0.6), 1);
  assert.equal(getActiveWordIndex(words, 0.799), 1);

  // Gap between 0.80 and 1.00 -> -1
  assert.equal(getActiveWordIndex(words, 0.8), -1);
  assert.equal(getActiveWordIndex(words, 0.9), -1);

  // Inside word 2
  assert.equal(getActiveWordIndex(words, 1.0), 2);
  assert.equal(getActiveWordIndex(words, 1.25), 2);
  assert.equal(getActiveWordIndex(words, 1.499), 2);

  // After last word
  assert.equal(getActiveWordIndex(words, 1.5), -1);
  assert.equal(getActiveWordIndex(words, 2.0), -1);
});

test('getActiveWordIndex: boundary conditions before first word and after last word', () => {
  const words: CaptionWord[] = [
    { word: 'थोड़े', start: 1.0, end: 1.8 },
    { word: 'शांत', start: 1.8, end: 2.5 }
  ];

  // Before first word
  assert.equal(getActiveWordIndex(words, 0.0), -1);
  assert.equal(getActiveWordIndex(words, 0.999), -1);

  // Inside first word
  assert.equal(getActiveWordIndex(words, 1.0), 0);
  assert.equal(getActiveWordIndex(words, 1.4), 0);

  // Inside second word
  assert.equal(getActiveWordIndex(words, 1.8), 1);
  assert.equal(getActiveWordIndex(words, 2.499), 1);

  // After last word
  assert.equal(getActiveWordIndex(words, 2.5), -1);
  assert.equal(getActiveWordIndex(words, 3.0), -1);
});

test('getActiveWordIndex: handles empty, null, or undefined array gracefully', () => {
  assert.equal(getActiveWordIndex([], 0.5), -1);
  assert.equal(getActiveWordIndex(null, 0.5), -1);
  assert.equal(getActiveWordIndex(undefined, 0.5), -1);
});

test('getActiveWordIndex: handles invalid or negative currentTime gracefully', () => {
  const words: CaptionWord[] = [
    { word: 'Test', start: 1.0, end: 2.0 }
  ];

  assert.equal(getActiveWordIndex(words, -1), -1);
  assert.equal(getActiveWordIndex(words, NaN), -1);
  assert.equal(getActiveWordIndex(words, Infinity), -1);
  assert.equal(getActiveWordIndex(words, -Infinity), -1);
});

test('getActiveWordIndex: safely skips words with invalid or zero/negative duration', () => {
  const words: CaptionWord[] = [
    { word: 'Invalid1', start: 2.0, end: 1.0 }, // negative duration
    { word: 'Invalid2', start: 3.0, end: 3.0 }, // zero duration
    { word: 'Invalid3', start: NaN, end: 5.0 }, // NaN start
    { word: 'Invalid4', start: 4.0, end: NaN }, // NaN end
    { word: 'Valid', start: 5.0, end: 6.0 }
  ];

  assert.equal(getActiveWordIndex(words, 1.5), -1);
  assert.equal(getActiveWordIndex(words, 3.0), -1);
  assert.equal(getActiveWordIndex(words, 4.5), -1);
  assert.equal(getActiveWordIndex(words, 5.5), 4);
});

test('getActiveWordIndex: does not mutate the input array or objects', () => {
  const originalWords: CaptionWord[] = [
    { word: 'Immutable', start: 0.5, end: 1.5 }
  ];
  const copyBefore = JSON.stringify(originalWords);

  getActiveWordIndex(originalWords, 1.0);
  assert.equal(JSON.stringify(originalWords), copyBefore);
});
