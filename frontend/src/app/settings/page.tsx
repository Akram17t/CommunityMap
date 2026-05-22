import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { safeGetCurrentUser } from "@/lib/api/server";

export default async function SettingsPage() {
  const currentUser = await safeGetCurrentUser();

  if (!currentUser) {
    return (
      <>
        <AppHeader />
        <main className="min-h-screen bg-[var(--background)] px-4 py-10">
          <Card className="mx-auto max-w-xl p-8 text-center">
            <h1 className="text-3xl font-black">Login diperlukan</h1>
            <p className="mt-3 text-[var(--muted)]">
              Masuk dulu untuk membuka pengaturan profil.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <ButtonLink href="/login">Masuk</ButtonLink>
              <ButtonLink href="/" variant="secondary">
                Beranda
              </ButtonLink>
            </div>
          </Card>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8">
        <ProfileSettings currentUser={currentUser} />
      </main>
      <SiteFooter />
    </>
  );
}
