import { InquiryForm } from "@/components/InquiryForm";

export const metadata = { title: "聯絡我們｜租租" };

export default function ContactPage() {
  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-5xl px-5 pt-16 pb-12 text-center">
        <p className="zz-kicker">Let&apos;s Talk</p>
        <h1 className="zz-headline text-4xl md:text-6xl mt-3">線上預約．24 小時內回覆</h1>
        <p className="mt-5 text-[var(--zz-fg-muted)] max-w-2xl mx-auto">
          告訴我們你想找的房型、預算、看房時段，租租顧問會主動聯繫你。
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-24 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {[
            { t: "LINE 官方帳號", d: "@zuzu-taichung", h: "加入後直接對話" },
            { t: "Instagram", d: "@zuzu.tw", h: "看房源現場照片" },
            { t: "電話", d: "04-0000-0000", h: "週一至週日 10:00–21:00" },
            { t: "門市", d: "台中市西屯區臺灣大道", h: "歡迎預約親自見面" },
          ].map((i) => (
            <div key={i.t} className="zz-card p-6">
              <div className="zz-kicker">{i.t}</div>
              <div className="text-2xl font-semibold tracking-tight mt-1">{i.d}</div>
              <div className="text-sm text-[var(--zz-fg-muted)] mt-1">{i.h}</div>
            </div>
          ))}
        </div>
        <div className="zz-card p-8">
          <div className="text-xl font-semibold mb-4">快速預約</div>
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
