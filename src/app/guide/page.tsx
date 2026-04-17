import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "租租指南｜租屋知識庫" };

export default async function GuideIndex() {
  const guides = await prisma.guide.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const byCategory = guides.reduce<Record<string, typeof guides>>((acc, g) => {
    (acc[g.category] ||= []).push(g);
    return acc;
  }, {});

  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-5xl px-5 pt-16 pb-10 text-center">
        <p className="zz-kicker">Zuzu Guide</p>
        <h1 className="zz-headline text-4xl md:text-6xl mt-3">租租指南</h1>
        <p className="mt-5 text-[var(--zz-fg-muted)] max-w-2xl mx-auto">
          第一次租屋、補助申請、合約重點、搬家清單——我們把在台中租屋會遇到的每件事寫在這裡。
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-24 space-y-16">
        {Object.keys(byCategory).length === 0 && (
          <div className="zz-card p-16 text-center text-[var(--zz-fg-muted)]">
            指南內容整理中，很快上線。
          </div>
        )}
        {Object.entries(byCategory).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">{cat}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {items.map((g) => (
                <Link key={g.id} href={`/guide/${g.slug}`} className="zz-card p-6 block">
                  <div className="text-xs text-[var(--zz-fg-muted)]">{g.category}</div>
                  <div className="mt-2 text-xl font-semibold tracking-tight">{g.title}</div>
                  <div className="mt-3 text-sm text-[var(--zz-accent)]">閱讀全文 →</div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
