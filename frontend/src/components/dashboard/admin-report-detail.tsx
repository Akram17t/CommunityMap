"use client";

import { Camera, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ReportDetail } from "@/components/report/report-detail";
import { statusLabels } from "@/features/reports/catalog";
import { rejectReport, updateReportStatus, uploadAsset } from "@/lib/api/client";
import type { Report, ReportImage, ReportStatus } from "@/types/community-map";

const statuses: ReportStatus[] = [
  "new",
  "verified",
  "in_progress",
  "resolved",
  "rejected",
];

export function AdminReportDetail({ report: initialReport }: { report: Report }) {
  const [report, setReport] = useState(initialReport);
  const [nextStatus, setNextStatus] = useState<ReportStatus>(initialReport.status);
  const [note, setNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState(
    initialReport.rejectionReason || "",
  );
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (proofPreviewUrl) {
        URL.revokeObjectURL(proofPreviewUrl);
      }
    };
  }, [proofPreviewUrl]);

  function handleProofFile(file: File | null) {
    setProofFile(file);
    if (proofPreviewUrl) {
      URL.revokeObjectURL(proofPreviewUrl);
    }
    setProofPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function saveStatus() {
    setFeedback(null);
    startTransition(async () => {
      try {
        let updated: Report;

        if (nextStatus === "rejected") {
          updated = await rejectReport(report.id, rejectionReason);
        } else {
          const resolutionImages: ReportImage[] = [];

          if (nextStatus === "resolved") {
            if (!proofFile && report.resolutionImages.length === 0) {
              setFeedback("Foto bukti perbaikan wajib diunggah sebelum status selesai.");
              return;
            }

            if (proofFile) {
              const uploaded = await uploadAsset({
                file: proofFile,
                purpose: "resolution",
                alt: `Bukti perbaikan ${report.id}`,
              });
              resolutionImages.push(uploaded);
            }
          }

          updated = await updateReportStatus(report.id, nextStatus, {
            note: note || undefined,
            resolutionImages:
              resolutionImages.length > 0 ? resolutionImages : undefined,
          });
        }

        setReport(updated);
        setNextStatus(updated.status);
        setRejectionReason(updated.rejectionReason || "");
        setNote("");
        setProofFile(null);
        handleProofFile(null);
        setFeedback("Status laporan berhasil diperbarui.");
      } catch (error) {
        setFeedback(
          error instanceof Error
            ? error.message
            : "Gagal memperbarui status laporan.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-black">Kontrol Verifikasi</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Perubahan status langsung dikirim ke backend dan tercatat di timeline.
            </p>
          </div>
          <StatusBadge status={report.status} />
        </div>
        {feedback && (
          <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm">
            {feedback}
          </div>
        )}
        <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Status Berikutnya
            <select
              value={nextStatus}
              onChange={(event) =>
                setNextStatus(event.target.value as ReportStatus)
              }
              className="h-11 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          {nextStatus === "rejected" ? (
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Alasan Penolakan
              <textarea
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                className="min-h-28 rounded-md border border-[var(--border)] px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                placeholder="Contoh: Foto tidak menunjukkan kerusakan jalan atau lokasi tidak valid."
              />
            </label>
          ) : (
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Catatan Timeline
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-28 rounded-md border border-[var(--border)] px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                placeholder="Catatan opsional untuk warga."
              />
            </label>
          )}
        </div>

        {nextStatus === "resolved" && (
          <div className="mt-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_160px]">
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-white p-4 text-center text-sm font-semibold transition hover:border-[var(--teal)]">
                <Camera className="size-5 text-[var(--teal)]" />
                <span className="mt-2">
                  {proofFile ? proofFile.name : "Unggah foto bukti perbaikan"}
                </span>
                <span className="mt-1 text-xs font-normal text-[var(--muted)]">
                  Wajib bila belum ada bukti perbaikan sebelumnya.
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  onChange={(event) =>
                    handleProofFile(event.target.files?.[0] || null)
                  }
                />
              </label>
              <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                {proofPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proofPreviewUrl}
                    alt="Pratinjau bukti perbaikan"
                    className="h-full min-h-28 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-28 items-center justify-center px-4 text-center text-xs text-[var(--muted)]">
                    {report.resolutionImages.length > 0
                      ? `${report.resolutionImages.length} foto bukti sudah tersimpan`
                      : "Belum ada foto bukti"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5">
          <Button
            disabled={pending}
            onClick={saveStatus}
          >
            <Save className="size-4" />
            {pending ? "Menyimpan..." : "Simpan Status"}
          </Button>
        </div>
      </Card>
      <ReportDetail report={report} admin />
    </div>
  );
}
