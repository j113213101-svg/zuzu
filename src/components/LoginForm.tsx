"use client";
import { useState, useTransition } from "react";
import { loginAction } from "@/app/actions/auth";

export function LoginForm({ next }: { next?: string }) {
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function onSubmit(formData: FormData) {
    setErr(null);
    start(async () => {
      const res = await loginAction(formData);
      if (res && !res.ok) setErr(res.error);
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label className="text-sm font-medium">Email</label>
        <input name="email" type="email" required className="zz-input mt-2" autoComplete="email" />
      </div>
      <div>
        <label className="text-sm font-medium">密碼</label>
        <input name="password" type="password" required className="zz-input mt-2" autoComplete="current-password" />
      </div>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button disabled={pending} className="zz-btn zz-btn-primary w-full disabled:opacity-60">
        {pending ? "登入中…" : "登入"}
      </button>
      <p className="text-xs text-[var(--zz-fg-muted)] text-center">
        還沒有帳號？請洽租租官方 LINE 開通
      </p>
    </form>
  );
}
