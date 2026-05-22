import { notFound } from "next/navigation";
import Image from "next/image";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FeedList } from "@/components/report/feed-list";
import { getUserByUsername, getReports } from "@/lib/api/server";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  // Get reports made by this user
  const reports = await getReports({ reporterId: user.id });

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-8 text-center shadow-[var(--shadow)] sm:flex-row sm:items-start sm:text-left">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.fullName} fill sizes="96px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-bold text-[var(--teal)]">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-[var(--asphalt)]">{user.fullName}</h1>
              <p className="mt-1 font-semibold text-[var(--muted)]">@{user.username}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--surface-strong)] px-4 py-2">
                <span className="text-sm font-bold text-[var(--asphalt)]">{reports.length}</span>
                <span className="text-xs font-semibold text-[var(--muted)]">Laporan Dibuat</span>
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-xl font-black">Laporan oleh @{user.username}</h2>
          {reports.length > 0 ? (
            <FeedList reports={reports} />
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
              <p className="text-sm font-semibold text-[var(--muted)]">Belum ada laporan yang dibuat.</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
