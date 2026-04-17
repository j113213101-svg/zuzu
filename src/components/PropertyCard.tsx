import Link from "next/link";
import { formatPrice, parseImages } from "@/lib/format";

type Agent = { name: string; agency: string | null };

type Property = {
  id: string;
  slug: string;
  title: string;
  district: string;
  price: number;
  layout: string;
  area: number;
  propertyType: string;
  petFriendly: boolean;
  allowSubsidy: boolean;
  images: string;
  agent?: Agent | null;
};

export function PropertyCard({ property }: { property: Property }) {
  const imgs = parseImages(property.images);
  const cover = imgs[0];
  return (
    <Link href={`/listings/${property.slug}`} className="zz-card block group">
      <div className="relative aspect-[4/3] bg-[var(--zz-bg-soft)] overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--zz-fg-muted)] text-sm">
            尚未上傳照片
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.petFriendly && (
            <span className="zz-chip bg-white/90 !text-xs">可寵物</span>
          )}
          {property.allowSubsidy && (
            <span className="zz-chip bg-white/90 !text-xs">可申請補助</span>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-[var(--zz-fg-muted)]">
          <span>{property.district}</span>
          <span>·</span>
          <span>{property.propertyType}</span>
          <span>·</span>
          <span>{property.area} 坪</span>
        </div>
        <div className="mt-1.5 font-medium text-[17px] leading-snug line-clamp-1">
          {property.title}
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold tracking-tight">
              NT$ {formatPrice(property.price)}
              <span className="text-sm text-[var(--zz-fg-muted)] font-normal"> / 月</span>
            </div>
          </div>
          <div className="text-xs text-[var(--zz-fg-muted)]">{property.layout}</div>
        </div>
        {property.agent?.agency && (
          <div className="mt-3 pt-3 border-t text-xs text-[var(--zz-fg-muted)]">
            {property.agent.agency} · {property.agent.name}
          </div>
        )}
      </div>
    </Link>
  );
}
