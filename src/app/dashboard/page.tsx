import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const session = (await getSession())!;
  const [propCount, activeCount, inquiryCount, newInquiries] = await Promise.all([
    prisma.property.count({ where: { agentId: session.sub } }),
    prisma.property.count({ where: { agentId: session.sub, status: "available" } }),
    prisma.inquiry.count({ where: { agentId: session.sub } }),
    prisma.inquiry.count({ where: { agentId: session.sub, status: "new" } }),
  ]);

  const stats = [
    { l: "總房源數", v: propCount },
    { l: "上架中", v: activeCount },
    { l: "累積預約", v: inquiryCount },
    { l: "未處理", v: newInquiries },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="zz-kicker">Dashboard</p>
          <h1 className="zz-headline text-3xl md:text-4xl mt-2">你好，{session.name}</h1>
        </div>
        <Link href="/dashboard/properties/new" className="zz-btn zz-btn-primary">+ 新增房源</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.l} className="zz-card p-6">
            <div className="text-xs text-[var(--zz-fg-muted)]">{s.l}</div>
            <div className="text-3xl font-semibold tracking-tight mt-1">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/dashboard/properties" className="zz-card p-6 block">
          <div className="font-semibold">管理房源</div>
          <p className="text-sm text-[var(--zz-fg-muted)] mt-1">編輯、下架、補照片。</p>
        </Link>
        <Link href="/dashboard/inquiries" className="zz-card p-6 block">
          <div className="font-semibold">預約訊息</div>
          <p className="text-sm text-[var(--zz-fg-muted)] mt-1">查看租客詢問，盡快回覆。</p>
        </Link>
      </div>
    </div>
  );
}
