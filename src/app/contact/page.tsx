import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Us for ConverterForAll.",
};

export default function contactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
          <p>We'd love to hear from you! Whether you have a question about a specific converter, need technical support, or want to suggest a new feature, our team is ready to help.</p>
          <h2>Get in Touch</h2>
          <p><strong>Email:</strong> officialdeepbahl@gmail.com</p>
          <p>We aim to respond to all inquiries within 24-48 business hours.</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form action="https://formsubmit.co/officialdeepbahl@gmail.com" method="POST" className="space-y-4">
            {/* FormSubmit Configuration */}
            <input type="hidden" name="_subject" value="New Contact Form Submission - ConverterForAll!" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <input 
                type="text" 
                name="city" 
                id="city" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="New York"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="suggestion" className="text-sm font-medium">Suggestion / Message</label>
              <textarea 
                name="suggestion" 
                id="suggestion" 
                required 
                rows={5}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
