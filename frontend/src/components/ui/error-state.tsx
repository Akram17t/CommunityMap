import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ErrorState({
  eyebrow = "Terjadi Kendala",
  title,
  description,
  actionHref = "/",
  actionLabel = "Kembali ke Beranda",
  onRetry,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4 py-12">
      <Card className="w-full max-w-xl p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[rgb(239_59_45_/_10%)] text-[var(--danger)]">
          <AlertTriangle className="size-7" />
        </span>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[var(--teal)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-black text-[var(--asphalt)]">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry && (
            <Button onClick={onRetry} variant="secondary">
              <RefreshCw className="size-4" />
              Coba Lagi
            </Button>
          )}
          <ButtonLink href={actionHref}>
            <Home className="size-4" />
            {actionLabel}
          </ButtonLink>
        </div>
      </Card>
    </main>
  );
}

export function InlineState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-6 text-center shadow-[var(--shadow)]">
      <h2 className="text-lg font-black text-[var(--asphalt)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  );
}
