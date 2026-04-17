"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const schema = z.object({
  title: z.string().min(1).max(120),
  district: z.string().min(1),
  address: z.string().min(1),
  price: z.coerce.number().int().min(1000).max(999999),
  layout: z.string().min(1),
  area: z.coerce.number().min(1).max(999),
  floor: z.string().optional(),
  propertyType: z.string().min(1),
  bedrooms: z.coerce.number().int().min(0).max(20).default(1),
  bathrooms: z.coerce.number().int().min(0).max(20).default(1),
  features: z.string().default(""),
  description: z.string().min(1),
  images: z.string().default(""),
  petFriendly: z.coerce.boolean().default(false),
  allowSubsidy: z.coerce.boolean().default(false),
  budgetTier: z.string().default("standard"),
  status: z.string().default("available"),
});

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) + "-" + Math.random().toString(36).slice(2, 7)
  );
}

function pickFields(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return v == null ? undefined : String(v);
  };
  return {
    title: get("title") ?? "",
    district: get("district") ?? "",
    address: get("address") ?? "",
    price: get("price") ?? "0",
    layout: get("layout") ?? "",
    area: get("area") ?? "0",
    floor: get("floor"),
    propertyType: get("propertyType") ?? "",
    bedrooms: get("bedrooms") ?? "1",
    bathrooms: get("bathrooms") ?? "1",
    features: get("features") ?? "",
    description: get("description") ?? "",
    images: get("images") ?? "",
    petFriendly: formData.get("petFriendly") ? "true" : "false",
    allowSubsidy: formData.get("allowSubsidy") ? "true" : "false",
    budgetTier: get("budgetTier") ?? "standard",
    status: get("status") ?? "available",
  };
}

export async function createPropertyAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "未登入" };

  const parsed = schema.safeParse(pickFields(formData));
  if (!parsed.success) {
    return { ok: false as const, error: "資料格式不正確：" + parsed.error.issues[0]?.message };
  }

  const data = parsed.data;
  const tier =
    data.price < 12000 ? "budget" : data.price <= 20000 ? "standard" : "premium";

  const property = await prisma.property.create({
    data: {
      ...data,
      slug: slugify(data.title),
      budgetTier: tier,
      agentId: session.sub,
    },
  });

  revalidatePath("/listings");
  revalidatePath("/");
  redirect(`/dashboard/properties/${property.id}`);
}

export async function updatePropertyAction(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "未登入" };

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing || existing.agentId !== session.sub) {
    return { ok: false as const, error: "無權限修改此房源" };
  }

  const parsed = schema.safeParse(pickFields(formData));
  if (!parsed.success) {
    return { ok: false as const, error: "資料格式不正確：" + parsed.error.issues[0]?.message };
  }

  const data = parsed.data;
  const tier =
    data.price < 12000 ? "budget" : data.price <= 20000 ? "standard" : "premium";

  await prisma.property.update({
    where: { id },
    data: { ...data, budgetTier: tier },
  });

  revalidatePath("/listings");
  revalidatePath(`/listings/${existing.slug}`);
  revalidatePath("/");
  return { ok: true as const };
}

export async function deletePropertyAction(id: string) {
  const session = await getSession();
  if (!session) return;
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing || existing.agentId !== session.sub) return;
  await prisma.property.delete({ where: { id } });
  revalidatePath("/listings");
  redirect("/dashboard/properties");
}
