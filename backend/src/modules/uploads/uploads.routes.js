const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { env } = require("../../config/env");
const { requireAuth } = require("../../middlewares/auth");
const { HttpError } = require("../../lib/http");

const router = express.Router();
const allowedPurposes = new Set(["report", "resolution", "avatar"]);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeExtension(file) {
  const fromName = path.extname(file.originalname || "").toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fromName)) {
    return fromName;
  }

  if (file.mimetype === "image/png") return ".png";
  if (file.mimetype === "image/webp") return ".webp";
  if (file.mimetype === "image/gif") return ".gif";
  return ".jpg";
}

const storage = multer.diskStorage({
  destination(req, _file, callback) {
    const purpose = req.body?.purpose || "report";
    const targetPurpose = allowedPurposes.has(purpose) ? purpose : "report";
    const targetDir = path.join(env.uploadDir, targetPurpose);
    ensureDir(targetDir);
    callback(null, targetDir);
  },
  filename(_req, file, callback) {
    callback(null, `${Date.now()}-${cryptoRandom()}${safeExtension(file)}`);
  },
});

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 10);
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(_req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new HttpError(
          415,
          "File harus berupa gambar JPG, PNG, WebP, atau GIF.",
          null,
          "INVALID_UPLOAD_TYPE",
        ),
      );
      return;
    }

    callback(null, true);
  },
});

router.post("/", requireAuth, (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        next(
          new HttpError(
            413,
            "Ukuran gambar maksimal 5MB.",
            null,
            "UPLOAD_TOO_LARGE",
          ),
        );
        return;
      }

      next(error);
      return;
    }

    if (!req.file) {
      next(new HttpError(400, "File gambar wajib diunggah.", null, "UPLOAD_REQUIRED"));
      return;
    }

    const purpose = req.body?.purpose || "report";
    if (!allowedPurposes.has(purpose)) {
      next(
        new HttpError(
          400,
          "Tujuan upload tidak valid.",
          { allowedPurposes: Array.from(allowedPurposes) },
          "INVALID_UPLOAD_PURPOSE",
        ),
      );
      return;
    }

    const storageKey = path.relative(env.uploadDir, req.file.path).replaceAll(path.sep, "/");
    const publicBaseUrl = `${req.protocol}://${req.get("host")}`;
    res.status(201).json({
      data: {
        imageUrl: `${publicBaseUrl}/uploads/${storageKey}`,
        storageKey,
        alt: req.body?.alt || req.file.originalname || "Gambar CommunityMap",
      },
    });
  });
});

module.exports = { uploadsRouter: router };
