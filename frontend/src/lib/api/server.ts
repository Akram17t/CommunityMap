import "server-only";

import { cookies } from "next/headers";
import type { AdminStats, AppUser, Report } from "@/types/community-map";
import { API_BASE_URL, isNetworkError, readApiResponse } from "./base";

const devFallbackEnabled = process.env.NODE_ENV !== "production";

export class ServerApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ServerApiError";
    this.status = status;
  }
}

async function serverRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const headers = new Headers(init?.headers);

  headers.set("Content-Type", "application/json");
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers,
  });

  return readApiResponse(
    response,
    (status, message) => new ServerApiError(status, message),
    "Gagal mengambil data dari backend.",
  );
}

function shouldUseDevFallback(error: unknown) {
  return devFallbackEnabled && isNetworkError(error);
}

function logDevFallback(path: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(
    `[server-api] ${path} memakai fallback data dev karena backend tidak bisa diakses: ${message}`,
  );
}

export async function getReports(): Promise<Report[]> {
  try {
    return await serverRequest<Report[]>("/reports");
  } catch (error) {
    if (shouldUseDevFallback(error)) {
      logDevFallback("/reports", error);
      return [];
    }

    throw error;
  }
}

export async function getReportById(id: string): Promise<Report | undefined> {
  try {
    return await serverRequest<Report>(`/reports/${id}`);
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) {
      return undefined;
    }

    if (shouldUseDevFallback(error)) {
      logDevFallback(`/reports/${id}`, error);
      return undefined;
    }

    throw error;
  }
}

export async function getMyReports(): Promise<Report[]> {
  try {
    return await serverRequest<Report[]>("/reports/me");
  } catch (error) {
    if (shouldUseDevFallback(error)) {
      logDevFallback("/reports/me", error);
      return [];
    }

    throw error;
  }
}

export async function getCurrentUser(): Promise<AppUser> {
  const data = await serverRequest<{ user: AppUser }>("/auth/me");
  return data.user;
}

export async function safeGetCurrentUser(): Promise<AppUser | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (
      error instanceof ServerApiError &&
      [401, 403].includes(error.status)
    ) {
      return null;
    }

    if (shouldUseDevFallback(error)) {
      logDevFallback("/auth/me", error);
      return null;
    }

    throw error;
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    return await serverRequest<AdminStats>("/admin/stats");
  } catch (error) {
    if (shouldUseDevFallback(error)) {
      logDevFallback("/admin/stats", error);
      return {
        totalReports: 0,
        newReports: 0,
        verifiedReports: 0,
        inProgressReports: 0,
        resolvedReports: 0,
        upvotes: 0,
      };
    }

    throw error;
  }
}
