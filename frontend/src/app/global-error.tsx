"use client";

import "./globals.css";
import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <ErrorState
          eyebrow="Fatal Error"
          title="CommunityMap gagal dimuat"
          description="Terjadi gangguan fatal saat membuka aplikasi. Coba muat ulang halaman, lalu ulangi aksi terakhir."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
