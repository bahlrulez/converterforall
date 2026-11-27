export const audioToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "trim-audio": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Audio Trimmer & Cutter (MP3, WAV, OGG)",
        content: `<p>Trim and cut audio clips directly inside your web browser using Web Audio waveform playback and browser-based MP3 encoding. You can upload <strong>MP3, WAV, OGG, M4A, or AAC</strong> recordings, drag visual start and end markers on the waveform, preview just the selected section, and export the trimmed clip as an MP3 file without installing desktop software or uploading your audio to a conversion server.</p>`
      },
      {
        title: "Browser-based decoding and processing",
        content: "<p>Many online audio cutters send voice notes, music tracks, or meeting recordings to remote servers for processing. This tool reads and decodes your selected audio inside your browser via the Web Audio API, draws the interactive waveform with WaveSurfer, slices the chosen PCM sample range in memory, and encodes the exported MP3 directly on your device. Normal website assets and analytics may still load.</p>"
      },
      {
        title: "How to Trim Audio Online",
        content: "<ol><li><strong>Select your file:</strong> Drag and drop an MP3, WAV, OGG, M4A, or AAC file into the upload zone or pick one from your device.</li><li><strong>Adjust region markers:</strong> Drag the blue region handles across the rendered waveform to isolate the portion you want to keep.</li><li><strong>Preview selection:</strong> Click <em>Play Selection</em> to audition only the highlighted segment before encoding.</li><li><strong>Export MP3:</strong> Click <em>Export Selected to MP3</em> to decode the clip and download your trimmed <code>.mp3</code> file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does trimming audio preserve lossless WAV or original bitrates?</strong><br>A: No. The browser decodes the uploaded file to 44.1 kHz PCM audio and re-encodes the trimmed selection into a 192 kbps MP3 file using LAME encoding. Lossless inputs (such as WAV) or higher-bitrate MP3/OGG sources are always converted to lossy 192 kbps MP3 rather than copied bit-for-bit losslessly.</p>
          <p><strong>Q: Are my voice notes or recordings sent to a conversion server?</strong><br>A: No. Waveform rendering, PCM slicing, and MP3 encoding run in your browser memory without uploading the audio file to a backend conversion server.</p>
          <p><strong>Q: Can I trim WhatsApp OGG/M4A voice notes on mobile?</strong><br>A: Yes, as long as your mobile browser can decode the input codec. Because exported clips always save as standard 192 kbps MP3 files, trimming a WhatsApp voice note is also an easy way to share it on car stereos or editors that do not support OGG Opus.</p>
        `
      }
    ]
  },
  "trim-mp3-online": getAudioTrimmerContent("Free MP3 Cutter & Trimmer Online", "Cut and trim MP3, WAV, OGG, M4A, and AAC clips inside your web browser."),
  "convert-whatsapp-voice-note-to-mp3": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Trim & Convert WhatsApp Voice Notes to MP3",
        content: "<p>WhatsApp exports voice notes as <code>.ogg</code> or <code>.opus</code> audio files, which older car stereos, video editors, and hardware players frequently fail to open. Loading your voice note here lets you trim dead pauses on the interactive waveform and export a clean 192 kbps <code>.mp3</code> clip inside your browser.</p>"
      },
      {
        title: "Step-by-step voice note trimming guide",
        content: "<ol><li><strong>Load your voice note:</strong> Drop your <code>.ogg</code>, <code>.opus</code>, <code>.m4a</code>, or <code>.aac</code> recording into the editor above.</li><li><strong>Set start and end markers:</strong> Drag the highlighted waveform region handles around the speech you want to keep and click <em>Play Selection</em> to check it.</li><li><strong>Export MP3:</strong> Click <em>Export Selected to MP3</em> so the browser decodes to 44.1 kHz PCM and encodes a standard 192 kbps MP3 clip via LAME.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does it work with OGG and OPUS WhatsApp voice notes?</strong><br>A: Yes, provided your web browser can decode the input codec; the trimmer decodes the audio to PCM and outputs a standard 192 kbps MP3 file.</p>
          <p><strong>Q: Are my personal voice notes uploaded to a server?</strong><br>A: No. Waveform decoding and MP3 encoding run in your browser memory without uploading voice notes to a conversion server.</p>
        `
      }
    ]
  },
  "mp3-to-ogg": getAudioConverterContent("Convert MP3 to OGG", "Convert standard MP3 audio files into OGG Vorbis format in your browser.", "mp3", "ogg"),
  "ogg-to-mp3": getAudioConverterContent("Convert OGG to MP3", "Convert OGG or WhatsApp Opus/Vorbis audio into universally playable MP3 format.", "ogg", "mp3"),
  "mp3-to-wav": getAudioConverterContent("Convert MP3 to WAV", "Decode MP3 audio files into uncompressed PCM WAV format for editors.", "mp3", "wav"),
  "wav-to-mp3": getAudioConverterContent("Convert WAV to MP3", "Encode large uncompressed WAV recordings into compact MP3 files.", "wav", "mp3"),
  "mp4-to-mp3": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Extract Audio from Video (.mp4 to .mp3)",
        content: "<p>Extract the audio stream from any MP4 video clip (or MOV/MKV/WebM video) and save it as a standalone <code>.mp3</code> audio track inside your browser using FFmpeg WebAssembly (<code>libmp3lame</code>) with configurable speed presets, bitrate selection (<strong>128k, 192k, or 320k</strong>), and optional start/end timestamp trimming.</p>"
      },
      {
        title: "When Extracting Video Audio Helps",
        content: "<p>Converting recorded keynote speeches, lecture captures, podcast interviews, or music clips into standard <code>.mp3</code> shrinks hundreds of megabytes of video frames down to a portable audio track playable on phones, car stereos, and offline voice players without draining battery on screen decoding.</p>"
      },
      {
        title: "Step-by-step extraction guide",
        content: "<ol><li><strong>Select your MP4 video:</strong> Drag and drop your video file into the Video Converter studio above.</li><li><strong>Pick bitrate &amp; optional trim:</strong> Choose 128k, 192k (default), or 320k MP3 bitrate and optionally set trim start/end times in seconds.</li><li><strong>Convert &amp; save MP3:</strong> Start browser FFmpeg extraction and download the resulting <code>.mp3</code> audio file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my video uploaded to a conversion server?</strong><br>A: No. Audio extraction uses FFmpeg WebAssembly inside browser memory (requiring standard browser COOP/COEP headers) without uploading your video file to a remote conversion queue.</p>
          <p><strong>Q: Can I extract only a clip from a longer video?</strong><br>A: Yes. You can set optional start and end trim times in seconds before extracting to MP3.</p>
          <p><strong>Q: Does converting MP4 audio to MP3 re-encode the sound?</strong><br>A: Yes. Embedded AAC streams are decoded and encoded to MP3 via <code>libmp3lame</code> at your chosen 128k, 192k, or 320k bitrate.</p>
        `
      }
    ]
  }
};

function getAudioConverterContent(title: string, description: string, fromExt: string, toExt: string) {
  const fromUpper = fromExt.toUpperCase();
  const toUpper = toExt.toUpperCase();
  return {
    disableAutoEnrich: true,
    sections: [
      {
        title: title,
        content: `<p>${description} Conversion runs inside your web browser using FFmpeg WebAssembly (<code>@ffmpeg/ffmpeg</code>, encoding with <code>-q:a 0</code>) rather than uploading your <code>.${fromExt}</code> recordings to a remote server queue. Works across desktop and modern mobile browsers with zero watermarks or sign-up gates.</p>`
      },
      {
        title: `How to Convert ${fromUpper} to ${toUpper}`,
        content: `<ol><li><strong>Load your .${fromExt} file:</strong> Drag and drop a <code>.${fromExt}</code> audio recording into the uploader above or choose one from your device.</li><li><strong>Run FFmpeg WebAssembly:</strong> Wait for the browser worker (with COOP/COEP <code>SharedArrayBuffer</code> security headers enabled) to decode <code>.${fromExt}</code> and encode <code>.${toExt}</code> in browser RAM.</li><li><strong>Save .${toExt}:</strong> Click download to save your converted audio file straight to storage.</li></ol>`
      },
      {
        title: "Codec, File Size & Quality Notes",
        content: `<p>Understanding format tradeoffs saves storage and preserves clarity: converting compressed audio (such as MP3 or OGG) into uncompressed PCM WAV builds a valid editing file without restoring lost high frequencies from the prior compression pass, whereas encoding WAV into <code>.${toExt}</code> reduces megabytes substantially for messaging, podcasts, and web players.</p>`
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does ${fromUpper} to ${toUpper} improve lost audio detail?</strong><br>A: Re-encoding cannot restore audio frequencies already discarded by earlier lossy compression, though encoding with FFmpeg <code>-q:a 0</code> targets high output fidelity for the target format.</p>
          <p><strong>Q: Why might mobile Safari or embedded browsers pause FFmpeg conversion?</strong><br>A: FFmpeg WebAssembly relies on <code>SharedArrayBuffer</code> enabled via page security headers; if missing after client navigation, refreshing the page restores multi-threaded execution.</p>
          <p><strong>Q: Are my audio files uploaded to a conversion API?</strong><br>A: No. Audio conversion runs in browser memory without sending recordings to a backend conversion server.</p>
        `
      }
    ]
  };
}

function getAudioTrimmerContent(title: string, description: string) {
  return {
    disableAutoEnrich: true,
    sections: [
      {
        title: title,
        content: `<p>${description} WaveSurfer waveform playback, region markers, and 192 kbps LAME MP3 export run directly inside browser memory without uploading files to a conversion server.</p>`
      },
      {
        title: "How Audio Trimming & Bitrates Work",
        content: "<p>Selected clips are decoded via Web Audio at 44.1 kHz PCM and re-encoded into 192 kbps MP3 via <code>@breezystack/lamejs</code>, meaning WAV or higher-bitrate files are saved as compact lossy 192 kbps MP3 rather than uncompressed WAV.</p>"
      },
      {
        title: "How to Trim Audio Online",
        content: "<ol><li><strong>Upload file:</strong> Drag and drop your MP3, WAV, OGG, M4A, or AAC recording.</li><li><strong>Adjust markers:</strong> Drag the waveform region handles around the segment you want to keep.</li><li><strong>Preview &amp; export:</strong> Click <em>Play Selection</em> to audition it, then click <em>Export Selected to MP3</em> to download the trimmed <code>.mp3</code> clip.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does the trimmed output preserve lossless WAV?</strong><br>A: No. All trimmed exports decode to 44.1 kHz PCM and encode to standard 192 kbps MP3 via LAME.</p>
          <p><strong>Q: Can I trim WhatsApp OGG voice notes?</strong><br>A: Yes, when your browser decodes the OGG/Opus input codec; exporting outputs a universally playable MP3.</p>
          <p><strong>Q: Are my recordings sent to a server?</strong><br>A: No. Decoding, slicing, and MP3 encoding run in browser memory without uploading the audio file to a backend server.</p>
        `
      }
    ]
  };
}
