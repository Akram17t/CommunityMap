export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

type ErrorFactory<TError extends Error> = (
  status: number,
  message: string,
) => TError;

export async function readApiResponse<T, TError extends Error>(
  response: Response,
  createError: ErrorFactory<TError>,
  defaultMessage: string,
): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw createError(
      response.status,
      payload?.error?.message || defaultMessage,
    );
  }

  return payload.data as T;
}

export function isNetworkError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const cause = (error as Error & { cause?: unknown }).cause;
  const causeMessage =
    cause instanceof Error
      ? cause.message
      : typeof cause === "string"
        ? cause
        : "";
  const message = [error.message, causeMessage].filter(Boolean).join(" ");

  return /fetch failed|failed to fetch|econnrefused|enotfound|ehostunreach|socket/i.test(
    message,
  );
}
