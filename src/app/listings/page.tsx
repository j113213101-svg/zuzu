import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/PropertyCard";
import { DISTRICTS, BUDGET_TIERS, PROPERTY_TYPES } from "@/lib/format";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SearchParams = {
  district?: string;
  type?: string;
  budget?: string;
  pet?: string;
  subsidy?: string;
  q?: string;
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const where: Prisma.PropertyWhereInput = { status: "available" };
  if (sp.district) where.district = sp.district;
  if (sp.type) where.propertyType = sp.type;
  if (sp.pet === "1") where.petFriendly = true;
  if (sp.subsidy === "1") where.allowSubsidy = true;
  if (sp.budget === "budget") where.price = { lt: 12000 };
  if (sp.budget === "standard") where.price = { gte: 12000, lte: 20000 };
  if (sp.budget === "premium") where.price = { gt: 20000 };
  if (sp.q) where.title = { contains: sp.q };

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { agent: true },
    take: 60,
  });

  const build = (patch: Partial<SearchParams>) => {
    const merged = { ...sp, ...patch };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "") params.set(k, v as string);
    }
    const s = params.toString();
    return s ? `/listings?${s}` : "/listings";
  };

  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-7xl px-5 pt-14 pb-8">
        <p className="zz-kicker">精選房源</p>
        <h1 className="zz-headline text-4xl md:text-6xl mt-2">探索 {properties.length} 間租租上的家</h1>
        <p className="mt-4 text-[var(--zz-fg-muted)] max-w-2xl">
          所有房源都由租租顧問親自看過。使用下方篩選器找出最適合你的空間。
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-8 space-y-4">
        <form method="GET" className="flex gap-2">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="搜尋標題、區域、生活圈..."
            className="zz-input flex-1"
          />
          <button className="zz-btn zz-btn-primary">搜尋</button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Link href="/listings" className="zz-chip" data-active={!sp.district}>全部區域</Link>
          {DISTRICTS.map((d) => (
            <Link key={d} href={build({ district: d })} className="zz-chip" data-active={sp.district === d}>
              {d}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {BUDGET_TIERS.map((b) => (
            <Link
              key={b.value}
              href={build({ budget: b.value === "all" ? undefined : b.value })}
              className="zz-chip"
              data-active={b.value === "all" ? !sp.budget : sp.budget === b.value}
            >
              {b.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={build({ type: undefined })} className="zz-chip" data-active={!sp.type}>不限類型</Link>
          {PROPERTY_TYPES.map((t) => (
            <Link key={t} href={build({ type: t })} className="zz-chip" data-active={sp.type === t}>
              {t}
            </Link>
          ))}
          <Link href={build({ pet: sp.pet === "1" ? undefined : "1" })} className="zz-chip" data-active={sp.pet === "1"}>
            可寵物
          </Link>
          <Link href={build({ subsidy: sp.subsidy === "1" ? undefined : "1" })} className="zz-chip" data-active={sp.subsidy === "1"}>
            可申請補助
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-24">
        {properties.length === 0 ? (
          <div className="zz-card p-16 text-center">
            <p className="text-lg font-medium">沒有找到符合條件的房源</p>
            <p className="mt-2 text-[var(--zz-fg-muted)]">調整篩選條件，或直接<Link className="text-[var(--zz-accent)]" href="/contact">聯絡租租顧問</Link>，讓我們幫你找。</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
