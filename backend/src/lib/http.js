class HttpError extends Error {
  constructor(status, message, details, code) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
    this.code = code || defaultCode(status);
  }
}

function assert(condition, status, message, details) {
  if (!condition) {
    throw new HttpError(status, message, details);
  }
}

function defaultCode(status) {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 413) return "PAYLOAD_TOO_LARGE";
  if (status === 415) return "UNSUPPORTED_MEDIA_TYPE";
  if (status >= 500) return "INTERNAL_SERVER_ERROR";
  return "REQUEST_ERROR";
}

module.exports = {
  HttpError,
  assert,
};
