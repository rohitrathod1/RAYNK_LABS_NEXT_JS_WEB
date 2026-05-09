import { redirect } from "next/navigation";

export default function DashboardSubmissionsRedirect() {
  redirect("/admin/submissions");
}
