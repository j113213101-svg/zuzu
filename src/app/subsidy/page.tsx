import { SubsidyCalculator } from "@/components/SubsidyCalculator";

export const metadata = { title: "租屋補助試算｜租租" };

export default function SubsidyPage() {
  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-4xl px-5 pt-16 pb-6 text-center">
        <p className="zz-kicker">Rental Subsidy</p>
        <h1 className="zz-headline text-4xl md:text-6xl mt-3">你可以申請多少補助？</h1>
        <p className="mt-5 text-[var(--zz-fg-muted)] max-w-2xl mx-auto">
          填入幾個基本資料，30 秒內試算你在台中市可申請的租金補貼金額。
          <br />實際核定金額以內政部營建署／地方政府公告為準，本工具僅供參考。
        </p>
      </div>
      <div className="mx-auto max-w-3xl px-5 pb-24">
        <SubsidyCalculator />
      </div>
    </div>
  );
}
