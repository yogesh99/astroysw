"use client";
import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "success" | "exists" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setSubStatus("success"); setEmail(""); }
      else if (res.status === 409) setSubStatus("exists");
      else setSubStatus("error");
    } catch { setSubStatus("error"); }
    setTimeout(() => setSubStatus("idle"), 4000);
  };

  return (
    <footer className="w-full bg-white/40 backdrop-blur-lg border-t border-white/50 mt-24 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.png" alt="AstroYSW Logo" width={100} height={100} className="object-contain" />
          </Link>
          <p className="text-foreground/70 mb-6 font-serif max-w-sm text-lg">
            Decode Your Cosmic Blueprint. A premium astrology platform delivering deep wisdom and cosmic insights.
          </p>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-bold text-lg mb-4 text-primary font-serif">Explore</h4>
          <ul className="space-y-3 text-sm text-foreground/80 font-medium tracking-wide">
            <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
            <li><Link href="/knowledge" className="hover:text-secondary transition-colors">Knowledge Base</Link></li>
            <li><Link href="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
            <li><Link href="/about" className="hover:text-secondary transition-colors">About AstroYSW</Link></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className="font-bold text-lg mb-4 text-primary font-serif">Subscribe to AstroYSW</h4>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your Email Address"
              className="px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-foreground/40 shadow-sm"
              suppressHydrationWarning
            />
            <button className="bg-primary hover:bg-primary-light text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-md shadow-primary/20" suppressHydrationWarning>
              Subscribe to AstroYSW
            </button>
            {subStatus === "success" && <p className="text-green-600 text-sm font-medium">✓ You are now subscribed!</p>}
            {subStatus === "exists" && <p className="text-secondary text-sm font-medium">You are already subscribed ✨</p>}
            {subStatus === "error" && <p className="text-red-500 text-sm font-medium">Something went wrong. Try again.</p>}
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-foreground/50 tracking-wider">
        <p>© {new Date().getFullYear()} ASTROYSW. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-primary transition-colors">PRIVACY</Link>
          <Link href="#" className="hover:text-primary transition-colors">TERMS</Link>
        </div>
      </div>
    </footer>
  );
}
