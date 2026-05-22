import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PublicMap } from "@/components/map/public-map";
import { getReports } from "@/lib/api/server";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const reports = await getReports();
  const { reportId } = await searchParams;

  return (
    <>
      <AppHeader />
      <main className="bg-[var(--background)] p-3 sm:p-5">
        <PublicMap 
          initialReports={reports} 
          focusReportId={typeof reportId === "string" ? reportId : undefined} 
        />
      </main>
      <SiteFooter />
    </>
  );
}
