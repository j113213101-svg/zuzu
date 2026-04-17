import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GuideDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await prisma.guide.findUnique({ where: { slug: decodeURIComponent(slug) } });
  if (!guide || !guide.published) notFound();

  return (
    <div className="zz-fade-in">
      <article className="mx-auto max-w-3xl px-5 pt-16 pb-20">
        <Link href="/guide" className="text-sm text-[var(--zz-accent)]">← 所有指南</Link>
        <p className="zz-kicker mt-6">{guide.category}</p>
        <h1 className="zz-headline text-4xl md:text-5xl mt-3">{guide.title}</h1>
        <div className="mt-4 text-sm text-[var(--zz-fg-muted)]">
          {new Date(guide.createdAt).toLocaleDateString("zh-TW")}
        </div>
        <div className="zz-prose mt-10" style={{ whiteSpace: "pre-wrap" }}>
          {guide.body}
        </div>
      </article>
    </div>
  );
}
