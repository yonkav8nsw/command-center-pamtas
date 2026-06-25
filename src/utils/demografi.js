// Helper agregasi data demografi.
// demografiService.getByPos() / getAll() mengembalikan ARRAY row (bisa kosong,
// bisa banyak row per pos). Konsumen yang butuh ringkasan satu-pos memakai
// helper ini agar konsisten dengan nama kolom skema Supabase aktual:
//   total_penduduk, total_kk, islam, kristen, katolik, hindu, buddha,
//   konghucu, lainnya, masjid, gereja, pura, vihara
//
// Skema TIDAK memiliki kolom laki_laki / perempuan, jadi rasio jenis kelamin
// tidak diturunkan di sini.

const NUMERIC_FIELDS = [
  'total_penduduk', 'total_kk',
  'islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'lainnya',
  'masjid', 'gereja', 'pura', 'vihara',
]

/**
 * Agregasi array row demografi menjadi satu objek ringkasan.
 * @param {Array|Object|null} demografi - hasil useDemografi (array), atau objek tunggal, atau null
 * @returns {Object|null} objek ringkasan dengan field numerik terjumlah, atau null jika tidak ada data
 */
export function aggregateDemografi(demografi) {
  // Normalisasi ke array
  const rows = Array.isArray(demografi)
    ? demografi
    : (demografi ? [demografi] : [])

  if (rows.length === 0) return null

  // Mulai dari salinan row pertama (mempertahankan field non-numerik seperti
  // geografi / demografi_notes jika ada), lalu jumlahkan field numerik.
  const summary = { ...rows[0] }
  NUMERIC_FIELDS.forEach(f => { summary[f] = 0 })

  for (const row of rows) {
    NUMERIC_FIELDS.forEach(f => {
      summary[f] = (Number(summary[f]) || 0) + (Number(row?.[f]) || 0)
    })
  }

  return summary
}
