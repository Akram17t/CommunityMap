"use client";

import Image from "next/image";
import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Map, MapControls, MapMarker } from "@/components/ui/map";
import { MiniBadge, StatusBadge } from "@/components/ui/badge";
import { ReportEngagement } from "@/components/report/report-engagement";
import { categories, statusLabels } from "@/features/reports/catalog";
import { cn } from "@/lib/utils";
import type {
  Report,
  ReportCategorySlug,
  ReportStatus,
} from "@/types/community-map";
import { useMap } from "react-map-gl/maplibre";
import { MapMarkerPin } from "./map-marker-pin";

const statuses: ReportStatus[] = [
  "new",
  "verified",
  "in_progress",
  "resolved",
  "rejected",
];

export function PublicMap({
  compact = false,
  initialReports,
  focusReportId,
}: {
  compact?: boolean;
  initialReports: Report[];
  focusReportId?: string;
}) {
  const [reports, setReports] = useState(initialReports);
  const [categoryFilters, setCategoryFilters] = useState<ReportCategorySlug[]>([]);
  const [statusFilters, setStatusFilters] = useState<ReportStatus[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    initialReports[0]?.id || null,
  );
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const [viewport, setViewport] = useState({
    longitude: 110.05,
    latitude: -7.35,
    zoom: 6.3,
  });

  useEffect(() => {
    if (focusReportId && initialReports) {
      const focusReport = initialReports.find(r => r.id === focusReportId);
      if (focusReport) {
        setSelectedReportId(focusReport.id);
        setViewport({
          longitude: focusReport.coordinates.longitude,
          latitude: focusReport.coordinates.latitude,
          zoom: 16,
        });
      }
    }
  }, [focusReportId, initialReports]);

  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesCategory =
        categoryFilters.length === 0 || categoryFilters.includes(report.categorySlug);
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(report.status);
      const matchesDistrict =
        districtFilter === "all" || report.district === districtFilter;
      const matchesSearch =
        search.trim().length === 0 ||
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.address.toLowerCase().includes(search.toLowerCase()) ||
        report.id.toLowerCase().includes(search.toLowerCase());

      let matchesDateRange = true;
      if (dateRange === "7d") {
        matchesDateRange =
          Date.now() - new Date(report.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateRange === "30d") {
        matchesDateRange =
          Date.now() - new Date(report.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000;
      }

      return (
        matchesCategory &&
        matchesStatus &&
        matchesDistrict &&
        matchesSearch &&
        matchesDateRange
      );
    });
  }, [categoryFilters, dateRange, districtFilter, reports, search, statusFilters]);

  useEffect(() => {
    if (!filteredReports.some((report) => report.id === selectedReportId)) {
      setSelectedReportId(filteredReports[0]?.id || null);
    }
  }, [filteredReports, selectedReportId]);

  const visibleSelected =
    filteredReports.find((report) => report.id === selectedReportId) ||
    filteredReports[0] ||
    null;
  const districts = useMemo(
    () => Array.from(new Set(reports.map((report) => report.district))).sort(),
    [reports],
  );

  function toggleCategory(slug: ReportCategorySlug) {
    setCategoryFilters((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }

  function toggleStatus(status: ReportStatus) {
    setStatusFilters((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
  }

  function handleReportChange(updated: Report) {
    setReports((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  return (
    <div
      className={cn(
        "relative grid overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-[var(--shadow)]",
        compact ? "h-[460px] grid-cols-1" : "min-h-[calc(100vh-5rem)] lg:grid-cols-[290px_1fr_340px]",
      )}
    >
      {!compact && (
        <aside className="z-10 border-b border-[var(--border)] bg-white p-4 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-[var(--teal)]" />
              <h2 className="text-sm font-bold">Filter</h2>
            </div>
            <button
              className="text-xs font-semibold text-[var(--teal)]"
              onClick={() => {
                setCategoryFilters([]);
                setStatusFilters([]);
                setSearch("");
                setDistrictFilter("all");
                setDateRange("all");
              }}
            >
              Reset
            </button>
          </div>
          <FilterGroup title="Kategori">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-[var(--surface-strong)]"
              >
                <input
                  type="checkbox"
                  checked={categoryFilters.includes(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                  className="accent-[var(--teal)]"
                />
                <CategoryIcon slug={category.slug} size="sm" />
                <span>{category.name}</span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="Status">
            {statuses.map((status) => (
              <label
                key={status}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-[var(--surface-strong)]"
              >
                <input
                  type="checkbox"
                  checked={statusFilters.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="accent-[var(--teal)]"
                />
                <span className="size-2 rounded-full bg-current" />
                <span>{statusLabels[status]}</span>
              </label>
            ))}
          </FilterGroup>
          <div className="mt-5 flex flex-col gap-3">
            <label className="text-xs font-bold text-[var(--muted)]">
              Rentang Waktu
            </label>
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="all">Semua Data</option>
            </select>
            <label className="text-xs font-bold text-[var(--muted)]">Area</label>
            <select
              value={districtFilter}
              onChange={(event) => setDistrictFilter(event.target.value)}
              className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
            >
              <option value="all">Semua Wilayah</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <Button className="mt-2" variant="secondary">
              {filteredReports.length} laporan ditemukan
            </Button>
          </div>
        </aside>
      )}

      <div className="relative min-h-[460px]">
        <div className="absolute left-4 right-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2 shadow-[var(--shadow)] lg:left-8 lg:right-auto lg:w-[420px]">
          <Search className="size-4 text-[var(--muted)]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Cari lokasi atau alamat..."
          />
        </div>
        <Map
          viewport={viewport}
          onViewportChange={setViewport}
          className="h-full min-h-[460px] w-full"
        >
          <MapControls position="top-right" />
          {filteredReports.map((report) => (
            <MapMarker
              key={report.id}
              longitude={report.coordinates.longitude}
              latitude={report.coordinates.latitude}
              onClick={() => setSelectedReportId(report.id)}
            >
              <MapMarkerPin
                report={report}
                selected={visibleSelected?.id === report.id}
              />
            </MapMarker>
          ))}
          {focusReportId && <MapFlyTo focusReportId={focusReportId} reports={initialReports} />}
        </Map>
        <div className="absolute bottom-4 left-4 z-10 hidden rounded-lg border border-[var(--border)] bg-white p-3 shadow-[var(--shadow)] md:block">
          <p className="mb-2 text-xs font-bold">Legenda</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {categories.map((category) => (
              <span key={category.slug} className="flex items-center gap-2">
                <CategoryIcon slug={category.slug} size="sm" />
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!compact && visibleSelected && (
        <aside className="z-10 border-t border-[var(--border)] bg-white p-4 lg:border-l lg:border-t-0">
          <ReportMapPanel
            report={visibleSelected}
            onReportChange={handleReportChange}
          />
        </aside>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-xs font-bold text-[var(--muted)]">{title}</h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function ReportMapPanel({
  report,
  onReportChange,
}: {
  report: Report;
  onReportChange: (report: Report) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <MiniBadge tone="neutral">#{report.id}</MiniBadge>
          <h2 className="mt-3 text-xl font-bold text-[var(--asphalt)]">
            {report.title}
          </h2>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface-strong)]">
        <Image
          src={report.images[0]?.imageUrl || "/images/report-road.svg"}
          alt={report.images[0]?.alt || report.title}
          fill
          sizes="340px"
          priority
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
        <p>{report.address}</p>
        <p>
          Dilaporkan{" "}
          {new Date(report.createdAt).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
      <p className="text-sm leading-6 text-[var(--asphalt)]">
        {report.description}
      </p>
      <ReportEngagement report={report} compact onReportChange={onReportChange} />
      <Button
        variant="secondary"
        className="mt-auto w-full"
        onClick={() => window.location.assign(`/reports/${report.id}`)}
      >
        Lihat Detail
      </Button>
    </div>
  );
}

function MapFlyTo({ focusReportId, reports }: { focusReportId: string; reports: Report[] }) {
  const { current: map } = useMap();
  useEffect(() => {
    const report = reports.find((r) => r.id === focusReportId);
    if (report && map) {
      map.flyTo({
        center: [report.coordinates.longitude, report.coordinates.latitude],
        zoom: 16,
        duration: 1500,
      });
    }
  }, [focusReportId, reports, map]);
  return null;
}
