import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const nav = [
  { href: "/dashboard", label: "總覽" },
  { href: "/dashboard/properties", label: "我的房源" },
  { href: "/dashboard/inquiries", label: "預約訊息" },
  { href: "/dashboard/account", label: "帳號設定" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <aside className="w-60 shrink-0 border-r border-[var(--zz-line)] bg-[var(--zz-bg-soft)] hidden md:block">
        <div className="p-6">
          <div className="text-xs text-[var(--zz-fg-muted)]">登入身分</div>
          <div className="font-semibold mt-1 truncate">{session.name}</div>
          <div className="text-xs text-[var(--zz-fg-muted)] truncate">{session.email}</div>
        </div>
        <nav className="px-3 space-y-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block px-3 py-2 rounded-lg hover:bg-white transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="px-3 mt-6">
          <button className="w-full text-left text-sm px-3 py-2 rounded-lg text-[var(--zz-fg-muted)] hover:bg-white">
            登出
          </button>
        </form>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
