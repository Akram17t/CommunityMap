# Database

Area untuk kebutuhan PostgreSQL.

Isi awal:
- `schema.sql` untuk struktur tabel utama
- `seed.sql` untuk data awal kategori laporan

Kalau nanti project makin stabil, migrasi bisa dipisah lebih formal dari sini.

Catatan:
- Saat backend Express hidup, bootstrap aplikasi juga akan menjalankan migrasi ringan dan auto-seed akun demo beserta 40 laporan seed yang tersebar di Pulau Jawa ke PostgreSQL atau in-memory database.
