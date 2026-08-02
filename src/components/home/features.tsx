import { Shield, FastForward, HardDrive, Infinity } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Shield,
      title: "100% Secure & Private",
      description: "Unlike traditional converters that force you to upload sensitive files to unknown servers, our tools process everything client-side. Your files never leave your device, ensuring total privacy for your documents and media.",
    },
    {
      icon: FastForward,
      title: "Instant Conversion Speeds",
      description: "No more waiting in queues or staring at slow upload progress bars. By utilizing your device's native computational power, files are converted instantly the moment you select them.",
    },
    {
      icon: Infinity,
      title: "No File Size Limits",
      description: "Stop getting hit by artificial paywalls when your video is 1MB over the limit. Since we don't pay for server storage or bandwidth to host your files, we don't have to restrict how large your files can be.",
    },
    {
      icon: HardDrive,
      title: "All Formats Supported",
      description: "Whether you're merging PDFs, removing backgrounds from images, or extracting MP3 audio from MP4 videos, you can manage all your digital assets from a single, unified platform.",
    },
  ];

  return (
    <section className="py-24 bg-muted/20 border-t">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              The problem with traditional file converters
            </h2>
            <p className="text-lg text-muted-foreground">
              Most online converters share the same broken pattern: they require you to upload your files to unfamiliar remote servers, wait for them to process, and then download them back. 
            </p>
            <p className="text-lg text-muted-foreground">
              This process is slow, imposes strict file size limits, and poses significant security risks for sensitive documents and personal photos.
            </p>
            <div className="pt-4">
              <div className="inline-flex items-center rounded-lg bg-primary/10 text-primary px-4 py-2 font-medium">
                The Solution: Local Client-Side Processing
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-start text-left">
                <div className="rounded-lg p-2.5 bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
