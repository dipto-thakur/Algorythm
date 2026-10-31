import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="mx-auto grid min-h-svh max-w-sm place-items-center px-5">
      <LoginForm />
    </main>
  );
}