import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "仲介登入｜租租" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="zz-kicker">Agent Login</p>
          <h1 className="zz-headline text-4xl mt-3">仲介登入</h1>
          <p className="mt-3 text-sm text-[var(--zz-fg-muted)]">
            使用租租開通的帳號管理你的房源與預約。
          </p>
        </div>
        <div className="zz-card p-8">
          <LoginForm next={sp.next} />
        </div>
      </div>
    </div>
  );
}
