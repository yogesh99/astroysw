import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const BACKEND_URL = API_URL.replace(/\/api$/, "");

function resolveImageUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}

export default async function BlogListing() {
  let blogs = [];
  try {
    const res = await fetch(`${API_URL}/blogs`, { cache: "no-store", next: { revalidate: 0 } });
    if (res.ok) blogs = await res.json();
  } catch (e) {
    console.error("Failed to fetch blogs");
  }

  return (
    <div className="w-full py-12 max-w-5xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-primary mb-6">Cosmic Insights</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light">
          Explorations on astrology, spirituality, and living in alignment with your true self.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog: any) => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group block h-full">
            <div className="glass-card p-6 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="w-full h-48 bg-primary/5 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center">
                {blog.featuredImage ? (
                  <img src={resolveImageUrl(blog.featuredImage)} alt={blog.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <span className="text-4xl opacity-30 group-hover:scale-110 transition-transform duration-700">✨</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                <span>{blog.category}</span>
                <span>•</span>
                <span>{blog.readTime}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                {blog.title}
              </h2>
              <p className="text-foreground/70 text-sm leading-relaxed mb-4 flex-grow">
                {blog.excerpt}
              </p>
              <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Article <span className="text-secondary">→</span>
              </span>
            </div>
          </Link>
        ))}
        {blogs.length === 0 && (
          <div className="col-span-3 text-center py-20 text-foreground/50">
            No cosmic insights published yet. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
