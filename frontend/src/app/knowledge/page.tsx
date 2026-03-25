"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = ["All", "Basics", "Advanced Astrology", "Spiritual Growth", "Remedies", "Predictions"];

const articles = [
  { id: 1, title: "Understanding Your Sun, Moon, and Rising", category: "Basics", readTime: "8 min read", desc: "The foundational trinity of your personality and soul's expression." },
  { id: 2, title: "The North Node: Your Karmic Destiny", category: "Spiritual Growth", readTime: "12 min read", desc: "Unlock the purpose your soul came to fulfill in this lifetime." },
  { id: 3, title: "Navigating Saturn Return", category: "Advanced Astrology", readTime: "15 min read", desc: "How to handle the deep structural changes of your late 20s." },
  { id: 4, title: "Vedic Remedies for Weak Planets", category: "Remedies", readTime: "10 min read", desc: "Mantras, gemstones, and lifestyle shifts to balance planetary energies." },
  { id: 5, title: "Jupiter Transits 2024", category: "Predictions", readTime: "7 min read", desc: "Where will you find luck, expansion, and wisdom this year?" },
  { id: 6, title: "The 12 Houses Explained", category: "Basics", readTime: "20 min read", desc: "A comprehensive guide to the arenas of life in your natal chart." },
];

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState("All");
  
  const filtered = activeTab === "All" ? articles : articles.filter(a => a.category === activeTab);

  return (
    <div className="w-full py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-primary mb-6">Knowledge Hub</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light">
          Deepen your understanding of the cosmic forces shaping your reality.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === cat 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "bg-white/50 text-foreground/70 border border-primary/10 hover:border-primary/30 hover:bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {filtered.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-xs text-foreground/50 font-medium">{article.readTime}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-primary mb-3 group-hover:text-secondary-light transition-colors">
              {article.title}
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-grow">
              {article.desc}
            </p>
            <Link href={`/knowledge/${article.id}`} className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Begin Journey <span className="text-secondary">→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
