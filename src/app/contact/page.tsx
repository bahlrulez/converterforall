import { Metadata } from "next";
import { Mail, Clock, Sparkles, Send, ShieldCheck, MessageSquare, Lightbulb, CheckCircle2, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Support & Tool Requests | ConverterForAll",
  description: "Contact the ConverterForAll team for technical support, bug reports, partnership inquiries, or to request new free file conversion tools.",
  alternates: {
    canonical: "https://www.converterforall.com/contact",
  },
  openGraph: {
    title: "Contact ConverterForAll - Support & Feedback",
    description: "Get in touch with our team for converter questions, feature requests, or support. We respond within 24-48 business hours.",
    type: "website",
    url: "https://www.converterforall.com/contact",
  }
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact ConverterForAll",
    "url": "https://www.converterforall.com/contact",
    "description": metadata.description,
    "mainEntity": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "email": "officialdeepbahl@gmail.com",
      "url": "https://www.converterforall.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "officialdeepbahl@gmail.com",
        "contactType": "Customer Support",
        "availableLanguage": ["English", "Hindi", "Punjabi"]
      }
    }
  };

  const contactFaqs = [
    {
      q: "How quickly does the ConverterForAll team respond?",
      a: "We review every inquiry directly and aim to reply within 24 to 48 business hours."
    },
    {
      q: "Can I request a new regional font converter or file utility?",
      a: "Yes! A large portion of our tools (such as Kruti Dev, AnmolLipi, and Video to GIF) were built directly from user requests. Select 'Feature / Tool Request' in the form and describe your needs."
    },
    {
      q: "How do I report a file conversion bug or error?",
      a: "Please mention the specific tool name, your browser (Chrome, Safari, Edge, etc.), device (Windows, Mac, Android, iPhone), and the file format you tried to convert so our engineering team can test and fix it."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-4 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Support &amp; Community Feedback</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-4">
            Get in Touch with{" "}
            <span className="text-blue-600 dark:text-blue-400">
              ConverterForAll
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Have a question about a specific converter, encountered an issue, or want to suggest a new tool? Our team is here to help.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
          
          {/* Left Column: Contact Cards & Highlights (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Email Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Direct Email</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Send us an email anytime for technical or general inquiries.</p>
              <a 
                href="mailto:officialdeepbahl@gmail.com" 
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                officialdeepbahl@gmail.com
              </a>
            </div>

            {/* Response Time Guarantee Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Response Guarantee</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We review all submissions daily and respond to all inquiries within <strong>24–48 business hours</strong>.
              </p>
            </div>

            {/* Feature Suggestions Highlight */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-blue-900/30 border border-indigo-500/20 shadow-sm text-slate-300">
              <div className="flex items-center gap-3 mb-2 text-white">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold">Have a Tool Idea?</h4>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-300 leading-relaxed">
                We build tools based on what users need. If you need a specific font conversion, image format, or document utility, tell us and we&apos;ll build it!
              </p>
            </div>

            {/* Privacy Promise */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Your contact details are 100% private and never used for marketing or spam.</span>
            </div>

          </div>

          {/* Right Column: Modern Contact Form (7 Cols) */}
          <div className="lg:col-span-7 p-7 sm:p-10 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-xl relative">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Send Us a Message</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fill in the form below and we will get back to you promptly.
              </p>
            </div>

            <form 
              action="https://formsubmit.co/officialdeepbahl@gmail.com" 
              method="POST" 
              className="space-y-4"
            >
              {/* FormSubmit Configuration */}
              <input type="hidden" name="_subject" value="New Contact Form Submission - ConverterForAll" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required 
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#080e22] px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    placeholder="e.g. John Doe"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#080e22] px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    placeholder="yourname@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City / Country */}
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    City / Country
                  </label>
                  <input 
                    type="text" 
                    name="city" 
                    id="city" 
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#080e22] px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    placeholder="e.g. New York, USA or Delhi, India"
                  />
                </div>

                {/* Subject / Purpose */}
                <div className="space-y-1.5">
                  <label htmlFor="topic" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Inquiry Type
                  </label>
                  <select
                    name="topic"
                    id="topic"
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#080e22] px-3.5 py-2 text-sm text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Feature / Tool Request">Feature / Tool Request</option>
                    <option value="Bug / Error Report">Report an Issue or Bug</option>
                    <option value="Partnership">Partnership / Collaboration</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="suggestion" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message / Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  name="suggestion" 
                  id="suggestion" 
                  required 
                  rows={5}
                  className="flex min-h-[120px] w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#080e22] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 leading-relaxed"
                  placeholder="How can we help you? Feel free to describe your suggestion or issue in detail..."
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

        </div>

        {/* Contact FAQs Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
            Common Support Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactFaqs.map((faq, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800/80 space-y-2"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
