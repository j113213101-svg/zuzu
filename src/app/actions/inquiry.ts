"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(40),
  phone: z.string().min(6).max(20),
  lineId: z.string().max(40).optional(),
  message: z.string().min(1).max(2000),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
});

export async function submitInquiry(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    lineId: formData.get("lineId") || undefined,
    message: formData.get("message"),
    propertyId: formData.get("propertyId") || undefined,
    agentId: formData.get("agentId") || undefined,
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "資料格式不正確" };

  await prisma.inquiry.create({ data: parsed.data });
  return { ok: true as const };
}
