"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
// Triggering deployment for security fix validation

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "edit" | "likes" | "subscribers" | "contacts">("list");
  
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
      fetchSubscribers(saved);
      fetchContacts(saved);
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
        fetchSubscribers(data.access_token);
        fetchContacts(data.access_token);
      } else {
        alert("Login failed. Invalid username or cosmic alignment (password).");
      }
    } catch(err) {
      alert("Network or CORS error connecting to the cosmic core (backend). Please check your Render configuration.");
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

  const fetchSubscribers = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/subscribers`, { headers: { Authorization: `Bearer ${authToken}` } });
      if (res.ok) setSubscribers(await res.json());
    } catch(e) { }
  };

  const fetchContacts = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/contacts`, { headers: { Authorization: `Bearer ${authToken}` } });
      if (res.ok) setContacts(await res.json());
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
    <div className="py-6 sm:py-8 max-w-7xl mx-auto w-full px-2 sm:px-4">
      <div className="flex flex-col gap-4 mb-8 sm:mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Command Center</h1>
          <div className="flex gap-2 sm:gap-4">
            {view === "edit" && <button onClick={() => setView("list")} className="px-4 sm:px-6 py-2 bg-white border border-primary/20 text-primary rounded-full font-medium hover:bg-primary/5 transition-all text-sm">Cancel</button>}
            <button onClick={() => { setToken(""); localStorage.removeItem("admin_token"); }} className="px-4 sm:px-6 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-full font-medium transition-all text-sm">Logout</button>
          </div>
        </div>
        {view !== "edit" && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1 -mx-2 px-2">
            <div className="flex rounded-full border border-primary/15 overflow-hidden shrink-0">
              <button onClick={() => setView("list")} className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${view === "list" ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}>Posts</button>
              <button onClick={() => { setView("likes"); fetchLikes(token); }} className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${view === "likes" ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}>Likes ({likes.length})</button>
              <button onClick={() => { setView("subscribers"); fetchSubscribers(token); }} className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${view === "subscribers" ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}>Subs ({subscribers.length})</button>
              <button onClick={() => { setView("contacts"); fetchContacts(token); }} className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${view === "contacts" ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}>Msgs ({contacts.length})</button>
            </div>
            {view === "list" && <button onClick={() => openEditor()} className="px-4 sm:px-6 py-2 bg-secondary hover:bg-secondary-light text-white rounded-full font-medium shadow-md transition-all text-xs sm:text-sm whitespace-nowrap shrink-0">+ New Post</button>}
          </div>
        )}
      </div>

      {view === "list" && (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm whitespace-nowrap">Title</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm whitespace-nowrap hidden sm:table-cell">Status</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm whitespace-nowrap hidden md:table-cell">Date</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(b => (
                <tr key={b.slug} className="border-t border-primary/5 hover:bg-primary/[0.02]">
                  <td className="p-3 sm:p-5">
                    <span className="font-bold text-primary text-sm sm:text-base">{b.title}</span>
                    <div className="sm:hidden flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${b.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {b.published ? "Live" : "Draft"}
                      </span>
                      <span className="text-[10px] text-foreground/40">{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-3 sm:p-5 hidden sm:table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${b.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {b.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 sm:p-5 text-sm text-foreground/50 hidden md:table-cell">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 sm:p-5 text-right space-x-3 sm:space-x-4">
                    <button onClick={() => openEditor(b.slug)} className="text-primary font-medium hover:text-secondary transition-colors text-sm">Edit</button>
                    <button onClick={() => handleDelete(b.slug)} className="text-red-400 font-medium hover:text-red-600 transition-colors text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-foreground/50">No cosmic insights found. Time to create one.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {view === "edit" && (
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 min-h-[50vh] lg:min-h-[70vh]">
          {/* Editor */}
          <div className="flex flex-col gap-4 sm:gap-5 glass-card p-4 sm:p-6">
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
            <div className="flex-1 bg-white p-4 sm:p-8 overflow-y-auto prose prose-primary prose-a:text-secondary max-w-none">
              <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-primary mb-4 sm:mb-6 leading-tight border-b border-primary/10 pb-4">{title || "Untitled Transmission"}</h1>
              <ReactMarkdown>{content || "*Write something magical...*"}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {view === "likes" && (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">Name</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">Email</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">Type</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">Content</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {likes.map(l => (
                <tr key={l.id} className="border-t border-primary/5 hover:bg-primary/[0.02]">
                  <td className="p-3 sm:p-5 font-medium text-sm">{l.name}</td>
                  <td className="p-3 sm:p-5 text-xs sm:text-sm text-foreground/70">{l.email}</td>
                  <td className="p-3 sm:p-5">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase ${l.content_type === 'blog' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {l.content_type}
                    </span>
                  </td>
                  <td className="p-3 sm:p-5 text-xs sm:text-sm text-foreground/60">{l.content_id}</td>
                  <td className="p-3 sm:p-5 text-xs sm:text-sm text-foreground/50">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {likes.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-foreground/50">No cosmic likes received yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {view === "subscribers" && (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">#</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">Email</th>
                <th className="p-3 sm:p-5 font-serif font-bold text-primary text-sm">Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id} className="border-t border-primary/5 hover:bg-primary/[0.02]">
                  <td className="p-3 sm:p-5 text-foreground/50 font-medium text-sm">{i + 1}</td>
                  <td className="p-3 sm:p-5 font-medium text-sm">{s.email}</td>
                  <td className="p-3 sm:p-5 text-xs sm:text-sm text-foreground/50">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {subscribers.length === 0 && <tr><td colSpan={3} className="p-12 text-center text-foreground/50">No subscribers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {view === "contacts" && (
        <div className="space-y-4">
          {contacts.map(c => (
            <div key={c.id} className="glass-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-primary">{c.name}</span>
                  <span className="text-foreground/50 text-sm ml-3">{c.email}</span>
                </div>
                <span className="text-xs text-foreground/40">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">{c.message}</p>
            </div>
          ))}
          {contacts.length === 0 && <div className="glass-card p-12 text-center text-foreground/50">No messages received yet.</div>}
        </div>
      )}
    </div>
  );
}
