import { Metadata } from "next";
import { AuthorProfile } from "@/components/shared/author-profile";

export const metadata: Metadata = {
  title: "About Us | ConverterForAll",
  description: "Learn more about ConverterForAll and our mission to simplify everyday file conversions.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">About Us</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
        <p>
          Every file conversion tool online seems to promise the same thing: fast, free, secure. Most don't deliver on all three. That gap is exactly why ConverterForAll exists.
        </p>

        <h2>How It Started</h2>
        <p>
          Like a lot of small tech projects, ConverterForAll began with a personal annoyance. I needed to convert a scanned document into a proper PDF, remove the background from a product photo, and pull the audio out of a short video clip — three completely different tasks, and yet every &quot;solution&quot; I found online involved the same broken pattern. Upload your file to an unfamiliar server. Sit through a spinning wheel while ads load around it. Wait for an email link to download your own file back. Sometimes pay for the privilege of getting a document you already owned in a different format.
        </p>
        <p>
          None of that made sense for something as simple as a file conversion. A PDF merge or a PNG-to-JPG swap isn't a complicated computational problem — it's something a browser can handle on its own, on your own device, in a few seconds. So that became the starting point for this project: build the tools I actually wanted to use, strip out everything that got in the way, and make the whole experience as close to instant as the underlying technology allows.
        </p>

        <h2>What We Built</h2>
        <p>
          ConverterForAll is a single platform that brings together the file conversion tools people reach for most often — document and PDF utilities, image converters, video tools, and audio conversion — without forcing anyone to bounce between five different websites to get a day's work done.
        </p>
        <p>
          On the document side, you can merge PDFs, split them apart, remove or extract specific pages, reorganize page order, and turn scanned images into clean PDF files. On the image side, there's background removal powered by on-device AI, along with conversions between formats like WEBP, PNG, JPG, AVIF, and HEIC — the last of which trips up a surprising number of people the first time they try to open an iPhone photo on a non-Apple device. The video tools handle conversions between MP4, AVI, MKV, WMV, MOV, and FLV, plus straightforward audio extraction from video files. And on the audio side, you can move between MP3, WAV, and OGG formats depending on what you need — smaller file size, lossless quality, or broader compatibility.
        </p>
        <p>
          The list of tools will keep growing. But the principle behind all of them stays the same: pick a tool, drop in your file, get your result. No account required, no software to install, no hidden catch.
        </p>

        <h2>Why It's Built the Way It Is</h2>
        <p>
          The single biggest design decision behind ConverterForAll is that most conversions happen client-side — meaning the processing happens in your browser, on your own device, rather than on a remote server somewhere. That matters for two reasons.
        </p>
        <p>
          The first is speed. When your file doesn't have to travel across the internet to a server, get processed, and travel back, the whole thing just feels faster. There's no upload progress bar to stare at, no queue to wait in.
        </p>
        <p>
          The second, and more important, reason is privacy. A lot of the files people convert aren't meant for anyone else's eyes — scanned IDs, signed contracts, personal photos, financial documents. Sending those to a third-party server, even briefly, is a trust exercise most people don't think about until something goes wrong. By keeping the processing local to your device wherever technically possible, that risk simply doesn't come into play. Your files stay yours.
        </p>
        <p>
          This isn't a philosophy we advertise for marketing purposes — it's a genuine constraint we build around. It means some conversions are technically harder to implement than they'd be with a server doing the heavy lifting. We think that trade-off is worth it.
        </p>

        <h2>Who This Is For</h2>
        <p>
          ConverterForAll wasn't designed with one specific user in mind — it was designed around the kinds of small, everyday tasks that everyone runs into eventually. The student converting a stack of scanned lecture notes into a single PDF the night before a deadline. The freelance designer who needs a transparent background on a product shot in the next five minutes, not after signing up for a subscription. The video editor who just needs the audio track from a clip and doesn't want to open a full editing suite to get it. The person who just took a photo on their iPhone and can't figure out why it won't open on their work laptop.
        </p>
        <p>
          None of these are complicated problems. They just deserve tools that don't waste your time or ask more of you than the task requires.
        </p>

        <h2>Where We're Headed</h2>
        <p>
          ConverterForAll is an active, evolving project, not a finished product sitting untouched on a server. New tools and formats get added based on what people are actually asking for, and existing tools get refined as we find better, faster, or more reliable ways to build them. If there's a conversion you find yourself needing that isn't here yet, we'd genuinely like to know — this platform grows in the direction its users push it.
        </p>
        <p>
          The goal, ultimately, is simple: to be the one place people think of when they need to change a file from one format into another, without friction, without cost, and without wondering what happens to their data along the way.
        </p>

        <h2>About the Author</h2>
      </div>

      <AuthorProfile />
    </div>
  );
}
