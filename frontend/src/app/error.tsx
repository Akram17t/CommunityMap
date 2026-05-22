"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      eyebrow="Error"
      title="Aplikasi sedang bermasalah"
      description="Ada bagian halaman yang gagal dimuat. Kamu bisa mencoba lagi, atau kembali ke beranda bila masalah masih muncul."
      onRetry={reset}
    />
  );
}
