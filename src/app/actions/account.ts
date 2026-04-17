"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, verifyCredentials } from "@/lib/auth";

export async function updateAccount(formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "未登入" };
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const agency = String(formData.get("agency") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  if (!name) return { ok: false as const, error: "姓名不可為空" };

  await prisma.agent.update({
    where: { id: session.sub },
    data: { name, phone: phone || null, agency: agency || null, avatarUrl: avatarUrl || null },
  });
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function changePassword(formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "未登入" };
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 8) return { ok: false as const, error: "新密碼至少 8 個字元" };

  const ok = await verifyCredentials(session.email, current);
  if (!ok) return { ok: false as const, error: "目前密碼錯誤" };

  await prisma.agent.update({
    where: { id: session.sub },
    data: { password: await hashPassword(next) },
  });
  return { ok: true as const };
}
