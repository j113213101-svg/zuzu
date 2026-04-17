import Link from "next/link";
import { getSession } from "@/lib/auth";

const nav = [
  { href: "/listings", label: "找房" },
  { href: "/subsidy", label: "補助試算" },
  { href: "/guide", label: "租租指南" },
  { href: "/reviews", label: "租客回饋" },
  { href: "/news", label: "最新消息" },
  { href: "/contact", label: "聯絡我們" },
];

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-40 zz-glass border-b border-[var(--zz-line)]">
      <div className="mx-auto max-w-7xl px-5 h-14 flex items-center justify-between text-sm">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>zuzu</span>
          <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--zz-fg-muted)]">租．租</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[var(--zz-fg)]/80">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[var(--zz-fg)] transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <Link href="/dashboard" className="zz-btn zz-btn-ghost !py-1.5 !px-3 text-sm">
              後台
            </Link>
          ) : (
            <Link href="/login" className="zz-btn zz-btn-ghost !py-1.5 !px-3 text-sm">
              仲介登入
            </Link>
          )}
          <Link href="/contact" className="zz-btn zz-btn-primary !py-1.5 !px-4 text-sm">
            立即預約
          </Link>
        </div>
      </div>
    </header>
  );
}
