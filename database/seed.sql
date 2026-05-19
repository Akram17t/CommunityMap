INSERT INTO report_categories (slug, name)
VALUES
  ('pothole', 'Jalan Berlubang'),
  ('streetlight', 'Lampu Jalan Mati'),
  ('puddle', 'Genangan Air'),
  ('flood', 'Banjir Lokal'),
  ('other', 'Lainnya')
ON CONFLICT (slug) DO NOTHING;
