import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FeedList } from "@/components/report/feed-list";
import { InlineState } from "@/components/ui/error-state";
import { getReports } from "@/lib/api/server";

export default async function FeedsPage() {
  const reports = await getReports();

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto mb-7 max-w-2xl">
          <h1 className="text-3xl font-black">Feeds Warga</h1>
          <p className="mt-2 text-[var(--muted)]">
            Laporan terbaru dalam format post: foto, lokasi, komentar, dan voting.
          </p>
        </div>
        {reports.length > 0 ? (
          <FeedList reports={reports} />
        ) : (
          <div className="mx-auto max-w-2xl">
            <InlineState
              title="Belum ada laporan"
              description="Laporan warga akan muncul di feeds setelah dikirim."
            />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
