import { AdminShell } from "@/components/layout/admin-shell";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { safeGetCurrentUser } from "@/lib/api/server";

export default async function AdminSettingsPage() {
  const currentUser = await safeGetCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-xl p-8 text-center">
          <h1 className="text-3xl font-black">Pengaturan admin perlu akses petugas</h1>
          <p className="mt-3 text-[var(--muted)]">
            Login sebagai petugas untuk mengelola profil admin.
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

  return (
    <AdminShell currentUser={currentUser}>
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <ProfileSettings currentUser={currentUser} />
      </main>
    </AdminShell>
  );
}
