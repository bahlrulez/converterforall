import { Metadata } from "next";
import { AuthorProfile } from "@/components/shared/author-profile";

export const metadata: Metadata = {
  title: "About Us | ConverterForAll",
  description: "Learn more about ConverterForAll and our mission to simplify everyday file conversions.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">About ConverterForAll</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
        <p>
          Welcome to <strong>ConverterForAll</strong>, your trusted destination for reliable, fast, and secure online file conversions and digital utilities.
        </p>

        <h2>Our Mission</h2>
        <p>
          My mission is simple: to provide a universal, high-quality toolkit that empowers you to seamlessly transform documents, images, audio, and video files without the hassle of downloading software or compromising your privacy. I believe in simplifying everyday calculations and unit conversions so you can focus on what matters most.
        </p>

        <h2>Commitment to Quality and Reliability</h2>
        <p>
          As a solo developer and engineer, I have a strong focus on accuracy, reliability, and continuous improvement. I am committed to maintaining and improving this platform to ensure that the tools provided remain fast, secure, and easy to use.
        </p>

        <h2>Our Core Values</h2>
        <ul>
          <li><strong>Privacy First:</strong> Your data belongs to you. We utilize on-device processing where possible, ensuring your files are never unnecessarily transmitted or stored.</li>
          <li><strong>Accessibility:</strong> High-quality, reliable tools should be available to everyone. ConverterForAll is completely free to use.</li>
          <li><strong>Speed & Quality:</strong> We leverage modern web technologies to ensure your files are converted instantly without losing quality.</li>
        </ul>

        <h2>About the Creator</h2>
        <p>
          ConverterForAll is owned and maintained by Kuldeep Bahl.
        </p>
      </div>

      <AuthorProfile />
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg mt-8">
        <p>
          Whether you're a student, a professional, or just someone trying to convert a quick photo, I am here to make your digital life a little bit easier. Thank you for using ConverterForAll!
        </p>
      </div>
    </div>
  );
}
