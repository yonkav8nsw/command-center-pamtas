-- ============================================================
-- UPSERT TABLE: pos
-- Jalankan di Supabase SQL Editor
-- ============================================================

INSERT INTO pos (pos_id, nama_pos, lokasi_desa, kecamatan, kabupaten, provinsi, lat, lng,
  komandan_pos, danssk, dpp, jumlah_personel, kondisi_bangunan, sumber_air, sumber_listrik,
  jaringan_gsm, jumlah_patok, kerawanan_utama, foto_satelit_url)
VALUES
  ('KT','POS KOTIS','Ds. Pasir Putih','Kec. Nunukan Tengah','Kab. Nunukan','Kalimantan Utara',-8.265254,112.7322575,NULL,NULL,'Letkol Kav Dian Kriswijaya',62,'Permanen','PDAM','PLN','Telkomsel, Indosat',0,'TKI Ilegal, Terorisme, Penyelundupan Narkoba',NULL),
  ('AJ','Pos Aji Kuning','Ds. Aji Kuning, Dsn. Kampung Rambutan','Kel. Sebatik Tengah','Kab. Nunukan','Kalimantan Utara',-8.3022433,112.7434708,'Sertu Ahmad Ahsan','Kapten Kav Sukiman',NULL,23,'Permanen','Sungai & Tadah Hujan','PLN & Solar Cell','Telkomsel, XL, IM3, Indosat',37,'TKI Ilegal, Miras, Illegal Logging, Barang Ilegal, Narkoba',NULL),
  ('TA','Pos Tanjung Aru','Desa Pantai Indah','Kec. Sebatik Timur','Kab. Nunukan','Kalimantan Utara',-8.3051172,112.7458255,'Letda Kav Ibra Rizky Ababil',NULL,NULL,16,'Permanen (Beton)','PDAM','PLN & Panel Surya','Telkomsel 4G, Three',37,'Narkoba, Penyelundupan Barang Ilegal',NULL),
  ('BB','Pos Bambangan','Desa Bambangan','Kec. Sebatik Barat','Kab. Nunukan','Kalimantan Utara',-8.3025682,112.745678,'Letda Kav Eleazer Pattinaya',NULL,NULL,16,'Semi Permanen (Kayu)','Air Sungai','PLN','Telkomsel, Indosat',37,'Perkelahian antar warga, THM, Narkoba, TKI Ilegal',NULL),
  ('BK','Pos Bukit Keramat','Kp. Keramat',NULL,'Kab. Nunukan','Kalimantan Utara',-8.2975417,112.7455469,'Serka Lukman Nurhadi',NULL,NULL,16,'Permanen (Beton)','Selokan & Tadah Hujan','Solar Cell','Nihil',37,'Penyelundupan Barang Ilegal, CPMI, Narkotika',NULL),
  ('GSG','Pos Gabma Seimanggaris','Desa Sekaduyan Taka','Kec. Simanggaris','Kab. Nunukan','Kalimantan Utara',-8.2862491,112.7195053,'Sertu Toto Hari','Kapten Kav Herman',NULL,23,'Permanen','Air Sungai','PLN & PLTS','Telkomsel (terbatas, perlu Starlink)',220,'Narkoba, Miras, Illegal Trafficking',NULL),
  ('KD','Pos Kanduangan','Desa Sekaduyan Taka','Kec. Simanggaris','Kab. Nunukan','Kalimantan Utara',-8.2919343,112.7459579,'Letda Kav Ngurah Krishna',NULL,NULL,16,'Permanen','Air Tanah & Tadah Hujan','PLN','Telkomsel',237,'Narkoba/Miras, Human Trafficking, Illegal Logging, Senjata Rakitan, Laka Lantas, Asusila',NULL),
  ('SU','Pos Sei Ular','Desa Sekaduyan Taka','Kec. Simanggaris','Kab. Nunukan','Kalimantan Utara',-8.2760253,112.7419712,NULL,NULL,'Letda Kav Ngurah Krishna',16,'Permanen','Air Tanah & Tadah Hujan','PLN','Telkomsel',237,'Narkoba/Miras, Human Trafficking, Illegal Logging, Senjata Rakitan, Laka Lantas, Asusila',NULL),
  ('SK','Pos Sei Kaca','Desa Sekaduyan Taka','Kec. Seimanggaris','Kab. Nunukan','Kalimantan Utara',-8.2808168,112.742083,'Serma Harry Maulana',NULL,NULL,16,'Semi Permanen (Kayu)','Air Hujan','PLTS','Telkomsel',0,'Penyelundupan Miras, Kayu Ilegal, Narkoba, TKI Ilegal',NULL),
  ('TB','Pos Tembalang (Kout)','Desa Kekayap','Kec. Sebuku','Kab. Nunukan','Kalimantan Utara',-8.3282597,112.7154584,'Sertu Zainul Fuad','Kapten Kav Dany H.','Kapten Kav Fredy Anggriawan (Wadansatgas)',26,'Permanen','PDAM','PLN','Telkomsel',384,'THM, Miras, Sabu-sabu',NULL),
  ('SL','Pos Salang','Ds. Salang','Kec. Tulin Onsoi','Kab. Nunukan','Kalimantan Utara',-8.3156326,112.6885924,'Serma Riyanto',NULL,NULL,16,'Semi Permanen','Air Sungai & Hujan','PLN','Telkomsel',393,'Banjir, Narkoba (Sabu), Barang Ilegal',NULL),
  ('SMB','Pos Seimanggaris Baru','Dsn. Sei Kalayan Hulu, Desa Sekaduyan Taka','Kec. Simanggaris','Kab. Nunukan','Kalimantan Utara',-8.2980437,112.7216035,'Sertu Zainul Fuad',NULL,NULL,16,'Permanen (Baik)','Sungai & Air Hujan','PLTS','Telkomsel (Blank Spot)',209,'Perkelahian, Illegal Logging, Miras, Narkoba, Rawan Petir',NULL),
  ('SML','Pos Seimanggaris Lama','Desa Tabur Lestari','Kec. Simanggaris','Kab. Nunukan','Kalimantan Utara',-8.3053727,112.6906671,'Letda Kav Patrick Siahaan',NULL,NULL,16,'Kayu Permanen','Air Sungai & Tadah Hujan','Panel Surya','Telkomsel',199,'Illegal Logging, Miras',NULL),
  ('LB','Pos Labang','Ds. Labang','Kec. Lumbis Pasiangan','Kab. Nunukan','Kalimantan Utara',-8.2791336,112.6758735,'Letda Kav Ardan',NULL,NULL,16,'Baik','Air Hujan & Sungai','PLN & Tenaga Surya','Starlink',454,'Perkelahian antar kampung',NULL),
  ('GSL','Pos Gabma Seliku','Kp. Sri Saliku, Sabah',NULL,'Malaysia','Malaysia',-8.3215551,112.6417201,'Letda Kav Mahatva',NULL,NULL,16,'Permanen (Beton)','Air Hujan & Sungai','Genset','Terbatas',456,'Faktor Alam',NULL),
  ('ML','Pos Mensalong','Desa Mansalong',NULL,'Kab. Nunukan','Kalimantan Utara',-8.3092966,112.6324006,'Serka Angga','Lettu Kav Agung Triwasono',NULL,23,'Semi Permanen','PDAM','PLN','4G Telkomsel',443,'Illegal Logging',NULL),
  ('LMS','Pos Lumbis','Ds. Tau Lumbis','Kec. Lumbis Hulu','Kab. Nunukan','Kalimantan Utara',-8.3156161,112.6215331,'Letda Kav Adhitia',NULL,NULL,17,'Baik','Air Sungai','Solar Cell','Telkomsel',852,'Nihil',NULL)
ON CONFLICT (pos_id) DO UPDATE SET
  nama_pos          = EXCLUDED.nama_pos,
  lokasi_desa       = EXCLUDED.lokasi_desa,
  kecamatan         = EXCLUDED.kecamatan,
  kabupaten         = EXCLUDED.kabupaten,
  provinsi          = EXCLUDED.provinsi,
  lat               = EXCLUDED.lat,
  lng               = EXCLUDED.lng,
  komandan_pos      = EXCLUDED.komandan_pos,
  danssk            = EXCLUDED.danssk,
  dpp               = EXCLUDED.dpp,
  jumlah_personel   = EXCLUDED.jumlah_personel,
  kondisi_bangunan  = EXCLUDED.kondisi_bangunan,
  sumber_air        = EXCLUDED.sumber_air,
  sumber_listrik    = EXCLUDED.sumber_listrik,
  jaringan_gsm      = EXCLUDED.jaringan_gsm,
  jumlah_patok      = EXCLUDED.jumlah_patok,
  kerawanan_utama   = EXCLUDED.kerawanan_utama;

