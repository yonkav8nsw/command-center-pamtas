// Helper agregasi data demografi.
// demografiService.getByPos() / getAll() mengembalikan ARRAY row (bisa kosong,
// bisa banyak row per pos). Konsumen yang butuh ringkasan satu-pos memakai
// helper ini agar konsisten dengan nama kolom skema Supabase aktual:
//   total_penduduk, total_kk, islam, kristen, katolik, hindu, buddha,
//   konghucu, lainnya, masjid, gereja, pura, vihara, geografi,
//   demografi_notes, konsos_notes
//
// Skema TIDAK memiliki kolom laki_laki / perempuan, jadi rasio jenis kelamin
// tidak diturunkan di sini.

const NUMERIC_FIELDS = [
  'total_penduduk', 'total_kk',
  'islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'lainnya',
  'masjid', 'gereja', 'pure', 'vihara',
]

// Text fields yang harus dipertahankan dari row pertama (tidak di-aggregate)
// BUG-09/BUG-10 fix: GeoDemoKonsos butuh field ini untuk edit form initial value
const TEXT_FIELDS = [
  'geografi', 'demografi_notes', 'konsos_notes',
]

/**
 * Agregasi array row demografi menjadi satu objek ringkasan.
 * - Field numerik: dijumlahkan dari semua row
 * - Field teks: diambil dari row pertama (tidak di-aggregate)
 *
 * @param {Array|Object|null} demografi - hasil useDemografi (array), atau objek tunggal, atau null
 * @returns {Object|null} objek ringkasan dengan field numerik terjumlah & text fields dipertahankan, atau null jika tidak ada data
 */
export function aggregateDemografi(demografi) {
  // Normalisasi ke array
  const rows = Array.isArray(demografi)
    ? demografi
    : (demografi ? [demografi] : [])

  if (rows.length === 0) return null

  // Mulai dari objek kosong, lalu tambahkan field dari row pertama (prioritas text fields)
  const summary = {}
  const firstRow = rows[0]

  // Preserve text fields dari row pertama (tidak di-aggregate, hanya satu nilai)
  TEXT_FIELDS.forEach(f => {
    if (firstRow?.[f] !== undefined && firstRow[f] !== null) {
      summary[f] = firstRow[f]
    }
  })

  // Inisialisasi numerik fields ke 0
  NUMERIC_FIELDS.forEach(f => { summary[f] = 0 })

  // Jumlahkan field numerik dari semua row
  for (const row of rows) {
    NUMERIC_FIELDS.forEach(f => {
      summary[f] = (Number(summary[f]) || 0) + (Number(row?.[f]) || 0)
    })
  }

  return summary
}
