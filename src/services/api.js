/**
 * Service layer untuk komunikasi dengan Google Apps Script
 * Semua request ke GAS endpoint lewat sini
 */

const GAS_URL = import.meta.env.VITE_GAS_URL || ''

/**
 * GET request ke GAS
 */
async function gasGet(action, params = {}) {
  if (!GAS_URL || GAS_URL.includes('YOUR_SCRIPT_ID')) {
    // Return dummy data jika GAS belum dikonfigurasi
    return getDummyData(action, params)
  }

  const url = new URL(GAS_URL)
  url.searchParams.set('action', action)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v)
    }
  })

  const res = await fetch(url.toString(), { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

/**
 * POST request ke GAS
 */
async function gasPost(action, data) {
  if (!GAS_URL || GAS_URL.includes('YOUR_SCRIPT_ID')) {
    console.log('[API Mock] POST', action, data)
    return { success: true, message: 'Mock: GAS belum dikonfigurasi' }
  }

  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, data }),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const result = await res.json()
  if (result.error) throw new Error(result.error)
  return result
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const api = {
  // READ
  getAllPos:        ()               => gasGet('getAllPos'),
  getSummary:      ()               => gasGet('getSummary'),
  getDemografi:    (pos_id)         => gasGet('getDemografi', { pos_id }),
  getTokoh:        (pos_id)         => gasGet('getTokoh', { pos_id }),
  getBinter:       (pos_id, bulan)  => gasGet('getBinter', { pos_id, bulan }),
  getKerawanan:    (pos_id, status) => gasGet('getKerawanan', { pos_id, status }),
  getAllKerawanan:  ()               => gasGet('getAllKerawanan'),
  getAllBinter:     ()               => gasGet('getAllBinter'),

  // WRITE
  addTokoh:        (data) => gasPost('addTokoh', data),
  updateTokoh:     (data) => gasPost('updateTokoh', data),
  deleteTokoh:     (data) => gasPost('deleteTokoh', data),
  addBinter:       (data) => gasPost('addBinter', data),
  updateBinter:    (data) => gasPost('updateBinter', data),
  addKerawanan:    (data) => gasPost('addKerawanan', data),
  updateKerawanan: (data) => gasPost('updateKerawanan', data),
  updateDemografi: (data) => gasPost('updateDemografi', data),
  updatePos:       (data) => gasPost('updatePos', data),
}

// ─── Dummy Data (sebelum GAS dikonfigurasi) ───────────────────────────────────

function getDummyData(action, params) {
  switch (action) {
    case 'getAllPos':
      return DUMMY_POS

    case 'getSummary':
      return {
        total_pos: 17,
        total_penduduk: 24750,
        total_kk: 6120,
        kerawanan_aktif: 5,
        binter_bulan_ini: 12,
      }

    case 'getDemografi':
      return {
        pos_id: params.pos_id,
        total_penduduk: 1450,
        total_kk: 360,
        islam: 980, kristen: 320, katolik: 110, hindu: 20, buddha: 15, konghucu: 0, lainnya: 5,
        masjid: 3, gereja: 2, pura: 1, vihara: 0,
        geografi: 'Wilayah perbukitan dengan vegetasi lebat, berbatasan langsung dengan Malaysia di sebelah utara. Akses jalan tanah sepanjang 45 km dari kota terdekat.',
        demografi_notes: 'Mayoritas penduduk adalah Suku Dayak dan Tidung. Terdapat beberapa komunitas pendatang dari Sulawesi dan Jawa.',
        konsos_notes: 'Kondisi sosial relatif kondusif. Hubungan antar etnis dan agama berjalan harmonis. Tingkat pendidikan rata-rata SMP.',
      }

    case 'getTokoh':
      return [
        { id: 'T001', pos_id: params.pos_id, nama: 'Petrus Laing', kategori: 'Adat', jabatan: 'Kepala Adat', alamat: 'Desa Long Bawan', no_telp: '081234567890', catatan: 'Tokoh berpengaruh, kooperatif' },
        { id: 'T002', pos_id: params.pos_id, nama: 'H. Amiruddin', kategori: 'Agama', jabatan: 'Ketua MUI Kecamatan', alamat: 'Desa Long Midang', no_telp: '082345678901', catatan: '' },
        { id: 'T003', pos_id: params.pos_id, nama: 'Camat Krayan', kategori: 'Masyarakat', jabatan: 'Camat', alamat: 'Kantor Kecamatan Krayan', no_telp: '083456789012', catatan: 'Aktif koordinasi dengan Satgas' },
      ]

    case 'getBinter':
      return [
        { id: 'B001', pos_id: params.pos_id, tanggal: '2026-06-10', jenis_kegiatan: 'Pengobatan Gratis', lokasi: 'Balai Desa Long Bawan', sasaran: 'Warga Desa', jumlah_peserta: 120, keterangan: 'Bekerjasama dengan Puskesmas setempat', foto_url: '' },
        { id: 'B002', pos_id: params.pos_id, tanggal: '2026-06-05', jenis_kegiatan: 'Olahraga Bersama', lokasi: 'Lapangan Desa', sasaran: 'Pemuda Desa', jumlah_peserta: 45, keterangan: 'Turnamen voli dan futsal', foto_url: '' },
        { id: 'B003', pos_id: params.pos_id, tanggal: '2026-05-28', jenis_kegiatan: 'Penyuluhan Hukum', lokasi: 'Balai Desa', sasaran: 'Tokoh Masyarakat', jumlah_peserta: 30, keterangan: 'Sosialisasi hukum lintas batas negara', foto_url: '' },
      ]

    case 'getKerawanan':
      return [
        { id: 'K001', pos_id: params.pos_id, tanggal: '2026-06-12', kategori: 'Ilegal Logging', deskripsi: 'Ditemukan aktivitas penebangan liar di sekitar koordinat 3.85°N 117.1°E', status: 'aktif', lat: 3.85, lng: 117.1, pelaku: 'Tidak diketahui', tindak_lanjut: 'Koordinasi dengan Polhut', foto_url: '' },
        { id: 'K002', pos_id: params.pos_id, tanggal: '2026-06-01', kategori: 'Lintas Batas', deskripsi: 'Terdeteksi 3 orang warga Malaysia masuk tanpa dokumen resmi', status: 'selesai', lat: 3.9, lng: 117.2, pelaku: 'WN Malaysia', tindak_lanjut: 'Dikembalikan ke Malaysia melalui jalur resmi', foto_url: '' },
      ]

    case 'getAllKerawanan':
      return DUMMY_KERAWANAN

    case 'getAllBinter':
      return DUMMY_BINTER

    default:
      return []
  }
}

const DUMMY_POS = [
  { pos_id: 'POS-01', nama_pos: 'Pos Long Bawan',     lokasi_desa: 'Long Bawan',    kabupaten: 'Nunukan',  lat: 3.900, lng: 115.700, komandan_pos: 'Lettu Kav Ahmad S.',    jumlah_personel: 32, foto_satelit_url: '' },
  { pos_id: 'POS-02', nama_pos: 'Pos Long Midang',    lokasi_desa: 'Long Midang',   kabupaten: 'Nunukan',  lat: 3.950, lng: 115.850, komandan_pos: 'Lettu Kav Budi P.',      jumlah_personel: 28, foto_satelit_url: '' },
  { pos_id: 'POS-03', nama_pos: 'Pos Ba\'kelalan',    lokasi_desa: 'Sittang',       kabupaten: 'Nunukan',  lat: 3.720, lng: 115.610, komandan_pos: 'Lettu Kav Cahyo W.',     jumlah_personel: 30, foto_satelit_url: '' },
  { pos_id: 'POS-04', nama_pos: 'Pos Labang',         lokasi_desa: 'Labang',        kabupaten: 'Nunukan',  lat: 4.120, lng: 116.200, komandan_pos: 'Lettu Kav Dedi R.',      jumlah_personel: 25, foto_satelit_url: '' },
  { pos_id: 'POS-05', nama_pos: 'Pos Simanggaris',    lokasi_desa: 'Simanggaris',   kabupaten: 'Nunukan',  lat: 4.220, lng: 117.230, komandan_pos: 'Lettu Kav Eko F.',       jumlah_personel: 35, foto_satelit_url: '' },
  { pos_id: 'POS-06', nama_pos: 'Pos Sei Ular',       lokasi_desa: 'Sei Ular',      kabupaten: 'Nunukan',  lat: 4.080, lng: 117.480, komandan_pos: 'Lettu Kav Fajar M.',     jumlah_personel: 27, foto_satelit_url: '' },
  { pos_id: 'POS-07', nama_pos: 'Pos Nunukan',        lokasi_desa: 'Nunukan',       kabupaten: 'Nunukan',  lat: 4.140, lng: 117.660, komandan_pos: 'Kapten Kav Gunawan T.', jumlah_personel: 40, foto_satelit_url: '' },
  { pos_id: 'POS-08', nama_pos: 'Pos Lumbis',         lokasi_desa: 'Lumbis',        kabupaten: 'Nunukan',  lat: 3.980, lng: 116.980, komandan_pos: 'Lettu Kav Hendra K.',    jumlah_personel: 29, foto_satelit_url: '' },
  { pos_id: 'POS-09', nama_pos: 'Pos Long Nawang',    lokasi_desa: 'Long Nawang',   kabupaten: 'Malinau',  lat: 3.200, lng: 114.860, komandan_pos: 'Lettu Kav Irfan S.',     jumlah_personel: 26, foto_satelit_url: '' },
  { pos_id: 'POS-10', nama_pos: 'Pos Long Alango',    lokasi_desa: 'Long Alango',   kabupaten: 'Malinau',  lat: 3.380, lng: 115.120, komandan_pos: 'Lettu Kav Joko P.',      jumlah_personel: 24, foto_satelit_url: '' },
  { pos_id: 'POS-11', nama_pos: 'Pos Apau Ping',      lokasi_desa: 'Apau Ping',     kabupaten: 'Malinau',  lat: 3.110, lng: 115.350, komandan_pos: 'Lettu Kav Kurnia A.',    jumlah_personel: 22, foto_satelit_url: '' },
  { pos_id: 'POS-12', nama_pos: 'Pos Pujungan',       lokasi_desa: 'Pujungan',      kabupaten: 'Malinau',  lat: 2.770, lng: 115.540, komandan_pos: 'Lettu Kav Lukman H.',    jumlah_personel: 28, foto_satelit_url: '' },
  { pos_id: 'POS-13', nama_pos: 'Pos Long Pujungan',  lokasi_desa: 'Long Pujungan', kabupaten: 'Malinau',  lat: 2.550, lng: 115.680, komandan_pos: 'Lettu Kav Mario B.',     jumlah_personel: 23, foto_satelit_url: '' },
  { pos_id: 'POS-14', nama_pos: 'Pos Long Kemuat',    lokasi_desa: 'Long Kemuat',   kabupaten: 'Malinau',  lat: 2.350, lng: 115.820, komandan_pos: 'Lettu Kav Nanang S.',    jumlah_personel: 21, foto_satelit_url: '' },
  { pos_id: 'POS-15', nama_pos: 'Pos Long Ampung',    lokasi_desa: 'Long Ampung',   kabupaten: 'Malinau',  lat: 2.680, lng: 116.050, komandan_pos: 'Lettu Kav Oscar P.',     jumlah_personel: 25, foto_satelit_url: '' },
  { pos_id: 'POS-16', nama_pos: 'Pos Long Sule',      lokasi_desa: 'Long Sule',     kabupaten: 'Malinau',  lat: 2.420, lng: 115.370, komandan_pos: 'Lettu Kav Prima W.',     jumlah_personel: 20, foto_satelit_url: '' },
  { pos_id: 'POS-17', nama_pos: 'Pos Long Metun',     lokasi_desa: 'Long Metun',    kabupaten: 'Malinau',  lat: 2.200, lng: 115.150, komandan_pos: 'Lettu Kav Qomar I.',     jumlah_personel: 22, foto_satelit_url: '' },
]

const DUMMY_KERAWANAN = [
  { id: 'K001', pos_id: 'POS-01', tanggal: '2026-06-12', kategori: 'Ilegal Logging',    deskripsi: 'Aktivitas penebangan liar di zona perbatasan', status: 'aktif',   lat: 3.910, lng: 115.720 },
  { id: 'K002', pos_id: 'POS-05', tanggal: '2026-06-10', kategori: 'Lintas Batas',      deskripsi: 'Warga asing masuk tanpa dokumen resmi',         status: 'selesai', lat: 4.230, lng: 117.250 },
  { id: 'K003', pos_id: 'POS-07', tanggal: '2026-06-08', kategori: 'Kriminal',          deskripsi: 'Pencurian ternak warga di daerah perbatasan',    status: 'aktif',   lat: 4.150, lng: 117.680 },
  { id: 'K004', pos_id: 'POS-03', tanggal: '2026-06-05', kategori: 'Illegal Mining',    deskripsi: 'Penambangan emas ilegal di sungai perbatasan',   status: 'aktif',   lat: 3.730, lng: 115.620 },
  { id: 'K005', pos_id: 'POS-12', tanggal: '2026-05-30', kategori: 'Human Trafficking', deskripsi: 'Terdeteksi jaringan TKI ilegal via jalur tikus',  status: 'aktif',   lat: 2.780, lng: 115.550 },
]

const DUMMY_BINTER = [
  { id: 'B001', pos_id: 'POS-01', tanggal: '2026-06-10', jenis_kegiatan: 'Pengobatan Gratis', lokasi: 'Long Bawan',  jumlah_peserta: 120 },
  { id: 'B002', pos_id: 'POS-05', tanggal: '2026-06-08', jenis_kegiatan: 'Bakti Sosial',      lokasi: 'Simanggaris', jumlah_peserta: 85 },
  { id: 'B003', pos_id: 'POS-07', tanggal: '2026-06-06', jenis_kegiatan: 'Olahraga Bersama',  lokasi: 'Nunukan',     jumlah_peserta: 60 },
  { id: 'B004', pos_id: 'POS-03', tanggal: '2026-06-04', jenis_kegiatan: 'Penyuluhan Hukum',  lokasi: 'Sittang',     jumlah_peserta: 35 },
  { id: 'B005', pos_id: 'POS-09', tanggal: '2026-06-02', jenis_kegiatan: 'Silaturahmi Tokoh', lokasi: 'Long Nawang', jumlah_peserta: 20 },
]
