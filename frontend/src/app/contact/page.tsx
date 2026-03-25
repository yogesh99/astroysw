"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full py-12 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-5/12">
          <h1 className="text-5xl font-serif font-bold text-primary mb-6">Let's Connect</h1>
          <p className="text-lg text-foreground/70 mb-10 font-light leading-relaxed">
            Have a question about your chart? Interested in a reading? Or simply want to share your spiritual journey? I would love to hear from you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
                <span className="relative z-10 text-xl">✉</span>
              </div>
              <div>
                <h4 className="font-bold text-primary">Email</h4>
                <p className="text-foreground/70 text-sm">astroysw.team@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 relative overflow-hidden">
                <span className="relative z-10 text-xl">✦</span>
              </div>
              <div>
                <h4 className="font-bold text-primary">Social Sphere</h4>
                <p className="text-foreground/70 text-sm">@AstroYSW on all platforms</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-7/12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <h2 className="text-2xl font-serif font-bold text-primary mb-8 relative z-10">Send a Message</h2>
            
            {status === "success" ? (
              <div className="py-12 text-center relative z-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                <h3 className="text-xl font-bold text-primary mb-2">Message Sent Successfully</h3>
                <p className="text-foreground/70 mb-8">Thank you for reaching out. The cosmos has received your signal.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-primary font-medium hover:text-secondary underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primary/80 uppercase tracking-widest">Name</label>
                    <input 
                      required
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white transition-all shadow-sm"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primary/80 uppercase tracking-widest">Email</label>
                    <input 
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white transition-all shadow-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-widest">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white transition-all shadow-sm resize-none"
                    placeholder="How can I illuminate your path?"
                  ></textarea>
                </div>
                {status === "error" && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
                <button 
                  disabled={status === "submitting"}
                  className="w-full py-4 bg-primary text-white rounded-xl font-medium text-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === "submitting" ? "Aligning Stars..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
