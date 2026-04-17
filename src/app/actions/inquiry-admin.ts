"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function updateInquiryStatus(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "done"].includes(status)) return;

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { property: true },
  });
  if (!inquiry) return;
  const allowed = inquiry.agentId === session.sub || inquiry.property?.agentId === session.sub;
  if (!allowed) return;

  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard/inquiries");
  revalidatePath("/dashboard");
}
