export const audioToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "trim-audio": getAudioTrimmerContent("Audio Trimmer & Cutter (MP3, WAV, OGG)", "Trim, cut, and split audio files directly in your browser. 100% private, no uploads."),
  "trim-mp3-online": getAudioTrimmerContent("Free MP3 Cutter & Trimmer Online", "Cut and trim MP3 files online instantly. No file size limits, no watermarks, completely private."),
  "cut-audio-free": getAudioTrimmerContent("Cut Audio Files Free Online", "Easily slice and cut audio clips, songs, and recordings for free directly on your device."),
  "private-audio-trimmer": getAudioTrimmerContent("Private Audio Trimmer (No Server Uploads)", "A highly secure, 100% client-side audio cutter. Your voice notes and recordings never leave your device."),
  "convert-whatsapp-voice-note-to-mp3": getAudioTrimmerContent("Convert WhatsApp Voice Notes to MP3 & Trim", "Upload your WhatsApp voice notes (.ogg or .opus) to trim dead space and convert them into standard MP3 files.")
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
