import { ErrorState } from "@/components/ui/error-state";

export default function NotFoundPage() {
  return (
    <ErrorState
      eyebrow="404"
      title="Halaman tidak ditemukan"
      description="Alamat yang kamu buka tidak tersedia, sudah dipindahkan, atau kamu tidak punya akses untuk melihatnya."
      actionLabel="Ke Beranda"
    />
  );
}
