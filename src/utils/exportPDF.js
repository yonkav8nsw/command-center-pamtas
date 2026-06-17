/**
 * Export halaman ke PDF menggunakan browser print dialog
 * Untuk presentasi ke pejabat
 */
export function exportToPDF(title = 'Command Center Pamtas') {
  const originalTitle = document.title
  document.title = title
  window.print()
  document.title = originalTitle
}

/**
 * Export data ke CSV
 */
export function exportToCSV(data, filename = 'data-pamtas.csv') {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h] ?? ''
      // Escape koma dan newline
      const str = String(val).replace(/"/g, '""')
      return str.includes(',') || str.includes('\n') ? `"${str}"` : str
    }).join(',')
  )

  const csvContent = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
