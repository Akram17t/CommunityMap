const { HttpError } = require("../lib/http");

function notFoundHandler(_req, _res, next) {
  next(new HttpError(404, "Endpoint tidak ditemukan.", null, "ENDPOINT_NOT_FOUND"));
}

function errorHandler(error, req, res, _next) {
  const status = error instanceof HttpError ? error.status : 500;
  const message =
    error instanceof HttpError
      ? error.message
      : "Terjadi kesalahan pada server.";
  const code =
    error instanceof HttpError ? error.code : "INTERNAL_SERVER_ERROR";

  if (!(error instanceof HttpError)) {
    console.error(`[${req.requestId || "no-request-id"}]`, error);
  }

  res.status(status).json({
    error: {
      status,
      code,
      message,
      details: error.details || null,
      requestId: req.requestId || null,
    },
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
