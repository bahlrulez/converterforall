export const audioToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "trim-audio": {
    sections: [
      {
        title: "Audio Trimmer & Cutter (MP3, WAV, OGG)",
        content: `<p>Trim, cut, and split audio files directly in your browser. 100% private, no uploads. Our tool uses advanced WebAudio technology to give you a professional, visual audio editor directly inside your web browser. There is no software to install and no need to wait for your files to upload to a cloud server.</p>`
      },
      {
        title: "100% Client-Side Privacy",
        content: "<p>Most online audio cutters require you to upload your sensitive voice notes, music, or corporate recordings to a remote server for processing. This raises significant privacy concerns. Our Audio Trimmer is entirely <strong>client-side</strong>. The audio decoding, waveform visualization, and MP3 exporting all happen exclusively within your device's memory. Your files are <em>never</em> uploaded.</p>"
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
                <p itemprop="text">No! Our tool preserves the original bitrate (up to 192kbps) during the extraction process, ensuring your trimmed audio sounds exactly as crisp as the original file.</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">Is it safe to cut private audio recordings online?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">Yes, because ConverterForAll processes your files <strong>100% locally in your web browser</strong>. Unlike other tools, your audio is never uploaded to a remote server, guaranteeing absolute privacy for sensitive voice notes or personal recordings.</p>
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
  "cut-audio-free": getAudioTrimmerContent("Cut Audio Files Free Online", "Easily slice and cut audio clips, songs, and recordings for free directly on your device."),
  "private-audio-trimmer": getAudioTrimmerContent("Private Audio Trimmer (No Server Uploads)", "A highly secure, 100% client-side audio cutter. Your voice notes and recordings never leave your device."),
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
  }
};

function getAudioTrimmerContent(title: string, description: string) {
  return {
    sections: [
      {
        title: title,
        content: `<p>${description} Our tool uses advanced WebAudio technology to give you a professional, visual audio editor directly inside your web browser. There is no software to install and no need to wait for your files to upload to a cloud server.</p>`
      },
      {
        title: "100% Client-Side Privacy",
        content: "<p>Most online audio cutters require you to upload your sensitive voice notes, music, or corporate recordings to a remote server for processing. This raises significant privacy concerns. Our Audio Trimmer is entirely <strong>client-side</strong>. The audio decoding, waveform visualization, and MP3 exporting all happen exclusively within your device's memory. Your files are <em>never</em> uploaded.</p>"
      },
      {
        title: "How to Trim Audio Online",
        content: "<ol><li><strong>Upload File:</strong> Drag and drop your audio file (MP3, WAV, OGG, M4A).</li><li><strong>Adjust Markers:</strong> Use the visual waveform to drag the start and end markers to your desired points.</li><li><strong>Preview:</strong> Click the Play button to listen to your selected section.</li><li><strong>Export:</strong> Click Export to instantly encode and download your new MP3 file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is there a file size limit?</strong><br>A: Because processing happens locally on your device, there are no strict 10MB or 50MB server limits like other tools. The only limit is your device's available RAM.</p>
          <p><strong>Q: Does it cost money?</strong><br>A: No. It is 100% free with unlimited conversions and absolutely zero watermarks.</p>
          <p><strong>Q: Can I convert WhatsApp Voice Notes (OGG) to MP3?</strong><br>A: Yes! Simply drop your WhatsApp .ogg voice note into the tool, trim the silence if you want, and click export to download a universally compatible MP3 file.</p>
          <p><strong>Q: Are my corporate or personal recordings secure?</strong><br>A: Completely. The tool never connects to a backend server to upload your file. It is a highly secure, private audio trimmer.</p>
        `
      }
    ]
  };
}
