import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.news.findUnique({ where: { slug: decodeURIComponent(slug) } });
  if (!post || !post.published) notFound();

  return (
    <div className="zz-fade-in">
      <article className="mx-auto max-w-3xl px-5 pt-16 pb-20">
        <Link href="/news" className="text-sm text-[var(--zz-accent)]">← 最新消息</Link>
        <h1 className="zz-headline text-4xl md:text-5xl mt-6">{post.title}</h1>
        <div className="mt-3 text-sm text-[var(--zz-fg-muted)]">
          {new Date(post.createdAt).toLocaleDateString("zh-TW")}
        </div>
        <div className="zz-prose mt-10" style={{ whiteSpace: "pre-wrap" }}>
          {post.body}
        </div>
      </article>
    </div>
  );
}
