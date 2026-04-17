"use client";
import { useState, useTransition } from "react";

type Agent = {
  email: string;
  name: string;
  phone: string | null;
  agency: string | null;
  avatarUrl: string | null;
};

type Result = { ok: true } | { ok: false; error: string };

export function AccountForm({
  agent,
  updateAction,
  passwordAction,
}: {
  agent: Agent;
  updateAction: (fd: FormData) => Promise<Result>;
  passwordAction: (fd: FormData) => Promise<Result>;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function submit(fn: (fd: FormData) => Promise<Result>, okText: string) {
    return async (fd: FormData) => {
      setMsg(null);
      start(async () => {
        const res = await fn(fd);
        setMsg(res.ok ? { type: "ok", text: okText } : { type: "err", text: res.error });
      });
    };
  }

  return (
    <div className="space-y-8">
      <div className="zz-card p-6 space-y-5">
        <h2 className="text-lg font-semibold">個人資料</h2>
        <form action={submit(updateAction, "已儲存")}>
          <div className="space-y-4">
            <Field label="Email（不可更改）">
              <input defaultValue={agent.email} disabled className="zz-input opacity-60" />
            </Field>
            <Field label="姓名">
              <input name="name" required defaultValue={agent.name} className="zz-input" />
            </Field>
            <Field label="電話">
              <input name="phone" defaultValue={agent.phone ?? ""} className="zz-input" />
            </Field>
            <Field label="所屬公司／品牌">
              <input name="agency" defaultValue={agent.agency ?? ""} className="zz-input" />
            </Field>
            <Field label="頭像圖片網址">
              <input name="avatarUrl" defaultValue={agent.avatarUrl ?? ""} className="zz-input" />
            </Field>
          </div>
          <button disabled={pending} className="zz-btn zz-btn-primary mt-6 disabled:opacity-60">儲存變更</button>
        </form>
      </div>

      <div className="zz-card p-6 space-y-5">
        <h2 className="text-lg font-semibold">變更密碼</h2>
        <form action={submit(passwordAction, "密碼已更新")}>
          <div className="space-y-4">
            <Field label="目前密碼">
              <input name="current" type="password" required className="zz-input" />
            </Field>
            <Field label="新密碼（至少 8 字元）">
              <input name="next" type="password" required className="zz-input" />
            </Field>
          </div>
          <button disabled={pending} className="zz-btn zz-btn-primary mt-6 disabled:opacity-60">更新密碼</button>
        </form>
      </div>

      {msg && (
        <div className={`text-sm ${msg.type === "ok" ? "text-green-700" : "text-red-600"}`}>
          {msg.text}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-2">{label}</div>
      {children}
    </label>
  );
}
