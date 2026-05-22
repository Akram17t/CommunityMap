# CommunityMap

Platform web crowdsourcing untuk pelaporan kondisi jalan secara real-time.

Folder utama dipisah supaya pembagian kerja jelas:

- `frontend` untuk web app Next.js
- `backend` untuk API dan business logic
- `database` untuk schema dan seed
- `infra` untuk local setup dan deployment
- `docs` untuk catatan rancangan tim

## Menjalankan Project

Cara paling cepat:

```powershell
npm install
run.bat
```

Lalu buka:

- `http://localhost:3000` untuk frontend
- `http://localhost:4000/api/health` untuk cek backend

Alternatif command yang setara:

```powershell
npm run stack:up
```

Kalau sebelumnya ada server lama yang masih nyangkut di port dev, jalankan:

```powershell
npm run dev:clean
```

## Database Lokal

- Jika Docker Desktop aktif, jalankan `npm run db:up` untuk PostgreSQL lokal.
- Jika PostgreSQL belum tersedia, backend otomatis fallback ke database in-memory agar mode dev tetap bisa jalan.
- Jika backend belum aktif saat frontend dibuka di mode development, halaman publik tetap aman dibuka dengan state kosong sampai backend siap.
- Saat backend aktif, sistem akan mengisi akun demo dan 40 laporan seed yang tersebar di Pulau Jawa ke database yang tersedia.

## Akun Demo

- Warga: `warga@email.com` / `password`
- Admin: `admin@dpu.go.id` / `password`
