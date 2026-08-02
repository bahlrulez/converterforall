import { UploadCloud, Zap, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: UploadCloud,
      title: "1. Select your file",
      description: "Choose the file you want to convert from your device or simply drag and drop it into the browser window.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Zap,
      title: "2. Process locally",
      description: "Our advanced engine processes the file directly on your device, ensuring maximum privacy and blazing-fast speeds.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: Download,
      title: "3. Download instantly",
      description: "Get your converted file immediately without waiting in queues or checking your email for download links.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="py-24 bg-background border-t">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Converting files shouldn't be complicated. Our seamless process gets you the results you need in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-muted/50 -translate-y-1/2 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-card border rounded-2xl p-8 relative shadow-sm">
              <div className={`h-16 w-16 rounded-full ${step.bg} ${step.color} flex items-center justify-center mb-6 shadow-inner`}>
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
