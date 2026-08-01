import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Us for ConverterForAll.",
};

export default function aboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">About Us</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>Welcome to <strong>ConverterForAll</strong>, your ultimate destination for free, fast, and secure online file conversions.</p>
      <p>Our mission is simple: to provide a universal toolkit that empowers users to seamlessly transform documents, images, audio, and video files without the hassle of downloading software or compromising their privacy.</p>
      <h2>Our Core Values</h2>
      <ul>
        <li><strong>Privacy First:</strong> We believe your data belongs to you. That's why we utilize on-device processing where possible, and automatically delete uploaded files from our servers immediately after conversion.</li>
        <li><strong>Accessibility:</strong> High-quality tools should be available to everyone. ConverterForAll is completely free to use.</li>
        <li><strong>Speed & Quality:</strong> We leverage the latest web technologies to ensure your files are converted instantly without losing quality.</li>
      </ul>
      <p>Whether you're a student, a professional, or just someone trying to convert a quick photo, we are here to make your digital life easier.</p>
    ` }} />
    </div>
  );
}
