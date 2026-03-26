import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const BACKEND_URL = API_URL.replace(/\/api$/, "");

function resolveImageUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}

function stripFrontmatter(content: string): string {
  const trimmed = content.trim();
  if (trimmed.startsWith('---')) {
    const end = trimmed.indexOf('---', 3);
    if (end !== -1) {
      return trimmed.slice(end + 3).trim();
    }
  }
  return content;
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let blog = null;
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, { cache: "no-store", next: { revalidate: 0 } });
    if (!res.ok) return notFound();
    blog = await res.json();
  } catch (e) {
    return notFound();
  }

  const cleanContent = stripFrontmatter(blog.content);

  return (
    <article className="w-full max-w-3xl mx-auto py-12 px-4">
      <Link href="/blog" className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-2 mb-10 transition-colors">
        <span>←</span> Back to all insights
      </Link>
      
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-6">
          <span>{blog.meta.category}</span>
          <span>•</span>
          <span>{blog.meta.readTime}</span>
          <span>•</span>
          <span>{new Date(blog.meta.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-primary leading-tight mb-8">
          {blog.meta.title}
        </h1>
        {blog.meta.featuredImage ? (
           <div className="w-full aspect-video rounded-2xl overflow-hidden bg-primary/5">
              <img src={resolveImageUrl(blog.meta.featuredImage)} alt={blog.meta.title} className="w-full h-full object-cover" />
           </div>
        ) : (
           <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
              <span className="text-6xl opacity-30">✨</span>
           </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none leading-loose
        prose-headings:text-primary prose-headings:font-serif
        prose-p:text-foreground/80 prose-p:font-light prose-p:text-[1.1rem]
        prose-strong:text-primary/90
        prose-li:text-foreground/80
        prose-a:text-secondary hover:prose-a:text-primary
      ">
        <MDXRemote source={cleanContent} />
      </div>

      <div className="flex items-center justify-center gap-6 flex-wrap mt-10 mb-4">
        <LikeButton contentType="blog" contentId={slug} />
        <ShareButton title={blog.meta.title} />
      </div>
    </article>
  );
}
