"use client";
import { useState } from "react";
import { submitInquiry } from "@/app/actions/inquiry";

export function InquiryForm({
  propertyId,
  agentId,
  compact = false,
}: {
  propertyId?: string;
  agentId?: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setState("loading");
    setErr(null);
    const res = await submitInquiry(formData);
    if (res.ok) setState("ok");
    else {
      setState("err");
      setErr(res.error ?? "送出失敗，請稍後再試");
    }
  }

  if (state === "ok") {
    return (
      <div className="text-center py-6">
        <div className="text-2xl mb-2">✓</div>
        <div className="font-medium">已收到你的訊息</div>
        <p className="text-sm text-[var(--zz-fg-muted)] mt-1">租租顧問會在 24 小時內與你聯繫。</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-3">
      {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}
      {agentId && <input type="hidden" name="agentId" value={agentId} />}
      <input name="name" required placeholder="你的姓名" className="zz-input" />
      <input name="phone" required placeholder="手機號碼" className="zz-input" />
      <input name="lineId" placeholder="LINE ID（選填）" className="zz-input" />
      <textarea
        name="message"
        required
        rows={compact ? 2 : 4}
        placeholder={propertyId ? "想什麼時間看房？有什麼想了解的？" : "告訴我們你想找的房子"}
        className="zz-input"
      />
      <button
        disabled={state === "loading"}
        className="zz-btn zz-btn-primary w-full disabled:opacity-60"
      >
        {state === "loading" ? "送出中…" : "送出預約"}
      </button>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <p className="text-xs text-[var(--zz-fg-muted)] text-center">
        送出即表示你同意租租聯繫你進行後續服務。
      </p>
    </form>
  );
}
