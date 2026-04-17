import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await prisma.property.findMany({
    where: { status: "available" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { agent: true },
  });

  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="zz-fade-in">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-28 pb-24 text-center">
          <p className="zz-kicker">
            <span className="zz-rule" />台中 · 租屋誌<span className="zz-rule" />
          </p>
          <h1 className="zz-headline text-[44px] md:text-[96px] mt-8">
            住進一個<br />
            <em className="not-italic" style={{ color: "var(--zz-terracotta-deep)" }}>剛剛好</em>的家
          </h1>
          <p className="mt-8 text-[15px] md:text-lg text-[var(--zz-fg-muted)] max-w-xl mx-auto leading-[1.85]">
            從逢甲到勤美，從小資套房到精品整層。
            <br />
            我們親自走過每一間，把對的房子交給對的人。
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Link href="/listings" className="zz-btn zz-btn-primary">
              開始找房
            </Link>
            <Link href="/subsidy" className="zz-btn zz-btn-ghost">
              試算補助 →
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto border-t border-[var(--zz-line)] pt-10">
            {[
              { n: "5,000+", l: "精選房源" },
              { n: "98%", l: "租客滿意" },
              { n: "24hr", l: "線上回應" },
              { n: "0 元", l: "看房諮詢" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>{s.n}</div>
                <div className="text-xs text-[var(--zz-fg-muted)] mt-2 tracking-[0.2em] uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--zz-bg-soft)] py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-end justify-between mb-12 border-b border-[var(--zz-line)] pb-6">
            <div>
              <p className="zz-kicker">Featured · 本日精選</p>
              <h2 className="zz-headline text-3xl md:text-5xl mt-3">剛上線的好房</h2>
            </div>
            <Link href="/listings" className="zz-btn zz-btn-ghost hidden md:inline-flex">
              看全部 →
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="zz-card p-10 text-center text-[var(--zz-fg-muted)]">
              後台還沒有房源，仲介登入後新增即可在此展示。
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-16">
            <p className="zz-kicker">Why zuzu</p>
            <h2 className="zz-headline text-3xl md:text-5xl mt-3">把找房這件事做細</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "親自看過每一間",
                d: "每一個刊登上架的房源，都由租租顧問實地勘察、拍攝，確認屋況、採光與周邊才公開。",
              },
              {
                t: "一對一媒合",
                d: "告訴我們預算與生活習慣，顧問會從上千個房源中挑出 3-5 間，帶你一次看完。",
              },
              {
                t: "搬家、補助都幫你",
                d: "合作搬家公司、租屋補助申請協助、合約諮詢——搬進去之前的每一步我們都在。",
              },
            ].map((f) => (
              <div key={f.t} className="zz-card p-8">
                <div className="text-2xl font-semibold tracking-tight">{f.t}</div>
                <p className="mt-3 text-[var(--zz-fg-muted)] leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="bg-[var(--zz-bg-soft)] py-28">
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center mb-16">
              <p className="zz-kicker">Tenant Stories</p>
              <h2 className="zz-headline text-3xl md:text-5xl mt-3">他們在租租找到了家</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="zz-card p-8">
                  <div className="text-yellow-500 text-sm">{"★".repeat(r.rating)}</div>
                  <p className="mt-3 leading-relaxed text-[var(--zz-fg)]">&ldquo;{r.quote}&rdquo;</p>
                  <div className="mt-5 text-sm text-[var(--zz-fg-muted)]">
                    — {r.tenantName}{r.location ? `，${r.location}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-28">
        <div className="mx-auto max-w-5xl px-5">
          <div className="rounded-[var(--zz-radius-lg)] p-12 md:p-20 text-center" style={{ background: "var(--zz-bg-warm)" }}>
            <p className="zz-kicker">
              <span className="zz-rule" />Get in touch<span className="zz-rule" />
            </p>
            <h2 className="zz-headline text-3xl md:text-5xl mt-6" style={{ color: "var(--zz-fg)" }}>
              把找房這件事<br/>交給懂台中的人
            </h2>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/contact" className="zz-btn zz-btn-primary">線上預約</Link>
              <Link href="/listings" className="zz-btn zz-btn-ghost">瀏覽房源 →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
