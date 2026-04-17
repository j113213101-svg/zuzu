import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateAccount, changePassword } from "@/app/actions/account";
import { AccountForm } from "@/components/AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = (await getSession())!;
  const agent = await prisma.agent.findUnique({ where: { id: session.sub } });
  if (!agent) return null;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <p className="zz-kicker">Account</p>
      <h1 className="zz-headline text-3xl md:text-4xl mt-2 mb-8">帳號設定</h1>
      <AccountForm
        agent={{
          email: agent.email,
          name: agent.name,
          phone: agent.phone,
          agency: agent.agency,
          avatarUrl: agent.avatarUrl,
        }}
        updateAction={updateAccount}
        passwordAction={changePassword}
      />
    </div>
  );
}
