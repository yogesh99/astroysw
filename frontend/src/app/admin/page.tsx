"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "edit" | "likes">("list");
  
  // Editor state
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      fetchBlogs(saved);
      fetchLikes(saved);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem("admin_token", data.access_token);
        fetchBlogs(data.access_token);
        fetchLikes(data.access_token);
      } else {
        alert("Login failed. Use admin / astro2026");
      }
    } catch(e) {
      alert("Network error connecting to backend.");
    }
  };

  const fetchBlogs = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/blogs?admin=true`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else if (res.status === 401) {
        setToken("");
        localStorage.removeItem("admin_token");
      }
    } catch(e) { }
  };

  const fetchLikes = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/likes`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data);
      }
    } catch(e) { }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("slug", slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("published", published.toString());
    
    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        fetchBlogs(token);
        setView("list");
      }
    } catch(e) { alert("Error saving."); }
  };

  const handleDelete = async (deleteSlug: string) => {
    if (!confirm("Are you sure you want to delete this cosmic insight?")) return;
    try {
      const res = await fetch(`${API_URL}/blogs/${deleteSlug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchBlogs(token);
    } catch(e) {}
  };

  const openEditor = async (existingSlug?: string) => {
    if (existingSlug) {
      try {
        const res = await fetch(`${API_URL}/blogs/${existingSlug}`);
        if (res.ok) {
          const data = await res.json();
          setSlug(data.meta.slug);
          setTitle(data.meta.title);
          setExcerpt(data.meta.excerpt);
          setContent(data.content);
          setPublished(data.meta.published);
        }
      } catch(e) {}
    } else {
      setSlug("");
      setTitle("");
      setExcerpt("");
      setContent("");
      setPublished(false);
    }
    setView("edit");
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <form onSubmit={handleLogin} className="glass-card p-8 w-full max-w-sm space-y-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-primary">Admin Access</h2>
            <p className="text-sm text-foreground/50 mt-2">Enter credentials to align with the cosmic core.</p>
          </div>
          <input className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-medium transition-all shadow-md">Authenticate</button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl font-serif font-bold text-primary">AstroYSW Command Center</h1>
        <div className="flex gap-4 flex-wrap">
          {view !== "edit" && (
            <div className="flex rounded-full border border-primary/15 overflow-hidden">
              <button onClick={() => setView("list")} className={`px-5 py-2 text-sm font-medium transition-all ${view === "list" ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}>Posts</button>
              <button onClick={() => { setView("likes"); fetchLikes(token); }} className={`px-5 py-2 text-sm font-medium transition-all ${view === "likes" ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}>Likes ({likes.length})</button>
            </div>
          )}
          {view === "list" && <button onClick={() => openEditor()} className="px-6 py-2 bg-secondary hover:bg-secondary-light text-white rounded-full font-medium shadow-md transition-all">New Transmission</button>}
          {view === "edit" && <button onClick={() => setView("list")} className="px-6 py-2 bg-white border border-primary/20 text-primary rounded-full font-medium hover:bg-primary/5 transition-all">Cancel</button>}
          <button onClick={() => { setToken(""); localStorage.removeItem("admin_token"); }} className="px-6 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-full font-medium transition-all">Logout</button>
        </div>
      </div>

      {view === "list" && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="p-5 font-serif font-bold text-primary">Title</th>
                <th className="p-5 font-serif font-bold text-primary">Status</th>
                <th className="p-5 font-serif font-bold text-primary">Date</th>
                <th className="p-5 font-serif font-bold text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(b => (
                <tr key={b.slug} className="border-t border-primary/5 hover:bg-primary/[0.02]">
                  <td className="p-5 font-medium">{b.title}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${b.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {b.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-5 text-sm text-foreground/50">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-5 text-right space-x-4">
                    <button onClick={() => openEditor(b.slug)} className="text-primary font-medium hover:text-secondary transition-colors">Edit</button>
                    <button onClick={() => handleDelete(b.slug)} className="text-red-400 font-medium hover:text-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-foreground/50">No cosmic insights found. Time to create one.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {view === "edit" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[70vh]">
          {/* Editor */}
          <div className="flex flex-col gap-5 glass-card p-6 h-full">
            <input className="w-full px-4 py-3 border border-primary/20 bg-white/50 rounded-xl font-bold text-xl text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-foreground/30" placeholder="Transmission Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <input className="w-full px-4 py-2 border border-primary/10 bg-white/50 rounded-lg text-sm text-foreground/60 focus:outline-none focus:ring-1 focus:ring-secondary/50" placeholder="URL Slug (auto-generates if empty)" value={slug} onChange={e=>setSlug(e.target.value)} />
            <textarea className="w-full px-4 py-3 border border-primary/10 bg-white/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-secondary/50 resize-y" placeholder="Short excerpt for lists..." value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={2} />
            <div className="flex-1 min-h-[300px] flex flex-col relative rounded-xl border border-primary/20 overflow-hidden bg-white/50 focus-within:ring-2 focus-within:ring-secondary/50 transition-shadow">
               <div className="bg-primary/5 px-4 py-2 border-b border-primary/10 font-mono text-xs text-primary font-bold">Markdown Source (MDX Supported in Prod)</div>
               <textarea 
                 className="flex-1 w-full p-4 font-mono text-sm resize-none bg-transparent focus:outline-none leading-relaxed" 
                 placeholder="# The Cosmos Awaits..." 
                 value={content} 
                 onChange={e=>setContent(e.target.value)} 
               />
            </div>
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-primary/10">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-6 h-6 border-2 border-primary/30 rounded bg-white group-hover:border-primary transition-colors">
                  <input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} className="opacity-0 absolute inset-0 cursor-pointer" />
                  {published && <span className="text-secondary pointer-events-none font-bold text-lg leading-none -mt-1">✓</span>}
                </div>
                <span className="font-medium text-foreground/80">Publish publicly</span>
              </label>
              <button onClick={handleSave} className="px-8 py-3 bg-primary hover:bg-primary-light text-white rounded-full font-medium shadow-md shadow-primary/20 transition-all">
                Save Post
              </button>
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="h-full glass-card p-0 flex flex-col overflow-hidden">
            <div className="bg-primary px-6 py-3 font-serif font-bold text-white tracking-widest uppercase text-xs">Live Preview</div>
            <div className="flex-1 bg-white p-8 overflow-y-auto prose prose-primary prose-a:text-secondary max-w-none">
              <h1 className="text-4xl font-serif font-extrabold text-primary mb-6 leading-tight border-b border-primary/10 pb-4">{title || "Untitled Transmission"}</h1>
              <ReactMarkdown>{content || "*Write something magical...*"}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {view === "likes" && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="p-5 font-serif font-bold text-primary">Name</th>
                <th className="p-5 font-serif font-bold text-primary">Email</th>
                <th className="p-5 font-serif font-bold text-primary">Type</th>
                <th className="p-5 font-serif font-bold text-primary">Content</th>
                <th className="p-5 font-serif font-bold text-primary">Date</th>
              </tr>
            </thead>
            <tbody>
              {likes.map(l => (
                <tr key={l.id} className="border-t border-primary/5 hover:bg-primary/[0.02]">
                  <td className="p-5 font-medium">{l.name}</td>
                  <td className="p-5 text-sm text-foreground/70">{l.email}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${l.content_type === 'blog' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {l.content_type}
                    </span>
                  </td>
                  <td className="p-5 text-sm text-foreground/60">{l.content_id}</td>
                  <td className="p-5 text-sm text-foreground/50">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {likes.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-foreground/50">No cosmic likes received yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
