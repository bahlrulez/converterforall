# Caption Studio E2E Reliability Audit

This suite exercises the actual `public/workers/caption-export.worker.js` entry point in Chromium. It does not substitute a mock encoder or a second implementation of the export pipeline.

## Run locally

Prerequisites:
- Node.js and the repository dependencies installed.
- Chromium installed for the repository's Playwright version.
- The repository's checked-in `sample.mp4` fixture.

Install the browser once:

```bash
npx playwright install chromium
```

Run the audit:

```bash
npm run test:e2e:caption-studio
```

The dedicated Playwright configuration starts `npm run dev` on `127.0.0.1:3000`. The dev command builds the Caption Studio export worker before Next.js starts. Temporary MOV, WebM, and video-only fixtures are generated under the operating system's temp directory using the existing `ffmpeg-static` dependency and removed after the suite.

## Coverage

1. Caption Studio route, title, upload input formats, and 60-second UI constraint.
2. Actual export worker with the checked-in MP4/AAC fixture:
   - MP4 output container and H.264 video track.
   - AAC-LC profile and direct-copy sample-rate preservation.
   - Valid video/audio packet timing and non-empty packet streams.
   - Warning when the source includes additional audio tracks that the export intentionally omits.
3. Actual export worker with MOV + 16 kHz PCM:
   - PCM is transcoded to AAC-LC at 48 kHz.
   - Output retains video and audio with valid packet timing.
4. Actual export worker with WebM + Opus:
   - Opus is transcoded to AAC-LC at 48 kHz.
   - Output retains video and audio with valid packet timing.
5. Actual export worker with an MP4 that has no audio track:
   - Output is a valid video-only MP4; no synthetic audio is introduced.
6. For every export fixture:
   - The result is a playable MP4 with valid dimensions and duration.
   - HTML5 metadata loading and seeking succeed.
   - A test caption's opaque green background is detected in the output frame, checking that captions are burned into rendered video frames.

## What this does not claim

- It does not run or benchmark Whisper/ASR transcription, model downloads, or speech-recognition quality. Captions are supplied directly to the export worker to isolate export reliability.
- It tests the Chromium installation used by Playwright on the machine running the command. It does not certify Safari, iOS, Firefox, hardware-specific codec support, or every physical media player.
- It does not replace manual tests with actual camera recordings, variable-frame-rate phone footage, unusual AAC profiles, multi-language captions, or long videos near the 60-second limit.

## Current execution status

The suite and runner are committed on an isolated feature branch. They have not yet been executed in the repository's Windows development environment. Run the command above and review the test report before merging this audit branch.