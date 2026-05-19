# Arsitektur Singkat

Komponen utama sistem mengikuti rancangan pada PDF:

1. Warga mengirim laporan melalui frontend Next.js.
2. Backend Express memvalidasi data, autentikasi pengguna, dan menyimpan metadata laporan.
3. Foto laporan disimpan ke AWS S3.
4. Data inti disimpan di PostgreSQL.
5. Peta publik dan dashboard admin mengambil data dari backend.
6. Perubahan status dapat dipancarkan ke frontend melalui service realtime.

## Aktor

- `citizen`: kirim laporan, lihat peta, upvote, cek riwayat
- `admin`: verifikasi laporan, update status, monitor statistik

## Batas Tanggung Jawab

- Frontend fokus pada pengalaman pengguna dan konsumsi API
- Backend fokus pada aturan bisnis dan keamanan data
- Database dan infra fokus pada persistence, storage, env, dan deployment
