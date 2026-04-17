import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--zz-line)] bg-[var(--zz-bg-soft)] mt-24">
      <div className="mx-auto max-w-7xl px-5 py-12 grid gap-10 md:grid-cols-4 text-sm">
        <div className="md:col-span-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>zuzu</span>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--zz-fg-muted)]">租．租</span>
          </div>
          <p className="mt-4 text-[var(--zz-fg-muted)] leading-relaxed">
            台中在地租屋媒合．讓下一個家，更像自己。
          </p>
        </div>
        <div>
          <div className="font-medium mb-3">服務</div>
          <ul className="space-y-2 text-[var(--zz-fg-muted)]">
            <li><Link href="/listings">精選房源</Link></li>
            <li><Link href="/subsidy">租屋補助試算</Link></li>
            <li><Link href="/guide">租屋指南</Link></li>
            <li><Link href="/contact">線上預約</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">關於租租</div>
          <ul className="space-y-2 text-[var(--zz-fg-muted)]">
            <li><Link href="/about">品牌理念</Link></li>
            <li><Link href="/reviews">租客回饋</Link></li>
            <li><Link href="/news">最新消息</Link></li>
            <li><Link href="/login">仲介登入</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">聯繫</div>
          <ul className="space-y-2 text-[var(--zz-fg-muted)]">
            <li>LINE：@zuzu-taichung</li>
            <li>Instagram：@zuzu.tw</li>
            <li>電話：04-0000-0000</li>
            <li>台中市西屯區臺灣大道</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--zz-line)] text-center text-xs text-[var(--zz-fg-muted)] py-5">
        © {new Date().getFullYear()} zuzu.tw — 租租有限公司
      </div>
    </footer>
  );
}
