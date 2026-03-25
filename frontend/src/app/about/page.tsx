"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="w-full py-12">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-serif font-bold text-primary mb-6">My Philosophy</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed">
          Bridging the ancient wisdom of the stars with modern psychological depth to awaken your highest potential.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-16 items-center mb-24">
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-primary/5 rounded-full relative p-8 flex items-center justify-center overflow-hidden border border-primary/10">
            <div className="absolute inset-0 cosmic-bg opacity-50" />
            <div className="relative z-10 w-full h-full rounded-full border border-primary/20 p-8 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full border border-secondary/30 relative">
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-secondary rounded-full -mt-1.5 -ml-1.5 shadow-[0_0_15px_3px_#f4b223]" />
                <div className="absolute bottom-0 right-1/4 w-4 h-4 bg-primary rounded-full -mb-2 -mr-2 shadow-[0_0_15px_3px_#3b52a4]" />
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-secondary-light rounded-full -ml-1 -mt-1 shadow-[0_0_8px_1px_#f6c558]" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">The Journey to AstroYSW</h2>
          <div className="space-y-6 text-lg text-foreground/80 font-light leading-relaxed">
            <p>
              I began exploring astrology not as a way to predict the future, but as a map to understand myself. Like many, I was skeptical of generic sun-sign horoscopes. But when I discovered the profound depth of the natal chart, the exact cosmic blueprint of the moment I was born, everything changed.
            </p>
            <p>
              AstroYSW was born from a desire to strip away the superstition surrounding astrology. I wanted to create a sanctuary where astrology is treated with the intellectual rigor and spiritual reverence it deserves.
            </p>
            <p>
              My mission is simple: to provide you with the knowledge and tools to decode your own cosmic blueprint. I believe that true healing begins when you align your life with the intentions of your soul.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-16">
        <h2 className="text-3xl font-serif font-bold text-primary mb-12 text-center">My Spiritual Pillars</h2>
        
        <div className="relative border-l-2 border-primary/20 pl-8 ml-4 md:ml-0 space-y-16">
          <div className="relative">
            <div className="absolute w-4 h-4 bg-secondary rounded-full -left-[41px] top-1 shadow-[0_0_10px_rgba(244,178,35,0.5)]" />
            <h3 className="text-2xl font-serif font-bold text-primary mb-3">1. Authenticity Over Prediction</h3>
            <p className="text-foreground/70 leading-relaxed font-light text-lg">I focus on psychological integration and self-awareness rather than fear-based predictions. You have free will; the chart simply shows the weather conditions.</p>
          </div>
          
          <div className="relative">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[41px] top-1 shadow-[0_0_10px_rgba(59,82,164,0.5)]" />
            <h3 className="text-2xl font-serif font-bold text-primary mb-3">2. Depth & Rigor</h3>
            <p className="text-foreground/70 leading-relaxed font-light text-lg">I respect the ancient traditions while applying them to modern life. My content is thoroughly researched, profound, and thought-provoking.</p>
          </div>
          
          <div className="relative">
            <div className="absolute w-4 h-4 bg-secondary rounded-full -left-[41px] top-1 shadow-[0_0_10px_rgba(244,178,35,0.5)]" />
            <h3 className="text-2xl font-serif font-bold text-primary mb-3">3. Empowerment Through Karma</h3>
            <p className="text-foreground/70 leading-relaxed font-light text-lg">I view challenges in the chart not as punishments, but as karmic assignments designed for your soul's ultimate evolution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
