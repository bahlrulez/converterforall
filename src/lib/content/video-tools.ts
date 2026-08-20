export const videoToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "mp4-to-mp3": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The MP4 to MP3 converter extracts the audio track from your video files directly in your web browser. If you have a video podcast, lecture, interview, or music recording where you only need the audio, this tool converts the video into a standard MP3 file that you can listen to on any phone or music player.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool uses in-browser processing to separate the audio track from your MP4 file and encode it as an MP3 directly on your computer or smartphone. Because the extraction happens locally on your machine, your video files are not uploaded to external servers.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have a 300MB video recording of a lecture or keynote speech, converting it to an MP3 produces a compact 30MB audio file that you can easily listen to on your commute without draining battery on video playback.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Video:</strong> Drag and drop your MP4 file into the box or browse your device.</li><li><strong>Processing:</strong> The tool extracts the audio track locally.</li><li><strong>Download:</strong> Click download to save your MP3 audio file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Podcasts &amp; Interviews:</strong> Turning video calls and recordings into audio episodes.</li><li><strong>Study Material:</strong> Converting video lectures into audio for listening on the go.</li><li><strong>Saving Storage:</strong> Keeping the audio of speeches without storing heavy video files.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Is my video uploaded to your servers?</strong><br>A: No. The conversion happens locally in your web browser on your own device.</p><p><strong>Q: Will audio quality remain clear?</strong><br>A: Yes. The converter extracts the original audio stream into a standard high-quality MP3 file.</p><p><strong>Q: Does this tool work on mobile devices?</strong><br>A: Yes, as long as you are using a modern mobile browser like Safari or Chrome.</p>"
      }
    ]
  },
  "mov-to-mp4": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The MOV to MP4 converter turns Apple QuickTime video files (.mov) into universally supported MP4 videos. While iPhones, iPads, and Mac computers record in MOV format by default, some Windows PCs, Android phones, smart TVs, and websites struggle to play MOV files. Converting them to MP4 ensures your videos play everywhere.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Our tool re-wraps the video into the standard MP4 container directly in your web browser. Because the processing occurs on your device, your personal videos stay on your computer or phone.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you recorded a video on your iPhone and want to send it to someone using a Windows PC or upload it to a site that only accepts MP4 files, running it through this converter gives you a standard MP4 file in seconds.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your MOV:</strong> Drag and drop your MOV file into the box.</li><li><strong>Conversion:</strong> The browser converts the video to MP4 locally.</li><li><strong>Download:</strong> Click download to save your MP4 video.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Cross-Platform Sharing:</strong> Making iPhone videos playable on Windows PCs and Android phones.</li><li><strong>Website Uploads:</strong> Preparing videos for sites that only accept standard MP4 formats.</li><li><strong>Smart TV Playback:</strong> Converting videos for playback from USB drives on smart TVs.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Will converting from MOV to MP4 reduce video quality?</strong><br>A: Generally, no. The tool re-wraps the video streams into the standard MP4 container while preserving original visual quality.</p><p><strong>Q: Are my home videos uploaded to the internet?</strong><br>A: No. The conversion happens in your browser's local memory on your own device.</p><p><strong>Q: Does this converter add watermarks?</strong><br>A: No. All conversions are free with no watermarks.</p>"
      }
    ]
  },
  "compress-video": {
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Video Compressor reduces video file sizes so they are easier to email, share on messaging apps, and upload to websites. It optimizes video bitrate and frame data to make heavy videos significantly lighter while keeping them clear and easy to watch.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The compression runs directly inside your web browser. Your computer or phone processes the video locally without needing to upload gigabyte-sized files to a cloud server, keeping your personal recordings private.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you recorded a 400MB video on your phone and need to email it (where the attachment cap is 25MB), running it through our compressor can reduce the file size to under 20MB so it attaches cleanly to your email.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Video:</strong> Drag and drop your video file into the box.</li><li><strong>Local Compression:</strong> The browser compresses the video on your device.</li><li><strong>Download:</strong> Save your newly compressed video.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Email Attachments:</strong> Shrinking videos to fit within email attachment limits (like Gmail's 25MB limit).</li><li><strong>Messaging Apps:</strong> Compressing clips to send on WhatsApp, Discord, or iMessage.</li><li><strong>Saving Storage:</strong> Freeing up storage space by compressing raw video clips.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Are my videos uploaded to external servers?</strong><br>A: No. The compression runs locally in your web browser.</p><p><strong>Q: Does this compressor add a watermark?</strong><br>A: No. The tool is free and produces clean, unwatermarked videos.</p>"
      }
    ]
  },
  "video-to-jpg": {
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Video to JPG Sequence extractor captures still image frames from your video files and saves them as standard JPEG images. It is helpful for capturing video thumbnails, studying movement frame-by-frame, or pulling photos from a video clip.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool reads your video in your browser, captures snapshots at your chosen frame rate (e.g. 1 frame per second), and packages the extracted JPEG images into a downloadable ZIP folder directly on your device.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have a 10-second video of an event and want to find the best still shot, setting the extractor to 2 FPS gives you 20 clear JPEG photos in a single ZIP folder to choose from.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Video:</strong> Drag and drop your video into the box.</li><li><strong>Choose Frame Rate:</strong> Select how many frames per second (FPS) you want.</li><li><strong>Download ZIP:</strong> Click download to save your ZIP archive containing all extracted JPEG frames.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Thumbnails:</strong> Finding the best frame to use as a cover image for YouTube or social media.</li><li><strong>Action Shots:</strong> Pulling high-resolution still photos from sports or family video clips.</li><li><strong>Storyboarding:</strong> Creating visual storyboards from existing video sequences.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Are my extracted photos uploaded anywhere?</strong><br>A: No. Frame extraction runs locally in your web browser.</p><p><strong>Q: Why does it download a ZIP file?</strong><br>A: Extracting frames can generate dozens of images. Bundling them into a single ZIP file allows you to download them all in one click.</p>"
      }
    ]
  },
  "compress-video-for-discord": {
    sections: [
      {
        title: "How to Compress Videos for Discord (<25MB)",
        content: "<p>Discord limits free file uploads to <strong>25MB</strong> (previously 8MB). Uploading game clips, screen recordings, or meme edits that exceed 25MB fails unless you pay for a Discord Nitro subscription. Our Discord Video Compressor automatically targets an output file size under 24.5MB by optimizing the video bitrate while maintaining smooth 60fps and crisp 1080p or 720p resolution.</p>"
      },
      {
        title: "Why Use Client-Side Discord Compression?",
        content: "<p>Most video compression websites require you to upload your gameplay or personal recordings to their cloud servers. Our tool runs directly inside your web browser using WebAssembly and hardware acceleration. Your gaming footage never leaves your PC, compressing in seconds with zero queues or watermarks.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: What is the Discord upload limit in 2026?</strong><br>A: Standard free Discord accounts have a 25MB file upload limit per message. Discord Nitro Basic has a 50MB limit, and Nitro has a 500MB limit.</p><p><strong>Q: Will my game audio stay synced after compressing for Discord?</strong><br>A: Yes! The encoder preserves the original audio timestamp streams with crystal clear 128 kbps AAC stereo sound.</p><p><strong>Q: Does Discord support the compressed MP4 format?</strong><br>A: Yes. MP4 with H.264 video and AAC audio is Discord's native inline playable format on desktop, iOS, and Android.</p>"
      }
    ]
  },
  "compress-video-for-whatsapp": {
    sections: [
      {
        title: "Compress Videos for WhatsApp (<16MB)",
        content: "<p>WhatsApp restricts video sharing to a strict <strong>16MB file limit</strong> on mobile and web. When you send a large video, WhatsApp's built-in compressor often blurs your footage and causes stuttering. By pre-compressing your video using our dedicated WhatsApp compressor, you ensure your video stays sharp, plays instantly, and sends without error.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: What is the maximum video size for WhatsApp status and chats?</strong><br>A: WhatsApp allows up to 16MB for standard media messages and up to 2GB if sent as an uncompressed document.</p><p><strong>Q: Can I compress iPhone 4K videos for WhatsApp?</strong><br>A: Yes! The tool accepts large iPhone MOV and 4K MP4 videos, scales them down to 1080p or 720p, and compresses them under 16MB in seconds.</p>"
      }
    ]
  },
  "compress-video-for-email": {
    sections: [
      {
        title: "Compress Large Videos for Email Attachments",
        content: "<p>Major email providers like Gmail, Outlook, Yahoo Mail, and Apple Mail impose strict attachment limits between <strong>20MB and 25MB</strong>. Our Email Video Compressor applies intelligent CRF compression to fit your videos directly inside standard email attachments without needing Google Drive or Dropbox links.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: What is Gmail's attachment limit?</strong><br>A: Gmail allows up to 25MB of total email attachments per email.</p><p><strong>Q: What is Outlook's attachment limit?</strong><br>A: Microsoft Outlook and Hotmail allow up to 20MB for attachments.</p>"
      }
    ]
  },
  "compress-video-for-instagram": {
    sections: [
      {
        title: "Compress Video for Instagram Reels & Stories without Blur",
        content: "<p>When you upload high-bitrate 4K videos to Instagram Reels or Stories, Instagram's aggressive server compression crushes the video, making it look pixelated and blurry. By pre-compressing your video to Instagram's recommended specs (1080×1920, 30fps/60fps, ~3.5 to 5 Mbps bitrate), you bypass Instagram's heavy compression algorithm and maintain maximum visual sharpness.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: What is the best resolution for Instagram Reels?</strong><br>A: 1080 × 1920 pixels with a 9:16 vertical aspect ratio.</p><p><strong>Q: Why do my 4K videos look blurry when uploaded to Instagram?</strong><br>A: Instagram downscales and recompresses any video exceeding 1080p. Pre-compressing with our tool avoids destructive re-encoding.</p>"
      }
    ]
  },
  "compress-mov-video": {
    sections: [
      {
        title: "Compress Apple QuickTime MOV Videos to MP4",
        content: "<p>Apple iPhones and Mac computers record video in QuickTime MOV format using high bitrates that consume gigabytes of storage. Our MOV Compressor converts and shrinks MOV files into ultra-compact, universally playable MP4 videos with up to 80% space savings.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Why are iPhone MOV files so big?</strong><br>A: iOS cameras capture high-bitrate footage with uncompressed color profiles. Compressing with H.264 reduces the file size significantly with near-zero visible difference.</p><p><strong>Q: Will the compressed file work on Windows and Android?</strong><br>A: Yes! The output is standard MP4 H.264, which plays natively on all devices.</p>"
      }
    ]
  },
  "compress-mp4": {
    sections: [
      {
        title: "Compress MP4 Videos Online – Fast & 100% Private",
        content: "<p>MP4 is the world's most popular video format. Our MP4 Video Compressor lets you dial in the exact compression level you need—from light 20% size reduction to maximum 80% reduction—running entirely on your device's GPU/CPU.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Is there any quality loss when compressing MP4?</strong><br>A: With our Smart Balanced preset (CRF 26), quality loss is virtually imperceptible on phone screens and computer monitors.</p><p><strong>Q: Are my MP4 files safe?</strong><br>A: Yes. All processing occurs locally in your browser with 0 bytes uploaded to external servers.</p>"
      }
    ]
  }
};
