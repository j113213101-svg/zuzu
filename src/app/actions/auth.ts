"use server";
import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { ok: false as const, error: "請輸入 Email 和密碼" };
  }

  const agent = await verifyCredentials(email, password);
  if (!agent) return { ok: false as const, error: "帳號或密碼錯誤" };

  await createSession({
    sub: agent.id,
    email: agent.email,
    role: agent.role,
    name: agent.name,
  });

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
