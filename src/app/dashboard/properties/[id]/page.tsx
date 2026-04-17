import { PropertyForm } from "@/components/PropertyForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProperty({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const p = await prisma.property.findUnique({ where: { id } });
  if (!p) notFound();
  if (p.agentId !== session.sub) redirect("/dashboard/properties");

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link href="/dashboard/properties" className="text-sm text-[var(--zz-accent)]">← 返回房源列表</Link>
      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="zz-headline text-3xl md:text-4xl">編輯房源</h1>
        <Link href={`/listings/${p.slug}`} target="_blank" className="zz-btn zz-btn-outline">預覽公開頁</Link>
      </div>
      <PropertyForm
        initial={{
          id: p.id,
          title: p.title,
          district: p.district,
          address: p.address,
          price: p.price,
          layout: p.layout,
          area: p.area,
          floor: p.floor,
          propertyType: p.propertyType,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          features: p.features,
          description: p.description,
          images: p.images,
          petFriendly: p.petFriendly,
          allowSubsidy: p.allowSubsidy,
          status: p.status,
        }}
      />
    </div>
  );
}
