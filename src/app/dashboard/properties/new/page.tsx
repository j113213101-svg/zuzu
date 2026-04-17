import { PropertyForm } from "@/components/PropertyForm";
import Link from "next/link";

export default function NewProperty() {
  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link href="/dashboard/properties" className="text-sm text-[var(--zz-accent)]">← 返回房源列表</Link>
      <h1 className="zz-headline text-3xl md:text-4xl mt-4 mb-8">新增房源</h1>
      <PropertyForm />
    </div>
  );
}
