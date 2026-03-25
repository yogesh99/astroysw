"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface LikeButtonProps {
  contentType: "blog" | "knowledge";
  contentId: string;
  initialCount?: number;
}

export default function LikeButton({ contentType, contentId, initialCount = 0 }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`like_${contentType}_${contentId}`);
    if (stored) setLiked(true);

    fetch(`${API_URL}/likes/${contentType}/${contentId}`)
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(() => {});
  }, [contentType, contentId]);

  const handleSubmitLike = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          name,
          email,
        }),
      });

      if (res.ok) {
        setLiked(true);
        setCount(c => c + 1);
        setShowForm(false);
        localStorage.setItem(`like_${contentType}_${contentId}`, "true");
      } else if (res.status === 409) {
        setError("You have already liked this!");
        setLiked(true);
        localStorage.setItem(`like_${contentType}_${contentId}`, "true");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect to server.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => {
          if (liked) return;
          setShowForm(!showForm);
        }}
        className={`group flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 shadow-sm ${
          liked
            ? "bg-red-50 border-red-200 cursor-default"
            : "bg-white border-primary/15 hover:border-secondary/50 hover:shadow-md cursor-pointer"
        }`}
      >
        <motion.span
          animate={liked ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
          className="text-2xl"
        >
          {liked ? "❤️" : "🤍"}
        </motion.span>
        <span className={`font-medium text-sm ${liked ? "text-red-500" : "text-foreground/70 group-hover:text-primary"}`}>
          {liked ? "Liked!" : "Like this article"}
        </span>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
          liked ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
        }`}>
          {count}
        </span>
      </motion.button>

      <AnimatePresence>
        {showForm && !liked && (
          <motion.form
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            onSubmit={handleSubmitLike}
            className="w-full max-w-sm glass-card p-6 space-y-4 overflow-hidden"
          >
            <p className="text-sm text-foreground/60 text-center mb-2">Share your name and email to leave your cosmic mark ✨</p>
            <input
              required
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
            <input
              required
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-primary/15 text-foreground/60 text-sm font-medium hover:bg-primary/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors shadow-md shadow-primary/20 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "❤️ Confirm Like"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
