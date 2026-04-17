import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseImages, parseFeatures } from "@/lib/format";
import { InquiryForm } from "@/components/InquiryForm";

export const dynamic = "force-dynamic";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug: decodeURIComponent(slug) },
    include: { agent: true },
  });
  if (!property) notFound();

  const images = parseImages(property.images);
  const features = parseFeatures(property.features);

  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-6 text-sm">
        <Link href="/listings" className="text-[var(--zz-accent)]">← 回到房源列表</Link>
      </div>

      <section className="mx-auto max-w-6xl px-5">
        <div className="grid md:grid-cols-2 gap-3 rounded-[var(--zz-radius-lg)] overflow-hidden">
          <div className="aspect-[4/3] bg-[var(--zz-bg-soft)]">
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--zz-fg-muted)]">尚未上傳照片</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] bg-[var(--zz-bg-soft)] overflow-hidden">
                {images[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[i]} alt={`${property.title}-${i}`} className="w-full h-full object-cover" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="zz-chip">{property.district}</span>
            <span className="zz-chip">{property.propertyType}</span>
            {property.petFriendly && <span className="zz-chip">可寵物</span>}
            {property.allowSubsidy && <span className="zz-chip">可申請補助</span>}
          </div>
          <h1 className="zz-headline text-3xl md:text-5xl">{property.title}</h1>
          <div className="mt-3 text-[var(--zz-fg-muted)]">{property.address}</div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "月租金", v: `NT$ ${formatPrice(property.price)}` },
              { l: "坪數", v: `${property.area} 坪` },
              { l: "格局", v: property.layout },
              { l: "樓層", v: property.floor ?? "—" },
            ].map((m) => (
              <div key={m.l} className="zz-card p-5">
                <div className="text-xs text-[var(--zz-fg-muted)]">{m.l}</div>
                <div className="text-xl font-semibold mt-1">{m.v}</div>
              </div>
            ))}
          </div>

          <div className="zz-prose mt-10">
            <h2>關於這間房</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{property.description}</p>
          </div>

          {features.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">空間特色</h2>
              <div className="flex flex-wrap gap-2">
                {features.map((f) => (
                  <span key={f} className="zz-chip">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="md:sticky md:top-20 self-start">
          <div className="zz-card p-6">
            <div className="text-sm text-[var(--zz-fg-muted)]">月租金</div>
            <div className="text-4xl font-semibold tracking-tight mt-1">
              NT$ {formatPrice(property.price)}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-[var(--zz-fg-muted)]">專屬顧問</div>
              <div className="mt-1 font-medium">{property.agent.name}</div>
              {property.agent.agency && (
                <div className="text-sm text-[var(--zz-fg-muted)]">{property.agent.agency}</div>
              )}
            </div>
            <div className="mt-6">
              <InquiryForm propertyId={property.id} agentId={property.agentId} />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
