export type UserRole = "citizen" | "admin";

export type AppUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
};

export type ReportCategorySlug =
  | "pothole"
  | "streetlight"
  | "puddle"
  | "flood"
  | "other";

export type ReportStatus =
  | "new"
  | "verified"
  | "in_progress"
  | "resolved"
  | "rejected";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type ReportCategory = {
  id: number;
  slug: ReportCategorySlug;
  name: string;
  shortName: string;
  color: string;
  accent: string;
  icon: "triangle" | "light" | "drop" | "wave" | "dot";
};

export type ReportImage = {
  id: string;
  imageUrl: string;
  storageKey: string;
  kind?: "report" | "resolution_proof";
  alt: string;
};

export type StatusLog = {
  id: string;
  previousStatus?: ReportStatus;
  nextStatus: ReportStatus;
  note: string;
  updatedBy: string;
  createdAt: string;
};

export type ReportComment = {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatarUrl?: string | null;
  parentId?: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type Report = {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterUsername: string;
  reporterAvatarUrl?: string | null;
  categorySlug: ReportCategorySlug;
  title: string;
  description: string;
  address: string;
  district: string;
  coordinates: Coordinates;
  status: ReportStatus;
  isVerified: boolean;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  rejectionReason?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images: ReportImage[];
  resolutionImages: ReportImage[];
  comments: ReportComment[];
  statusLogs: StatusLog[];
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
};

export type AdminStats = {
  totalReports: number;
  newReports: number;
  verifiedReports: number;
  inProgressReports: number;
  resolvedReports: number;
  rejectedReports: number;
  upvotes: number;
  downvotes: number;
};
