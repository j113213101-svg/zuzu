export const metadata = { title: "關於租租｜品牌理念" };

export default function AboutPage() {
  return (
    <div className="zz-fade-in">
      <div className="mx-auto max-w-4xl px-5 pt-20 pb-24">
        <p className="zz-kicker">About Zuzu</p>
        <h1 className="zz-headline text-4xl md:text-6xl mt-3">
          把找房這件事<br />做得像挑一雙好鞋一樣細
        </h1>
        <div className="zz-prose mt-12 text-lg">
          <p>
            租租從台中出發，我們相信「家」是一段人生風景，不是一個便宜就好的空間。
            每一間上架的房源，都經過租租顧問的現場踏查——看採光、確認管線、記下生活機能，
            才放上網站。
          </p>
          <h2>我們在乎的三件事</h2>
          <h3>誠實</h3>
          <p>房源資訊、屋況缺點、合約細節，全部都事先講清楚。不用見面才告訴你「其實還有這個費用」。</p>
          <h3>速度</h3>
          <p>24 小時內回覆、一週內約看房、搬家前兩週把補助資料準備好——租租的服務有節奏。</p>
          <h3>品味</h3>
          <p>我們相信好的租屋體驗本身就是一種生活美學。從看房路線、推薦清單、搬家流程都設計過。</p>
        </div>
      </div>
    </div>
  );
}
