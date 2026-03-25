"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-primary leading-tight mb-6">
            Decode Your <span className="cosmic-gradient-text">Cosmic Blueprint</span>
          </h1>
          <p className="text-lg md:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Journey into the depths of your soul. Uncover the wisdom of the stars to navigate your life with clarity, purpose, and spiritual alignment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/knowledge" className="px-8 py-4 bg-primary text-white rounded-full font-medium text-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1">
              Explore Astrology Knowledge
            </Link>
            <Link href="/about" className="px-8 py-4 bg-white text-primary border border-primary/20 rounded-full font-medium text-lg hover:bg-primary/5 transition-all">
              My Philosophy
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Knowledge Topics */}
      <section className="w-full py-24 px-4 bg-white/30 backdrop-blur-sm border-t border-b border-primary/5 my-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Cosmic Knowledge</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">Master the fundamental building blocks of astrology and spiritual growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "The 12 Houses", desc: "Discover the arenas of life where your cosmic story unfolds.", icon: "🌌", id: 6 },
              { title: "Planetary Forces", desc: "Understand the psychological drives governed by celestial bodies.", icon: "🪐", id: 1 },
              { title: "Karmic Nodes", desc: "Unravel your past life debts and future soul destiny.", icon: "✨", id: 2 },
              { title: "Transits & Timing", desc: "Navigate the cycles of change with predictive astrology.", icon: "⏳", id: 3 }
            ].map((topic, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-8 flex flex-col items-start transition-all duration-300 hover:shadow-primary/10"
              >
                <span className="text-4xl mb-4">{topic.icon}</span>
                <h3 className="text-xl font-bold text-primary mb-2 font-serif">{topic.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{topic.desc}</p>
                <Link href={`/knowledge/${topic.id}`} className="mt-6 text-secondary font-medium hover:text-primary transition-colors text-sm flex items-center gap-1">
                  Read more <span>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AstroYSW */}
      <section className="w-full py-24 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Awaken Your Highest Potential</h2>
            <p className="text-foreground/70 mb-4 leading-relaxed font-light text-lg">
              At AstroYSW, I believe astrology is more than prediction; it is a spiritual tool for self-realization. I strip away the superstition and focus on profound psychological, karmic, and evolutionary insights.
            </p>
            <p className="text-foreground/70 mb-8 leading-relaxed font-light text-lg">
              My platform bridges ancient wisdom with modern intelligence, creating a sanctuary for seekers who demand depth, rigor, and authenticity.
            </p>
            <Link href="/about" className="text-primary font-medium hover:text-secondary transition-colors inline-block border-b border-primary/30 pb-1">
              Discover My Mission
            </Link>
          </div>
          <div className="w-full md:w-1/2 glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-20 -mb-20" />
            <blockquote className="relative z-10 text-2xl font-serif text-primary leading-tight">
              "The stars do not compel, they incline. True freedom is found in understanding the cosmic forces at play."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Placeholder */}
      <section className="w-full py-24 px-4 bg-primary/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-primary/10 pb-6">
            <div>
              <h2 className="text-4xl font-serif font-bold text-primary mb-2">Latest Insights</h2>
              <p className="text-foreground/70">Deep dives into celestial events and spiritual practices.</p>
            </div>
            <Link href="/blog" className="hidden sm:block text-primary font-medium hover:text-secondary transition-colors">
              View All Posts →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((post) => (
              <div key={post} className="group cursor-pointer">
                <div className="w-full h-60 bg-white border border-primary/10 rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                    <span className="text-4xl opacity-50">✨</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                  <span>Astrology</span>
                  <span>•</span>
                  <span>5 Min Read</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                  The Impact of Saturn Return on Career and Vocation
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                  Understanding why the ages of 28-30 bring profound shifts in professional direction and how to navigate the cosmic pressure.
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/blog" className="text-primary font-medium">View All Posts →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
