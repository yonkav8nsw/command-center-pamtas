-- ============================================================
-- SEED TABLE: demografi
-- Data estimasi kependudukan per wilayah tugas Pos Pamtas
-- Jalankan di Supabase SQL Editor
-- CATATAN: Ini data PLACEHOLDER — update dengan data aktual
--          dari BPS/Disdukcapil setempat
-- ============================================================

-- Hapus data lama jika ada, lalu insert ulang
DELETE FROM demografi;

INSERT INTO demografi (
  pos_id,
  total_penduduk, total_kk,
  islam, kristen, katolik, hindu, buddha, konghucu, lainnya,
  masjid, gereja, pura, vihara
) VALUES
  -- KT: Pos Kotis — Nunukan Tengah (kota, padat)
  ('KT',   8420, 2105,  7150,  680,  320,  80,  120,  50,  20,  12,  4,  1,  1),

  -- AJ: Pos Aji Kuning — Sebatik Tengah (perbatasan, banyak TKI)
  ('AJ',   4230, 1058,  3820,  220,   90,  40,   40,  15,   5,   8,  2,  0,  0),

  -- TA: Pos Tanjung Aru — Sebatik Timur (nelayan, pesisir)
  ('TA',   3180,  795,  2750,  230,  110,  30,   40,  15,   5,   6,  2,  0,  0),

  -- BB: Pos Bambangan — Sebatik Barat
  ('BB',   2640,  660,  2280,  190,   90,  30,   30,  15,   5,   5,  2,  0,  0),

  -- BK: Pos Bukit Keramat — Nunukan (dataran tinggi, jarang)
  ('BK',   1420,  355,  1250,   90,   50,  15,   10,   4,   1,   3,  1,  0,  0),

  -- GSG: Pos Gabma Seimanggaris — Simanggaris (agak terpencil)
  ('GSG',  2850,  713,  2540,  180,   75,  25,   20,   8,   2,   5,  1,  0,  0),

  -- KD: Pos Kanduangan — Simanggaris
  ('KD',   1960,  490,  1730,  130,   60,  20,   12,   6,   2,   4,  1,  0,  0),

  -- SU: Pos Sei Ular — Simanggaris (terpencil)
  ('SU',   1240,  310,  1090,   90,   35,  12,    8,   4,   1,   2,  1,  0,  0),

  -- SK: Pos Sei Kaca — Seimanggaris (kecil)
  ('SK',    840,  210,   740,   60,   25,   8,    5,   2,   0,   2,  1,  0,  0),

  -- TB: Pos Tembalang — Sebuku (sedang)
  ('TB',   3420,  855,  2980,  260,  110,  35,   25,   8,   2,   6,  2,  0,  0),

  -- SL: Pos Salang — Tulin Onsoi (pedalaman)
  ('SL',    920,  230,   820,   60,   25,   8,    5,   2,   0,   2,  0,  0,  0),

  -- SMB: Pos Seimanggaris Baru — Simanggaris
  ('SMB',  1580,  395,  1390,  110,   45,  15,   12,   6,   2,   3,  1,  0,  0),

  -- SML: Pos Seimanggaris Lama — Simanggaris (lebih tua, lebih kecil)
  ('SML',  1120,  280,   990,   80,   30,  10,    7,   3,   0,   2,  1,  0,  0),

  -- LB: Pos Labang — Lumbis Pasiangan (pedalaman jauh)
  ('LB',    680,  170,   590,   55,   20,   8,    5,   2,   0,   1,  1,  0,  0),

  -- GSL: Pos Gabma Seliku — Malaysia (wilayah tugas di perbatasan)
  ('GSL',   420,  105,   360,   35,   15,   5,    3,   2,   0,   1,  0,  0,  0),

  -- ML: Pos Mensalong — Nunukan (sedang)
  ('ML',   2180,  545,  1920,  160,   60,  20,   12,   6,   2,   4,  1,  0,  0),

  -- LMS: Pos Lumbis — Lumbis Hulu (paling terpencil, hulu sungai)
  ('LMS',   560,  140,   490,   45,   15,   5,    3,   2,   0,   1,  1,  0,  0);

-- Verifikasi hasil
SELECT
  pos_id,
  total_penduduk,
  total_kk,
  (islam + kristen + katolik + hindu + buddha + konghucu + lainnya) AS total_agama_check
FROM demografi
ORDER BY pos_id;
