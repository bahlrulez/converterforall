export const videoToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "mp4-to-mp3": {
    disableAutoEnrich: true,
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
    disableAutoEnrich: true,
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
  "video-compressor": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Are My Video Files So Large?",
        content: "<p>Whether you are recording on a smartphone, capturing gameplay on a PC, or saving a screen recording, modern videos are often saved with very high bitrates to capture maximum detail. This results in massive file sizes that are difficult to email, slow to upload to social media, and quickly fill up your hard drive or phone storage. A video compressor reduces the file size by smartly removing redundant visual data while keeping the video clear.</p>"
      },
      {
        title: "How Does Browser-Based Compression Work?",
        content: "<p>Most video compression websites require you to upload your gigabyte-sized files to their cloud servers, which takes a long time and uses up your internet bandwidth. We do things differently. This tool runs directly inside your web browser using your device's own processor. Your videos are compressed locally on your computer or phone, meaning your personal recordings never leave your device.</p>"
      },
      {
        title: "How to Compress a Video File",
        content: "<ol><li><strong>Select your video:</strong> Drag and drop your heavy video file (MP4, MOV, WebM, etc.) directly into the browser window.</li><li><strong>Start compression:</strong> The browser will automatically begin shrinking the video using local hardware acceleration.</li><li><strong>Save your video:</strong> Download the newly compressed, lightweight video directly to your device.</li></ol>"
      },
      {
        title: "Will the Compressed Video Look Blurry?",
        content: "<p>Our compressor uses a smart balanced preset that reduces the overall file size while maintaining the clarity of the main subjects. For everyday use like watching on a phone screen, sharing in group chats, or attaching to emails, the quality difference is virtually imperceptible. You get a much smaller file that still looks great and plays smoothly.</p>"
      }
    ]
  },
  "video-to-jpg": {
    disableAutoEnrich: true,
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
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Won't Discord Let Me Upload My Video?",
        content: "<p>Discord limits free file uploads to a strict 25MB maximum size. If you try to upload a game clip, screen recording, or meme edit that exceeds this limit, the upload will fail unless you pay for a premium subscription. To share your clip, you need to reduce the file size before uploading.</p>"
      },
      {
        title: "How to Compress Videos for Discord",
        content: "<ol><li><strong>Select your game clip:</strong> Drop your large video into the compressor.</li><li><strong>Auto-optimization:</strong> The tool automatically targets an output file size under 24.5MB by adjusting the video bitrate.</li><li><strong>Download:</strong> Save the compressed video. It is now guaranteed to fit within Discord's free upload limit.</li></ol>"
      },
      {
        title: "How Does Local Discord Compression Work?",
        content: "<p>Most compression websites require you to upload your gaming footage to their servers, which is slow and frustrating for large files. Our tool runs directly inside your web browser using your device's hardware. Your game clips never leave your PC, allowing for fast compression with zero wait queues or watermarks.</p>"
      },
      {
        title: "Will My Game Audio Stay Synced?",
        content: "<p>Yes. The encoder carefully preserves the original audio timestamp streams alongside the compressed video. Your game sound and voice comms will remain perfectly synchronized with crystal clear audio quality.</p>"
      },
      {
        title: "What Video Formats Does Discord Support?",
        content: "<p>Discord officially supports uploading MP4, WebM, and MOV video formats. While our compressor primarily outputs highly compatible MP4 files, this ensures that your converted game clips will play natively directly inside the chat window without forcing the other person to download the file first to view it.</p>"
      },
      {
        title: "Can I Compress Videos for Discord Nitro?",
        content: "<p>Yes. Even if you have a Discord Nitro subscription that increases your upload limit to 50MB or 500MB, shrinking your gigabyte-sized recordings is still highly recommended. A compressed video uploads much faster on slower internet connections and saves significant bandwidth for both you and the friends downloading your clip.</p>"
      }
    ]
  },
  "compress-video-for-whatsapp": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Won't WhatsApp Let Me Send My Video?",
        content: "<p>WhatsApp restricts standard video sharing to a strict 16MB file limit. If you try to send a longer or higher-quality video, WhatsApp either blocks the transfer or forces you to use its built-in trimming tool. Even when it does send, WhatsApp's automatic compression often blurs your footage heavily. Pre-compressing your video gives you more control over the final quality and ensures the file fits perfectly within the 16MB limit.</p>"
      },
      {
        title: "How to Compress Videos for WhatsApp",
        content: "<ol><li><strong>Select your video:</strong> Choose the large video you want to send on WhatsApp.</li><li><strong>Compress the file:</strong> The tool will automatically optimize the video resolution and bitrate to shrink the file size.</li><li><strong>Save and share:</strong> Download the compressed video to your phone. It is now ready to be shared in any WhatsApp chat or status update without errors.</li></ol>"
      },
      {
        title: "How Does Local Compression Keep Videos Private?",
        content: "<p>Personal videos shared on WhatsApp are meant to be private. Traditional video compressors require you to upload your files to their servers before compression. Our WhatsApp video compressor runs entirely in your web browser. This means the actual processing happens on your own phone or computer, so your home videos never leave your device.</p>"
      },
      {
        title: "Will This Work for WhatsApp Status Updates?",
        content: "<p>Yes. WhatsApp Status updates also share the same strict file size limits as regular chats. By shrinking your video beforehand, you can post longer clips to your status without encountering upload failures or heavy pixelation.</p>"
      }
    ]
  },
  "compress-video-for-email": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Is My Video Too Large to Email?",
        content: "<p>Major email providers like Gmail, Outlook, Yahoo Mail, and Apple Mail impose strict attachment size limits, typically between 20MB and 25MB. If your video exceeds this cap, the email client will block the attachment, forcing you to use third-party cloud links like Google Drive or Dropbox. Compressing the video allows you to attach it directly to the email.</p>"
      },
      {
        title: "How to Shrink a Video for Email Attachments",
        content: "<ol><li><strong>Select your video:</strong> Drop your large video into the compressor tool.</li><li><strong>Target email size:</strong> The tool applies intelligent compression to shrink the file size while preserving readability.</li><li><strong>Download and attach:</strong> Save the compressed video to your device and attach it seamlessly to your next email draft.</li></ol>"
      },
      {
        title: "Is My Video Safe from Third Parties?",
        content: "<p>If you are emailing sensitive work presentations or personal recordings, privacy is critical. Unlike other tools, our compressor runs securely inside your web browser. Your video is processed locally on your own computer and is never uploaded to any external servers, ensuring complete confidentiality.</p>"
      },
      {
        title: "What Are the Exact Email Limits?",
        content: "<p>Gmail allows up to 25MB of total file attachments per email. Microsoft Outlook and Hotmail typically restrict attachments to 20MB. By compressing your video, you can comfortably fit it within these strict parameters without needing complicated cloud-sharing links.</p>"
      },
      {
        title: "Why Use Compression Instead of Cloud Links?",
        content: "<p>While using Google Drive or Dropbox links is a common workaround for large files, it adds unnecessary friction. The recipient has to click away from the email, wait for a new page to load, and sometimes request access permissions just to view your video. By compressing the file and attaching it natively, the video plays immediately within their email app.</p>"
      },
      {
        title: "Does Compression Affect Audio Quality?",
        content: "<p>No. When compressing videos for email attachments, our tool focuses purely on shrinking the visual bitrate. The original audio tracks, whether they contain voiceovers, presentation dialogue, or background music, remain completely intact and crystal clear in the final compressed file.</p>"
      }
    ]
  },
  "compress-video-for-instagram": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Do My Videos Look Blurry on Instagram?",
        content: "<p>When you upload a heavy 4K video to Instagram Reels or Stories, Instagram's aggressive server algorithms immediately compress the file. This automated process often crushes the video quality, making your high-definition footage look pixelated and blurry. By pre-compressing your video to Instagram's recommended specifications, you can bypass their heavy compression and maintain maximum visual sharpness.</p>"
      },
      {
        title: "How to Optimize Videos for Instagram",
        content: "<ol><li><strong>Select your video:</strong> Drop your 4K or high-bitrate video into the compressor.</li><li><strong>Compress intelligently:</strong> The tool optimizes the bitrate and scales the file size to fit Instagram's native handling better.</li><li><strong>Download and post:</strong> Save the optimized video to your phone and upload it directly to Reels or Stories for crisp playback.</li></ol>"
      },
      {
        title: "Does This Require Uploading My Video?",
        content: "<p>No. Our tool processes your video entirely on your device using your web browser. This local processing means your unreleased content stays completely private and never touches our servers. You also save significant time since you don't have to wait for large files to upload before compression begins.</p>"
      },
      {
        title: "What Is the Best Resolution for Reels?",
        content: "<p>For the best results on Instagram Reels, it is recommended to use a 1080x1920 pixel resolution with a 9:16 vertical aspect ratio. Pre-compressing your high-bitrate files helps preserve the fine details when the video is finally published to your feed.</p>"
      },
      {
        title: "Why Avoid Instagram's Built-in Camera?",
        content: "<p>Recording directly inside the Instagram app often results in lower quality footage compared to using your phone's native camera app. It is always better to record your videos in 4K using your phone's default camera, and then use our compressor to properly optimize the file before uploading it to Instagram Reels.</p>"
      },
      {
        title: "Does the Video Maintain Its Aspect Ratio?",
        content: "<p>Yes. The compressor strictly respects your original video dimensions. If you are uploading a vertical 9:16 video for Stories or a square 1:1 video for your main feed, the tool will shrink the file size without artificially cropping or stretching your carefully framed shots.</p>"
      }
    ]
  },
  "compress-mov-video": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Are iPhone MOV Files So Large?",
        content: "<p>Apple iPhones and Mac computers record video in the QuickTime MOV format. These devices capture high-bitrate footage with rich color profiles, which is fantastic for editing but consumes gigabytes of storage space very quickly. Sharing these heavy MOV files with friends or uploading them to websites often fails due to size restrictions.</p>"
      },
      {
        title: "How to Shrink MOV Files and Convert to MP4",
        content: "<ol><li><strong>Select your MOV file:</strong> Drop your large iPhone or Mac video into the browser window.</li><li><strong>Process the video:</strong> The tool shrinks the file size while simultaneously converting the video into the universally compatible MP4 format.</li><li><strong>Download:</strong> Save the lightweight MP4 video directly to your computer or smartphone.</li></ol>"
      },
      {
        title: "Do I Have to Upload My Home Videos?",
        content: "<p>No. Our tool processes your MOV files locally inside your web browser. This means your personal videos are compressed on your own device and are never uploaded to our servers, ensuring complete privacy for your family recordings.</p>"
      },
      {
        title: "Will the Compressed Video Play on Windows or Android?",
        content: "<p>Yes. By compressing the MOV file and wrapping it in an MP4 container, the resulting video becomes playable natively on almost all devices, including Windows PCs, Android phones, and smart TVs, without needing any special video players.</p>"
      },
      {
        title: "Why Convert MOV to MP4?",
        content: "<p>While MOV is an excellent, high-quality container developed by Apple, it is not universally supported outside the Apple ecosystem. If you try to upload a MOV file to certain web portals, or play it on an older Android device or Windows PC, you will frequently encounter playback errors. Converting it to the globally recognized MP4 format permanently solves these compatibility issues.</p>"
      },
      {
        title: "Does the Converter Remove Metadata?",
        content: "<p>By default, our in-browser converter focuses purely on extracting the video and audio streams and placing them into an MP4 container. This process often strips out unnecessary Apple-specific metadata and location tags, which further reduces the file size and helps protect your privacy when sharing the video online.</p>"
      }
    ]
  },
  "compress-mp4": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Is My MP4 File Too Large?",
        content: "<p>MP4 is the most popular video format, but raw recordings from smartphones, screen capture software, or digital cameras can easily run into the gigabytes. This happens because the video is recorded at a very high bitrate to capture every detail. When you try to email these files or share them on messaging apps, you often hit file size limits. Our MP4 compressor helps you reduce the file size by optimizing the video bitrate, making it easy to share without losing noticeable quality.</p>"
      },
      {
        title: "Do You Really Need to Upload Your Video to Compress It?",
        content: "<p>Most online video compressors require you to upload your gigabyte-sized files to their cloud servers, which takes a long time and uses up your internet bandwidth. We do things differently. This tool runs directly inside your web browser using your device's own processor. Your videos are compressed locally on your computer or phone, meaning your personal recordings never leave your device.</p>"
      },
      {
        title: "How to Reduce MP4 File Size",
        content: "<ol><li><strong>Select your video:</strong> Drag and drop your heavy MP4 video directly into the browser window.</li><li><strong>Choose how much to compress:</strong> Select from preset quality levels depending on how small you need the final file to be.</li><li><strong>Start compression:</strong> The browser will begin shrinking the video locally.</li><li><strong>Save your video:</strong> Download the newly compressed MP4 file directly to your device.</li></ol>"
      },
      {
        title: "Will the Compressed Video Look Blurry?",
        content: "<p>Our compressor uses a smart balanced preset that removes redundant visual data while keeping the main subjects clear. For everyday use like watching on a phone screen, sharing in group chats, or attaching to emails, the quality difference is virtually imperceptible. You get a much smaller file that still looks great.</p>"
      }
    ]
  },
  "video-to-mp4": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Convert Your Videos to MP4?",
        content: "<p>Many older or specialized video formats like AVI, MKV, WMV, FLV, and WebM often fail to play natively on modern smartphones, smart TVs, or web browsers. MP4 is the universally accepted standard for video playback. Converting your videos into the MP4 format ensures they will play smoothly on any device and can be easily shared or embedded on websites without frustrating compatibility errors.</p>"
      },
      {
        title: "How to Convert Videos to MP4 Without Uploading",
        content: "<ol><li><strong>Select your video:</strong> Drag and drop your incompatible video file into the tool.</li><li><strong>Local conversion:</strong> The tool re-encodes the video directly in your web browser.</li><li><strong>Save your MP4:</strong> Download the newly converted, universally compatible MP4 video to your device.</li></ol>"
      },
      {
        title: "Is My Personal Video Kept Private?",
        content: "<p>Yes. Traditional video converters force you to upload your files to their cloud servers, which compromises your privacy and takes a long time. Our conversion engine runs entirely on your device using local processing power. Your files are never uploaded, meaning your personal media remains completely private.</p>"
      },
      {
        title: "Why Is the Conversion Sometimes Slow?",
        content: "<p>Since this tool uses your device's own hardware to process the video, performance depends on your computer or phone's processor. If the conversion feels slow, check your device's battery saver mode. Plugging in your laptop or disabling low-power mode on your phone allows the processor to run at full speed, significantly boosting conversion times.</p>"
      },
      {
        title: "Is It Safe to Convert Videos Online?",
        content: "<p>If you are converting personal recordings, workplace presentations, or private family moments, uploading them to remote cloud servers can be a massive security risk. Because our converter operates entirely within your local browser, your files remain strictly on your hard drive. There is zero risk of data interception or unauthorized access.</p>"
      },
      {
        title: "Why is MP4 the Best Format?",
        content: "<p>MP4 (MPEG-4 Part 14) is universally recognized as the gold standard for digital video. It offers an incredible balance between high visual quality and minimal file size. Every major operating system, smartphone, smart TV, and web browser supports MP4 natively, making it the most reliable format for archiving and sharing.</p>"
      }
    ]
  },
  "compress-video-for-facebook": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Do Videos Take So Long to Upload on Facebook?",
        content: "<p>Uploading heavy, uncompressed videos to Facebook can take a very long time and consume a lot of mobile data. Additionally, Facebook applies its own compression once the video is uploaded, which can sometimes degrade the visual quality unexpectedly. Shrinking the video beforehand solves both problems.</p>"
      },
      {
        title: "How to Compress Video for Facebook",
        content: "<ol><li><strong>Select your video:</strong> Drop your large video into the browser window.</li><li><strong>Optimize bitrate:</strong> The tool compresses the video file size while prioritizing crisp 1080p clarity for social media viewing.</li><li><strong>Download and upload:</strong> Save the compressed video to your device. It will now upload to Facebook in a fraction of the time.</li></ol>"
      },
      {
        title: "Are My Videos Stored on Your Servers?",
        content: "<p>Absolutely not. The compression runs entirely on your local device—whether that is your phone or your computer. Your videos are never uploaded to any cloud servers, ensuring that your personal content remains entirely private until you decide to post it on Facebook.</p>"
      },
      {
        title: "Will the Video Look Pixelated?",
        content: "<p>No. By pre-compressing your video using our high-quality preset, you ensure the file is small enough to upload quickly, while retaining enough visual data to bypass Facebook's most aggressive server-side quality reductions.</p>"
      },
      {
        title: "Why Do Videos Look Bad on Facebook?",
        content: "<p>Facebook aggressively compresses any video that exceeds its optimal bitrate guidelines to save server storage space. If you upload a massive, unoptimized file, Facebook's automated servers will crush the quality indiscriminately. By pre-compressing the video yourself using our balanced algorithm, you retain control over the final visual fidelity.</p>"
      },
      {
        title: "What is the Best Video Format for Facebook?",
        content: "<p>The recommended format for uploading videos to Facebook is MP4 with H.264 video encoding and AAC audio. Our tool automatically processes your files to match these exact specifications, guaranteeing that your posts will be processed quickly and stream smoothly for all your friends and followers.</p>"
      }
    ]
  },
  "compress-video-for-phone": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Is My Phone Storage Full?",
        content: "<p>Modern smartphones record video in stunning 4K resolution, but these files consume gigabytes of storage space in a matter of minutes. If you are running out of space on your Android or iPhone, compressing your existing videos is a great way to free up storage without having to delete your favorite memories.</p>"
      },
      {
        title: "How to Compress Videos on Your Phone",
        content: "<ol><li><strong>Select your video:</strong> Choose a large video directly from your phone's camera roll or gallery.</li><li><strong>Compress locally:</strong> The browser will shrink the video using your phone's processor.</li><li><strong>Save the new file:</strong> Download the compressed video. You can now delete the heavy original file to free up significant storage space.</li></ol>"
      },
      {
        title: "Does It Use Mobile Data to Compress?",
        content: "<p>No. Because our compressor runs entirely inside your mobile web browser, it does not upload your large video files to the internet. This saves your mobile data plan and ensures that your personal videos remain 100% private on your device.</p>"
      },
      {
        title: "Will the Video Still Look Good on My Screen?",
        content: "<p>Yes. The tool defaults to a high-quality preset that is visually indistinguishable from the original when viewed on a standard mobile screen, but it dramatically reduces the overall file size footprint on your phone's storage drive.</p>"
      },
      {
        title: "Will Compression Drain My Battery?",
        content: "<p>Because our tool uses your smartphone's built-in hardware acceleration to process the video, it is highly efficient. However, compressing very long or heavy 4K videos does require processing power. It is recommended to keep your phone charged or plugged in while compressing large files to ensure the fastest possible processing speeds.</p>"
      },
      {
        title: "Can I Compress Multiple Videos at Once?",
        content: "<p>Currently, the tool is optimized to process one video at a time to ensure maximum stability within your mobile browser. By focusing your device's memory on a single file, we prevent browser crashes and guarantee that the final compressed video maintains the highest possible quality without errors.</p>"
      }
    ]
  }
};
