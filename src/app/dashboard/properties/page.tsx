import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseImages } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MyProperties() {
  const session = (await getSession())!;
  const properties = await prisma.property.findMany({
    where: { agentId: session.sub },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="zz-kicker">Properties</p>
          <h1 className="zz-headline text-3xl md:text-4xl mt-2">我的房源</h1>
        </div>
        <Link href="/dashboard/properties/new" className="zz-btn zz-btn-primary">+ 新增房源</Link>
      </div>

      {properties.length === 0 ? (
        <div className="zz-card p-16 text-center">
          <p className="text-lg font-medium">還沒有任何房源</p>
          <p className="mt-2 text-[var(--zz-fg-muted)]">點「新增房源」開始刊登。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => {
            const cover = parseImages(p.images)[0];
            return (
              <Link
                key={p.id}
                href={`/dashboard/properties/${p.id}`}
                className="zz-card p-4 flex items-center gap-4"
              >
                <div className="w-24 h-20 bg-[var(--zz-bg-soft)] rounded-lg overflow-hidden shrink-0">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-[var(--zz-fg-muted)] mt-1">
                    {p.district} · {p.propertyType} · {p.area} 坪 · NT$ {formatPrice(p.price)}
                  </div>
                </div>
                <span
                  className="zz-chip shrink-0"
                  data-active={p.status === "available"}
                >
                  {p.status === "available" ? "上架中" : p.status === "rented" ? "已出租" : "下架"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
