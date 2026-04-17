import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateInquiryStatus } from "@/app/actions/inquiry-admin";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const session = (await getSession())!;
  const inquiries = await prisma.inquiry.findMany({
    where: {
      OR: [
        { agentId: session.sub },
        { property: { agentId: session.sub } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { property: true },
    take: 100,
  });

  return (
    <div className="p-6 md:p-10">
      <p className="zz-kicker">Inquiries</p>
      <h1 className="zz-headline text-3xl md:text-4xl mt-2 mb-8">預約訊息</h1>
      {inquiries.length === 0 ? (
        <div className="zz-card p-16 text-center text-[var(--zz-fg-muted)]">尚未收到訊息。</div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((i) => (
            <div key={i.id} className="zz-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{i.name}</div>
                    <span className="zz-chip !text-xs" data-active={i.status === "new"}>
                      {i.status === "new" ? "未處理" : i.status === "contacted" ? "已聯繫" : "已完成"}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--zz-fg-muted)] mt-1">
                    {i.phone}{i.lineId ? ` · LINE ${i.lineId}` : ""}
                  </div>
                  {i.property && (
                    <div className="text-xs text-[var(--zz-fg-muted)] mt-1">
                      針對房源：{i.property.title}
                    </div>
                  )}
                </div>
                <div className="text-xs text-[var(--zz-fg-muted)] shrink-0">
                  {new Date(i.createdAt).toLocaleString("zh-TW")}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{i.message}</p>
              <form action={updateInquiryStatus} className="mt-4 flex gap-2">
                <input type="hidden" name="id" value={i.id} />
                <button name="status" value="contacted" className="zz-btn zz-btn-outline !py-1.5 !px-3 text-xs">標為已聯繫</button>
                <button name="status" value="done" className="zz-btn zz-btn-outline !py-1.5 !px-3 text-xs">標為已完成</button>
                <button name="status" value="new" className="zz-btn zz-btn-outline !py-1.5 !px-3 text-xs">標為未處理</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
