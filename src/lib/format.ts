export function formatPrice(n: number) {
  return n.toLocaleString("zh-TW");
}

export function parseImages(s: string): string[] {
  if (!s) return [];
  try {
    const p = JSON.parse(s);
    if (Array.isArray(p)) return p.filter((x): x is string => typeof x === "string");
  } catch {}
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

export function parseFeatures(s: string): string[] {
  return parseImages(s);
}

export const DISTRICTS = [
  "北區", "北屯區", "西屯區", "南屯區", "西區", "東區", "南區", "中區", "太平區", "大里區",
];

export const BUDGET_TIERS = [
  { value: "all", label: "全部預算" },
  { value: "budget", label: "小資 < 12k" },
  { value: "standard", label: "標準 12-20k" },
  { value: "premium", label: "精品 20k+" },
];

export const PROPERTY_TYPES = ["套房", "雅房", "分租套房", "獨立套房", "整層", "公寓", "透天"];
