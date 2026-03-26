import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Privacy Policy | AstroYSW",
  description: "AstroYSW's commitment to protecting your privacy and cosmic data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="w-full py-16 max-w-4xl mx-auto px-6">
      <div className="mb-12">
        <Link href="/" className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-2 mb-8 transition-colors">
          <span>←</span> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Privacy Policy</h1>
        <p className="text-foreground/50 text-sm font-medium tracking-wide italic">Last updated: March 27, 2026</p>
      </div>

      <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-serif prose-p:text-foreground/80 prose-p:font-light prose-strong:text-primary/90 bg-white/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-primary/5 shadow-xl shadow-primary/5">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p>
            Welcome to AstroYSW ("we," "our," or "us"). We are committed to protecting your privacy and ensuring that your personal and cosmic data is handled with care and transparency. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <p>We collect information that you voluntarily provide to us when you interact with our platform:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Newsletter Subscriptions:</strong> If you subscribe to our newsletter, we collect your email address.</li>
            <li><strong>Contact Forms:</strong> If you message us through our contact form, we collect your name, email address, and the content of your message.</li>
            <li><strong>Blog Interaction:</strong> If you use our "Like" feature, we may collect your name and email to track engagement and prevent abuse.</li>
            <li><strong>Usage Data:</strong> We may collect non-personal information such as browser type, device information, and site interaction data to improve our services.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p>We use the data we collect for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To deliver cosmic insights and astrology reports you've requested.</li>
            <li>To send you newsletters and spiritual updates (if opted-in).</li>
            <li>To respond to your inquiries via our contact form.</li>
            <li>To improve our website's functionality and user experience.</li>
            <li>To maintain the security and integrity of our platform.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Data Processing and Storage</h2>
          <p>
            AstroYSW uses third-party services to host and power our platform:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Vercel:</strong> Our frontend is hosted on Vercel, which may process traffic data for security and performance monitoring.</li>
            <li><strong>Render:</strong> Our backend API and database are hosted on Render, where your submitted data (emails, messages, likes) is stored securely.</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
          <p>
            We may use subtle cookies and tracking technologies to understand how you use our site and to remember your preferences. You can adjust your browser settings to refuse cookies, but some parts of our site may not function correctly as a result.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete information we hold about you. If you wish to exercise these rights, please contact us at <span className="text-secondary font-medium">astroysw.team@gmail.com</span>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">7. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-primary/10">
          <p className="text-foreground/70 text-sm">
            For any questions regarding this Privacy Policy, please contact us at: <br />
            <strong>astroysw.team@gmail.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
