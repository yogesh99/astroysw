import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Terms of Service | AstroYSW",
  description: "Terms and conditions for using the AstroYSW platform.",
};

export default function TermsOfService() {
  return (
    <div className="w-full py-16 max-w-4xl mx-auto px-6">
      <div className="mb-12">
        <Link href="/" className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-2 mb-8 transition-colors">
          <span>←</span> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Terms of Service</h1>
        <p className="text-foreground/50 text-sm font-medium tracking-wide italic">Last updated: March 27, 2026</p>
      </div>

      <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-serif prose-p:text-foreground/80 prose-p:font-light prose-strong:text-primary/90 bg-white/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-primary/5 shadow-xl shadow-primary/5">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AstroYSW ("the Site" or "the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our platform.
          </p>
        </section>

        <section className="mb-10 px-6 py-4 bg-secondary/5 rounded-2xl border-l-4 border-secondary">
          <h2 className="text-xl font-bold mb-2 text-secondary uppercase tracking-wider">⚠️ Important Disclaimer</h2>
          <p className="text-foreground/90 font-medium">
            <strong>AstroYSW provides astrology insights, cosmic guidance, and spiritual information for ENTERTAINMENT AND PERSONAL GROWTH PURPOSES ONLY.</strong>
          </p>
          <p className="mt-2">
            Astrology is not a substitute for professional medical, legal, financial, or psychological advice. We do not guarantee the accuracy of any predictions or insights. Any action you take based on the information provided on this site is strictly at your own risk.
          </p>
        </section>

        <section className="mb-10 mt-10">
          <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
          <p>
            AstroYSW delivers deep cosmic awareness, astrological reports, and spiritual intelligence to assist you in self-realization and life alignment. We reserve the right to modify or discontinue any part of the service at any time without notice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
          <p>You agree to use AstroYSW only for lawful purposes. You are prohibited from:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Using the service to harass, abuse, or harm others.</li>
            <li>Attempting to interfere with the security or performance of the site.</li>
            <li>Using automated systems (bots, scrapers) to extract data without permission.</li>
            <li>Submitting false information or impersonating others through our contact forms.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
          <p>
            All content on AstroYSW, including text, logos, designs, and spiritual insights, is the intellectual property of AstroYSW and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, AstroYSW and its creators shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. External Links</h2>
          <p>
            Our site may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Your continued use of the site following any changes signifies your acceptance of the updated terms.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-primary/10">
          <p className="text-foreground/70 text-sm">
            If you have any questions about these Terms, please contact us at: <br />
            <strong>astroysw.team@gmail.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
