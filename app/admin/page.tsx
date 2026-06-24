import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";

export const metadata = { title: "Admin — Zina Beauty" };

export default async function AdminPage() {
  const authed = await verifyAdminSession();
  if (!authed) redirect("/admin/login");
  return <AdminDashboard />;
}
