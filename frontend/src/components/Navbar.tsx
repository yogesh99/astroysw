"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Knowledge", path: "/knowledge" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 glass-card !rounded-none !border-x-0 !border-t-0 shadow-sm transition-all bg-white/60">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
          <Image src="/logo.png" alt="AstroYSW Logo" width={80} height={80} className="object-contain" priority />
        </Link>
        
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== "/" && pathname?.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`relative font-medium text-sm transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-secondary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        
        <button 
          className="md:hidden text-primary p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg transition-colors bg-primary/5 hover:bg-primary/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-20 left-0 w-full overflow-hidden bg-white/95 backdrop-blur-xl border-b border-primary/10 shadow-xl z-40"
          >
            <div className="flex flex-col px-6 py-8 space-y-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || (link.path !== "/" && pathname?.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-2xl font-serif font-bold transition-all ${
                      isActive ? "text-secondary translate-x-3" : "text-primary hover:text-secondary hover:translate-x-3"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
