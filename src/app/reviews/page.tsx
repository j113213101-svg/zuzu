import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "租客回饋｜租租" };

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-5xl px-5 pt-16 pb-10 text-center">
        <p className="zz-kicker">Tenant Reviews</p>
        <h1 className="zz-headline text-4xl md:text-6xl mt-3">租客回饋</h1>
        <div className="mt-6 text-5xl font-semibold tracking-tight">
          {avg.toFixed(1)}
          <span className="text-lg text-[var(--zz-fg-muted)] font-normal"> / 5.0</span>
        </div>
        <div className="text-yellow-500 mt-2">{"★".repeat(Math.round(avg))}</div>
        <div className="mt-2 text-sm text-[var(--zz-fg-muted)]">來自 {reviews.length} 位租客的真實回饋</div>
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-24">
        {reviews.length === 0 ? (
          <div className="zz-card p-12 text-center text-[var(--zz-fg-muted)]">尚無公開回饋。</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {reviews.map((r) => (
              <div key={r.id} className="zz-card p-7">
                <div className="text-yellow-500 text-sm">{"★".repeat(r.rating)}</div>
                <p className="mt-3 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-5 text-sm text-[var(--zz-fg-muted)]">
                  — {r.tenantName}{r.location ? `，${r.location}` : ""}
                  <span className="ml-2">{new Date(r.createdAt).toLocaleDateString("zh-TW")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
