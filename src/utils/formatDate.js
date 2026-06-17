/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date
 * @param {string} format - 'short' | 'long' | 'datetime'
 */
export function formatDate(date, format = 'short') {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    datetime: { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  }

  return d.toLocaleDateString('id-ID', options[format] || options.short)
}

/**
 * Format angka ke format ribuan Indonesia
 */
export function formatNumber(num) {
  if (num === null || num === undefined || num === '') return '-'
  return Number(num).toLocaleString('id-ID')
}

/**
 * Format koordinat ke derajat-menit-detik
 */
export function formatCoords(lat, lng) {
  if (!lat || !lng) return '-'
  const formatDMS = (val, isLat) => {
    const abs = Math.abs(val)
    const deg = Math.floor(abs)
    const min = Math.floor((abs - deg) * 60)
    const sec = ((abs - deg - min / 60) * 3600).toFixed(1)
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W')
    return `${deg}°${min}'${sec}"${dir}`
  }
  return `${formatDMS(lat, true)}, ${formatDMS(lng, false)}`
}

/**
 * Hitung persentase
 */
export function calcPercent(val, total) {
  if (!total || total === 0) return 0
  return Math.round((val / total) * 100)
}

/**
 * Generate ID unik berbasis timestamp
 */
export function generateId(prefix = 'ID') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

/**
 * Truncate teks panjang
 */
export function truncate(str, maxLen = 60) {
  if (!str) return '-'
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str
}
