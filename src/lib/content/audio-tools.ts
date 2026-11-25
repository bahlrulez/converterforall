export const audioToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "trim-audio": {
    sections: [
      {
        title: "Audio Trimmer & Cutter (MP3, WAV, OGG)",
        content: `<p>Trim an audio recording by selecting the start and end points on its waveform. The browser decodes the chosen audio with Web Audio APIs and re-encodes the selected segment as an MP3 file. This component does not send the selected audio to an audio-trimming API.</p>`
      },
      {
        title: "Browser Processing and Output Details",
        content: "<p>This component decodes the selected file in the browser, displays its waveform and encodes the selected segment with the bundled MP3 encoder. It does not send the selected audio to an audio-trimming API. This describes the trimming component, not every request made by the website or browser.</p>"
      },
      {
        title: "How to Trim Audio Online",
        content: "<ol><li><strong>Upload File:</strong> Drag and drop your audio file (MP3, WAV, OGG, M4A).</li><li><strong>Adjust Markers:</strong> Use the visual waveform to drag the start and end markers to your desired points.</li><li><strong>Preview:</strong> Click the Play button to listen to your selected section.</li><li><strong>Export:</strong> Click Export to instantly encode and download your new MP3 file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">Does trimming my audio file reduce the quality?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">No. The selected segment is re-encoded as MP3 at a fixed 192 kbps. It is not a byte-for-byte cut of the source, so quality can differ, particularly when the input is lossless or has a higher bitrate.</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">Is it safe to cut private audio recordings online?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">The trimming component decodes and re-encodes the selected audio in the browser and does not send it to an audio-trimming API. This does not guarantee that no other website assets or browser services make network requests.</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">Can I trim audio files on my mobile phone?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">Absolutely. Our audio cutter is fully responsive and designed to work seamlessly on iOS and Android devices. You can drag the handles using your touchscreen to trim WhatsApp voice notes or songs on the go.</p>
              </div>
            </div>
          </div>
        `
      }
    ]
  },
  "trim-mp3-online": getAudioTrimmerContent("Free MP3 Cutter & Trimmer Online", "Cut and trim MP3 files online instantly. No file size limits, no watermarks, completely private."),
  "convert-whatsapp-voice-note-to-mp3": {
    sections: [
      {
        title: "Why cut WhatsApp voice notes?",
        content: "<p>WhatsApp voice notes often have long pauses at the beginning or end. Trimming them makes them perfect for sharing as clean audio clips, using in podcasts, or adding to video projects.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">Does it work with OGG and OPUS files?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">Yes! WhatsApp commonly uses OGG and OPUS formats for voice notes. Our tool can read these files directly from your phone and convert the trimmed portion straight into a standard MP3 format.</p>
              </div>
            </div>
          </div>
        `
      }
    ]
  },
  "mp3-to-ogg": getAudioConverterContent("Convert MP3 to OGG", "Convert standard MP3 audio files to the highly efficient OGG Vorbis format.", "mp3", "ogg"),
  "ogg-to-mp3": getAudioConverterContent("Convert OGG to MP3", "Convert OGG Vorbis audio files to universally compatible MP3 format.", "ogg", "mp3"),
  "mp3-to-wav": getAudioConverterContent("Convert MP3 to WAV", "Convert compressed MP3 audio into uncompressed, lossless WAV format for editing.", "mp3", "wav"),
  "wav-to-mp3": getAudioConverterContent("Convert WAV to MP3", "Compress large, lossless WAV audio files into small, easily shareable MP3 format.", "wav", "mp3"),
  "mp4-to-mp3": {
    sections: [
      {
        title: "Extract Audio from Video (MP4 to MP3)",
        content: "<p>Instantly extract the audio track from any MP4 video and save it as a high-quality MP3 file. Because the extraction happens directly in your browser using local processing, you don't have to upload massive video files to a server, saving you time and bandwidth.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">Is my video uploaded to a server?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">The video is processed with FFmpeg.wasm in the browser. The FFmpeg runtime assets are downloaded from unpkg; this component does not send the selected video to an MP3 conversion API.</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">Does converting MP4 to MP3 reduce the audio quality?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">The audio stream is decoded and encoded as MP3 using the FFmpeg settings for this conversion path. Output bitrate and quality are not guaranteed to match the source stream; review the exported audio.</p>
              </div>
            </div>
          </div>
        `
      }
    ]
  }
};

function getAudioConverterContent(title: string, description: string, fromExt: string, toExt: string) {
  return {
    sections: [
      {
        title: title,
        content: `<p>${description} This converter uses FFmpeg.wasm in your browser. The FFmpeg core JavaScript and WebAssembly runtime are downloaded from unpkg; the selected audio file is written to the browser's FFmpeg virtual filesystem for conversion and is not sent to an audio-conversion API.</p>`
      },
      {
        title: "Browser Processing and Output Details",
        content: `<p>Audio decoding and encoding run in FFmpeg.wasm in the browser. The FFmpeg core JavaScript and WebAssembly files are loaded from unpkg. The selected audio is processed in the browser; this component does not send it to an audio-conversion API.</p>`
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is there a file size limit?</strong><br>A: The component does not define a universal file-size guarantee. Large files can be limited by browser memory, audio decoding support and device performance.</p>
          <p><strong>Q: Does it cost money?</strong><br>A: No payment is requested by this converter page. Practical use is still subject to browser and device resource limits.</p>
          <p><strong>Q: Are my recordings secure?</strong><br>A: FFmpeg.wasm processes the selected audio in the browser. Its runtime assets are downloaded from unpkg; this converter does not send the audio file to a conversion API.</p>
        `
      }
    ]
  };
}

function getAudioTrimmerContent(title: string, description: string) {
  return {
    sections: [
      {
        title: title,
        content: `<p>${description} Our tool uses advanced WebAudio technology to give you a professional, visual audio editor directly inside your web browser. There is no software to install and no need to wait for your files to upload to a cloud server.</p>`
      },
      {
        title: "Browser Processing and Output Details",
        content: "<p>This component decodes the selected file in the browser, displays its waveform and encodes the selected segment with the bundled MP3 encoder. It does not send the selected audio to an audio-trimming API. This describes the trimming component, not every request made by the website or browser.</p>"
      },
      {
        title: "How to Trim Audio Online",
        content: "<ol><li><strong>Upload File:</strong> Drag and drop your audio file (MP3, WAV, OGG, M4A).</li><li><strong>Adjust Markers:</strong> Use the visual waveform to drag the start and end markers to your desired points.</li><li><strong>Preview:</strong> Click the Play button to listen to your selected section.</li><li><strong>Export:</strong> Click Export to instantly encode and download your new MP3 file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is there a file size limit?</strong><br>A: The component does not define a universal file-size guarantee. Large files can be limited by browser memory, decoding support and device performance.</p>
          <p><strong>Q: Does it cost money?</strong><br>A: The trimmer does not add a watermark to its MP3 output. Browser and device resource limits can still affect processing.</p>
          <p><strong>Q: Can I convert WhatsApp Voice Notes (OGG) to MP3?</strong><br>A: Yes! Simply drop your WhatsApp .ogg voice note into the tool, trim the silence if you want, and click export to download a universally compatible MP3 file.</p>
          <p><strong>Q: Are my corporate or personal recordings secure?</strong><br>A: This trimming component processes the selected audio in the browser and does not send it to a trimming API.</p>
        `
      }
    ]
  };
}
