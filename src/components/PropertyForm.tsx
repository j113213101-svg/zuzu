"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DISTRICTS, PROPERTY_TYPES } from "@/lib/format";
import { createPropertyAction, updatePropertyAction, deletePropertyAction } from "@/app/actions/property";

type Initial = {
  id?: string;
  title?: string;
  district?: string;
  address?: string;
  price?: number;
  layout?: string;
  area?: number;
  floor?: string | null;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  features?: string;
  description?: string;
  images?: string;
  petFriendly?: boolean;
  allowSubsidy?: boolean;
  status?: string;
};

export function PropertyForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(() =>
    initial?.images ? initial.images.split(",").map((s) => s.trim()).filter(Boolean) : []
  );
  const [features, setFeatures] = useState<string[]>(() =>
    initial?.features ? initial.features.split(",").map((s) => s.trim()).filter(Boolean) : []
  );
  const [newImg, setNewImg] = useState("");
  const [newFeat, setNewFeat] = useState("");

  function addImage() {
    const v = newImg.trim();
    if (!v) return;
    setImages([...images, v]);
    setNewImg("");
  }
  function addFeature() {
    const v = newFeat.trim();
    if (!v) return;
    setFeatures([...features, v]);
    setNewFeat("");
  }

  async function onSubmit(fd: FormData) {
    fd.set("images", images.join(","));
    fd.set("features", features.join(","));
    setErr(null);
    start(async () => {
      if (initial?.id) {
        const res = await updatePropertyAction(initial.id, fd);
        if (res.ok) router.refresh();
        else setErr(res.error);
      } else {
        const res = await createPropertyAction(fd);
        if (res && !res.ok) setErr(res.error);
      }
    });
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm("確定要刪除這個房源？無法復原。")) return;
    start(async () => {
      await deletePropertyAction(initial.id!);
    });
  }

  return (
    <form action={onSubmit} className="space-y-8">
      <Section title="基本資訊">
        <Field label="標題" hint="例：西屯區亞洲大學旁·採光超好 1 房 1 廳">
          <input name="title" required defaultValue={initial?.title} className="zz-input" />
        </Field>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="行政區">
            <select name="district" required defaultValue={initial?.district ?? "西屯區"} className="zz-input">
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="物件類型">
            <select name="propertyType" required defaultValue={initial?.propertyType ?? "套房"} className="zz-input">
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="地址（街道/巷弄，不公開詳細門牌）">
          <input name="address" required defaultValue={initial?.address} className="zz-input" />
        </Field>
      </Section>

      <Section title="租金與格局">
        <div className="grid md:grid-cols-3 gap-5">
          <Field label="月租金 (NT$)">
            <input name="price" type="number" required defaultValue={initial?.price ?? 15000} className="zz-input" />
          </Field>
          <Field label="坪數">
            <input name="area" type="number" step="0.1" required defaultValue={initial?.area ?? 8} className="zz-input" />
          </Field>
          <Field label="樓層">
            <input name="floor" defaultValue={initial?.floor ?? ""} placeholder="3F/5F" className="zz-input" />
          </Field>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Field label="格局">
            <input name="layout" required defaultValue={initial?.layout ?? "1房1廳1衛"} className="zz-input" />
          </Field>
          <Field label="房間數">
            <input name="bedrooms" type="number" defaultValue={initial?.bedrooms ?? 1} className="zz-input" />
          </Field>
          <Field label="衛浴數">
            <input name="bathrooms" type="number" defaultValue={initial?.bathrooms ?? 1} className="zz-input" />
          </Field>
        </div>
      </Section>

      <Section title="照片">
        <p className="text-sm text-[var(--zz-fg-muted)]">貼上圖片網址（可以是 Imgur、Cloudinary、Google Drive 公開連結）。第一張會作為封面。</p>
        <div className="flex gap-2">
          <input value={newImg} onChange={(e) => setNewImg(e.target.value)} placeholder="https://..." className="zz-input" />
          <button type="button" onClick={addImage} className="zz-btn zz-btn-outline">加入</button>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[var(--zz-bg-soft)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full text-xs"
                >×</button>
                {i === 0 && <div className="absolute bottom-1 left-1 bg-white/90 text-xs px-2 py-0.5 rounded-full">封面</div>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="空間特色與描述">
        <Field label="特色標籤">
          <div className="flex gap-2">
            <input value={newFeat} onChange={(e) => setNewFeat(e.target.value)} placeholder="例：可開火、獨立陽台、近捷運" className="zz-input" />
            <button type="button" onClick={addFeature} className="zz-btn zz-btn-outline">加入</button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {features.map((f, i) => (
                <span key={i} className="zz-chip" data-active="true" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}>
                  {f} ×
                </span>
              ))}
            </div>
          )}
        </Field>
        <Field label="詳細描述">
          <textarea name="description" required rows={8} defaultValue={initial?.description} className="zz-input" placeholder="介紹房屋的亮點、生活機能、管理方式、租金包含項目..." />
        </Field>
      </Section>

      <Section title="其他條件與狀態">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="petFriendly" defaultChecked={initial?.petFriendly} /> 可養寵物
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="allowSubsidy" defaultChecked={initial?.allowSubsidy} /> 可申請租金補貼
          </label>
        </div>
        <Field label="刊登狀態">
          <select name="status" defaultValue={initial?.status ?? "available"} className="zz-input">
            <option value="available">上架中</option>
            <option value="rented">已出租</option>
            <option value="draft">下架／草稿</option>
          </select>
        </Field>
      </Section>

      {err && <div className="text-sm text-red-600">{err}</div>}

      <div className="flex items-center justify-between pt-4 border-t border-[var(--zz-line)]">
        {initial?.id ? (
          <button type="button" onClick={onDelete} className="text-sm text-red-600 hover:underline">
            刪除此房源
          </button>
        ) : <span />}
        <button disabled={pending} className="zz-btn zz-btn-primary disabled:opacity-60">
          {pending ? "儲存中…" : initial?.id ? "儲存變更" : "建立房源"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="zz-card p-6 space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-2">{label}</div>
      {children}
      {hint && <div className="text-xs text-[var(--zz-fg-muted)] mt-1">{hint}</div>}
    </label>
  );
}
