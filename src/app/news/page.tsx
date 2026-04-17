import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "最新消息｜租租" };

export default async function NewsIndex() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-5xl px-5 pt-16 pb-10 text-center">
        <p className="zz-kicker">Latest</p>
        <h1 className="zz-headline text-4xl md:text-6xl mt-3">最新消息</h1>
      </div>
      <div className="mx-auto max-w-4xl px-5 pb-24 space-y-4">
        {news.length === 0 ? (
          <div className="zz-card p-12 text-center text-[var(--zz-fg-muted)]">目前沒有消息。</div>
        ) : (
          news.map((n) => (
            <Link key={n.id} href={`/news/${n.slug}`} className="zz-card p-6 flex items-center justify-between gap-4 group">
              <div>
                <div className="text-xs text-[var(--zz-fg-muted)]">
                  {new Date(n.createdAt).toLocaleDateString("zh-TW")}
                </div>
                <div className="mt-1 font-semibold text-lg">{n.title}</div>
                <div className="mt-1 text-sm text-[var(--zz-fg-muted)] line-clamp-1">{n.excerpt}</div>
              </div>
              <div className="text-[var(--zz-accent)] shrink-0">→</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
