"use client";
import { useState, useMemo } from "react";

type Household = "single" | "family2" | "family3" | "family4plus";

const BASE: Record<Household, number> = {
  single: 3200,
  family2: 4000,
  family3: 5000,
  family4plus: 6000,
};

export function SubsidyCalculator() {
  const [rent, setRent] = useState(15000);
  const [household, setHousehold] = useState<Household>("single");
  const [age, setAge] = useState(28);
  const [lowIncome, setLowIncome] = useState(false);
  const [hasChild, setHasChild] = useState(false);
  const [disability, setDisability] = useState(false);

  const { monthly, bonuses } = useMemo(() => {
    let subsidy = BASE[household];
    const bonuses: { label: string; amt: number }[] = [];

    if (age >= 20 && age <= 40) {
      const b = Math.round(subsidy * 1.2) - subsidy;
      bonuses.push({ label: "20–40 歲青年加碼 1.2 倍", amt: b });
      subsidy = Math.round(subsidy * 1.2);
    }
    if (lowIncome) {
      const b = Math.round(subsidy * 0.4);
      bonuses.push({ label: "中低／低收入加碼 1.4 倍", amt: b });
      subsidy += b;
    }
    if (hasChild) {
      bonuses.push({ label: "有未成年子女 +1,000", amt: 1000 });
      subsidy += 1000;
    }
    if (disability) {
      bonuses.push({ label: "身心障礙者 +1,000", amt: 1000 });
      subsidy += 1000;
    }

    const cap = Math.floor(rent / 2);
    const finalAmt = Math.min(subsidy, cap);
    return { monthly: finalAmt, bonuses };
  }, [rent, household, age, lowIncome, hasChild, disability]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="zz-card p-8 space-y-5">
        <div>
          <label className="text-sm font-medium">月租金</label>
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(Number(e.target.value) || 0)}
            className="zz-input mt-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">家戶人數</label>
          <select
            value={household}
            onChange={(e) => setHousehold(e.target.value as Household)}
            className="zz-input mt-2"
          >
            <option value="single">1 人（單身）</option>
            <option value="family2">2 人</option>
            <option value="family3">3 人</option>
            <option value="family4plus">4 人以上</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">申請人年齡</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value) || 0)}
            className="zz-input mt-2"
          />
        </div>
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={lowIncome} onChange={(e) => setLowIncome(e.target.checked)} />
            <span className="text-sm">中低或低收入戶</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={hasChild} onChange={(e) => setHasChild(e.target.checked)} />
            <span className="text-sm">家中有未成年子女</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={disability} onChange={(e) => setDisability(e.target.checked)} />
            <span className="text-sm">身心障礙者</span>
          </label>
        </div>
      </div>

      <div className="zz-card p-8 bg-[var(--zz-fg)] text-white flex flex-col">
        <p className="zz-kicker !text-white/60">預估月補助</p>
        <div className="text-6xl font-semibold tracking-tight mt-3">
          NT$ {monthly.toLocaleString()}
        </div>
        <p className="text-white/60 mt-2 text-sm">約為月租金的 {Math.round((monthly / rent) * 100) || 0}%</p>

        <div className="mt-8 space-y-2 text-sm text-white/80">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span>基礎補助</span>
            <span>NT$ {BASE[household].toLocaleString()}</span>
          </div>
          {bonuses.map((b) => (
            <div key={b.label} className="flex justify-between border-b border-white/10 pb-2">
              <span>{b.label}</span>
              <span>+ NT$ {b.amt.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="mt-auto pt-8 text-xs text-white/50 leading-relaxed">
          ＊ 實際金額以營建署與台中市政府公告為準。補助不可超過月租金的 50%。租租可協助整理資料、陪同送件。
        </p>
      </div>
    </div>
  );
}
