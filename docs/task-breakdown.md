# Pembagian Tugas Awal

Pembagian ini mengikuti PDF, tapi aku tambahkan batas file dan handoff supaya integrasinya lebih gampang.

## 1. Frontend

Owner: Rafi

Fokus:
- bangun UI Next.js untuk peta publik
- buat form kirim laporan
- buat halaman login dan dashboard warga
- buat dashboard admin berdasarkan kontrak API

Folder utama:
- `frontend/src/app`
- `frontend/src/components`
- `frontend/src/features`

Dependensi masuk:
- `docs/api.md`
- format response backend

## 2. Backend

Owner: Argha

Fokus:
- rancang endpoint auth, reports, upvote, dan admin
- validasi payload
- logika upload metadata foto
- status workflow laporan

Folder utama:
- `backend/src/modules`
- `backend/src/middlewares`
- `backend/src/lib`

Dependensi masuk:
- `database/schema.sql`
- kebutuhan field dari frontend

## 3. Cloud / Deployment

Owner: Akram

Fokus:
- siapkan PostgreSQL lokal dan target RDS
- siapkan bucket S3
- siapkan env template
- siapkan strategi deploy frontend dan backend
- siapkan integrasi realtime

Folder utama:
- `database`
- `infra`
- `.env.example`
- `docker-compose.yml`

Dependensi masuk:
- kebutuhan bucket, env, dan endpoint dari backend/frontend

## Titik Integrasi

- Frontend dan backend sepakat dulu payload `report`
- Backend dan cloud sepakat format env dan storage key upload
- Frontend dan cloud sepakat variabel publik seperti `NEXT_PUBLIC_API_BASE_URL`
