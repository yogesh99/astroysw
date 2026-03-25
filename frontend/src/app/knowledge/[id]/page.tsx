import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";

const knowledgeData: Record<string, any> = {
  "1": {
    title: "Understanding Your Sun, Moon, and Rising",
    category: "Basics",
    readTime: "8 min read",
    content: `
The "Big Three" in astrology, your Sun, Moon, and Rising signs, form the architectural foundation of your cosmic blueprint. While popular astrology often reduces you to your Sun sign, true astrologers know that these three celestial points work in dynamic interplay to shape your identity.

## The Sun: Your Core Identity

Representing your ego, life force, and core essence, the Sun is what you are learning to become in this lifetime. It is the conscious mind.

## The Moon: Your Inner World

The Moon governs your emotional needs, unconscious habits, and what makes you feel safe. It is the private self that only your closest loved ones truly see.

## The Rising (Ascendant): Your Arrival

Your Rising sign is the mask you wear, the first impression you make, and the lens through which you view the world. It sets the structure of your entire birth chart.`
  },
  "2": {
    title: "The North Node: Your Karmic Destiny",
    category: "Spiritual Growth",
    readTime: "12 min read",
    content: `
The Lunar Nodes are mathematical points in space where the moon's orbit crosses the ecliptic. In evolutionary astrology, they are the compass for your soul's journey.

## The South Node: Your Comfort Zone

This represents past-life karma, innate talents, and safety. While you excel at South Node traits, staying here leads to spiritual stagnation.

## The North Node: Your True North

Your North Node points to the ultimate lessons you are meant to learn. Moving toward it often feels uncomfortable, awkward, and challenging, but it is the secret to profound fulfillment and cosmic alignment.`
  },
  "3": {
    title: "Navigating Saturn Return",
    category: "Advanced Astrology",
    readTime: "15 min read",
    content: `
Every 28 to 30 years, Saturn returns to the exact degree it was at when you were born. This cosmic milestone marks the true transition into astrological adulthood.

## The First Return (Ages 28-30)

This period strips away everything that is out of alignment with your authentic self. Relationships, careers, and belief systems that no longer serve you will face immense pressure. It is a time of taking full responsibility for your actions and the structures of your life.

## How to Prepare

Do not fear Saturn. While it is the taskmaster of the zodiac, its ultimate goal is to ensure your foundations are solid. Embrace discipline, face your fears, and honor your commitments.`
  },
  "4": {
    title: "Vedic Remedies for Weak Planets",
    category: "Remedies",
    readTime: "10 min read",
    content: `
When a planet is debilitated or afflicted by malefic aspects, its energy can manifest negatively in your life. Vedic astrology (Jyotish) offers practical, spiritual remedies to harmonize these cosmic forces.

## Mantras

Chanting the specific sound frequency (Bija Mantra) associated with a planet can align your vibration with its higher expression.

## Gemstones

Wearing untreated, high-quality gemstones can amplify the beneficial rays of weak, positive planets. However, always consult an experienced astrologer before prescribing stones to yourself.`
  },
  "5": {
    title: "Jupiter Transits 2024",
    category: "Predictions",
    readTime: "7 min read",
    content: `
Jupiter, the planet of expansion, luck, and higher wisdom, shifts completely through a zodiac sign approximately every 12 months.

Understanding where Jupiter is currently transiting your natal chart allows you to harness its blessing where it matters most. Look for the house Jupiter occupies to know where you will experience unparalleled growth, serendipitous opportunities, and profound learning this year.`
  },
  "6": {
    title: "The 12 Houses Explained",
    category: "Basics",
    readTime: "20 min read",
    content: `
If the planets are the actors and the signs are their costumes, the houses are the stages where the play unfolds.

## The Setup

Your chart is divided into 12 segments, determined strictly by your exact time of birth.
- **House 1**: Self, Identity, Appearance
- **House 4**: Home, Roots, Ancestry
- **House 7**: Partnerships, Marriage, Open Enemies
- **House 10**: Career, Public Status, Authority

Understanding precisely which planets reside in which houses reveals exactly *where* their cosmic energies will manifest in your daily life.`
  }
};

export default async function KnowledgeArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = knowledgeData[id];

  if (!article) return notFound();

  return (
    <article className="w-full max-w-3xl mx-auto py-12 px-4">
      <Link href="/knowledge" className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-2 mb-10 transition-colors">
        <span>←</span> Back to Knowledge Hub
      </Link>
      
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-6">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-primary leading-tight mb-8">
          {article.title}
        </h1>
        {/* Reading progress bar decoration */}
        <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden mb-8">
           <div className="h-full bg-gradient-to-r from-secondary to-primary w-1/3 rounded-full"></div>
        </div>
      </header>

      <div className="prose prose-lg prose-primary max-w-none text-foreground/80 leading-loose">
        {article.content.split('\n\n').map((paragraph: string, i: number) => {
          if (!paragraph.trim()) return null;
          if (paragraph.trim().startsWith('## ')) {
            return <h2 key={i} className="text-3xl font-bold text-primary mt-12 mb-6 font-serif inline-block border-b-2 border-secondary/30 pb-2">{paragraph.trim().replace('## ', '')}</h2>;
          }
          if (paragraph.trim().startsWith('- ')) {
            const items = paragraph.trim().split('\n');
            return (
              <ul key={i} className="list-disc pl-6 space-y-3 mb-8">
                {items.map((item, j) => {
                  const cleaned = item.trim().replace(/^- /, '');
                  const html = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
                  return <li key={j} dangerouslySetInnerHTML={{ __html: html }} />;
                })}
              </ul>
            );
          }
          return <p key={i} className="mb-6 font-light text-[1.1rem] leading-relaxed">{paragraph.trim()}</p>;
        })}
      </div>

      <div className="flex items-center justify-center gap-6 flex-wrap mt-10 mb-4">
        <LikeButton contentType="knowledge" contentId={id} />
        <ShareButton title={article.title} />
      </div>
      
      <div className="mt-16 p-8 glass-card border-t border-primary/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <h3 className="text-2xl font-serif font-bold text-primary mb-4 relative z-10">Deepen Your Cosmic Practice</h3>
        <p className="text-foreground/70 mb-8 relative z-10 leading-relaxed font-light">Intrigued by this concept? My personal readings can help you find exactly where these placements land in your specific chart.</p>
        <Link href="/contact" className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-light transition-all inline-block shadow-lg shadow-primary/20 relative z-10">
          Book a Reading
        </Link>
      </div>
    </article>
  );
}
