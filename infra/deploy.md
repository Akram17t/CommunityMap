# Deployment Notes

## Target Awal

- Frontend: AWS Amplify
- Backend: AWS EC2
- Database: AWS RDS PostgreSQL
- File Upload: AWS S3
- Realtime: Supabase Realtime

## Urutan Integrasi yang Disarankan

1. Siapkan database lokal lewat Docker
2. Finalkan schema dan endpoint dasar
3. Sambungkan upload foto ke S3
4. Tambahkan autentikasi JWT
5. Hubungkan realtime untuk update status laporan
6. Deploy frontend dan backend ke AWS
