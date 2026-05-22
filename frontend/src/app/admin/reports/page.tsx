import { AdminReportsTable } from "@/components/dashboard/admin-reports-table";
import { AdminShell } from "@/components/layout/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminReports, safeGetCurrentUser } from "@/lib/api/server";

export default async function AdminReportsPage() {
  const currentUser = await safeGetCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-xl p-8 text-center">
          <h1 className="text-3xl font-black">Akses laporan masuk dibatasi</h1>
          <p className="mt-3 text-[var(--muted)]">
            Login sebagai petugas untuk membuka daftar laporan warga.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/login">Masuk Admin</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Beranda
            </ButtonLink>
          </div>
        </Card>
      </main>
    );
  }

  const reports = await getAdminReports();

  return (
    <AdminShell currentUser={currentUser}>
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <AdminReportsTable initialReports={reports} />
      </main>
    </AdminShell>
  );
}
