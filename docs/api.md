# Draft API

Kontrak ini masih kasar, tapi cukup untuk mulai kerja paralel.

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Reports

- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/reports`
- `GET /api/reports/me`

## Upvotes

- `POST /api/reports/:id/upvote`
- `DELETE /api/reports/:id/upvote`

## Admin

- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id/verify`
- `PATCH /api/admin/reports/:id/status`
- `GET /api/admin/stats`

## Query yang Perlu Didukung

- filter kategori
- filter status
- filter tanggal
- filter wilayah
- sorting terbaru atau paling banyak upvote
