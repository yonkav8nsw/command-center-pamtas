/**
 * PDF Generator — Military-style operational report for Command Center PAMTAS
 * Uses jsPDF for direct PDF generation
 */
import { jsPDF } from 'jspdf'

// ── Color palette ──────────────────────────────────────────────
const C = {
  header:   [5, 11, 6],
  gold:     [212, 175, 55],
  text:     [30, 30, 30],
  muted:    [100, 100, 100],
  tblHdr:   [20, 40, 20],
  tblRow:   [248, 248, 248],
  tblAlt:   [240, 244, 240],
  divider:  [180, 180, 180],
  red:      [180, 30, 30],
  green:    [0, 120, 50],
  white:    [255, 255, 255],
}

// ── Layout constants (A4 mm) ──────────────────────────────────
const PW   = 210   // page width
const PH   = 297   // page height
const ML   = 15    // margin left
const MR   = 15    // margin right
const CW   = PW - ML - MR  // content width
const MT   = 18    // margin top (after banner)

// ── Primitive draw helpers ──────────────────────────────────────
function setFont(doc, bold, size) {
  doc.setFont(bold ? 'helvetica' : 'helvetica', bold ? 'bold' : 'normal')
  doc.setFontSize(size)
}

function txt(doc, text, x, y, opts = {}) {
  setFont(doc, opts.bold || false, opts.size || 9)
  doc.setTextColor(...(opts.color || C.text))
  const align = opts.align || 'left'
  const maxW  = opts.maxWidth || CW
  if (align === 'center') {
    doc.text(String(text || '—'), x + CW / 2, y, { align: 'center', maxWidth: maxW })
  } else if (align === 'right') {
    doc.text(String(text || '—'), x + CW, y, { align: 'right', maxWidth: maxW })
  } else {
    doc.text(String(text || '—'), x, y, { maxWidth: maxW })
  }
}

function line(doc, y, color, lw = 0.3) {
  doc.setDrawColor(...color)
  doc.setLineWidth(lw)
  doc.line(ML, y, PW - MR, y)
}

function filledRect(doc, x, y, w, h, fillColor) {
  doc.setFillColor(...fillColor)
  doc.rect(x, y, w, h, 'F')
}

function strokedRect(doc, x, y, w, h, strokeColor, lw = 0.2) {
  doc.setDrawColor(...strokeColor)
  doc.setLineWidth(lw)
  doc.rect(x, y, w, h, 'D')
}

function rect(doc, x, y, w, h, fillColor, strokeColor, lw = 0.2) {
  if (fillColor)   filledRect(doc, x, y, w, h, fillColor)
  if (strokeColor) strokedRect(doc, x, y, w, h, strokeColor, lw)
}

// ── Header banner ──────────────────────────────────────────────
function drawBanner(doc) {
  // Dark green top bar
  rect(doc, 0, 0, PW, 9, C.header, null)
  txt(doc, 'PEMERINTAH REPUBLIK INDONESIA  —  SATGAS PAMTAS RI-MLY  YONKAV 8/NSW  TA 2026',
    ML, 5.5, { bold: true, size: 6.5, color: C.white, align: 'center' })

  // Gold strip
  rect(doc, 0, 9, PW, 4, C.gold, null)
  txt(doc, 'DOKUMEN ASLI  —  COMMAND CENTER SATGAS PAMTAS RI-MLY  YONKAV 8/NSW  TA 2026',
    ML, 11.8, { bold: true, size: 6, color: C.header, align: 'center' })
}

// ── Title block ────────────────────────────────────────────────
function drawTitle(doc, title, subtitle) {
  let y = 20
  txt(doc, title, ML, y, { bold: true, size: 15, color: C.header, align: 'center' })
  y += 7
  if (subtitle) {
    txt(doc, subtitle, ML, y, { bold: true, size: 10, color: C.gold, align: 'center' })
    y += 5
  }
  line(doc, y, C.gold, 0.6)
  return y + 4
}

// ── Meta rows ─────────────────────────────────────────────────
function drawMeta(doc, rows, startY) {
  let y = startY
  for (const [label, value] of rows) {
    txt(doc, `${label}:`, ML, y, { bold: true, size: 8, color: C.muted })
    txt(doc, String(value || '—'), ML + 40, y, { size: 8, color: C.text })
    y += 5
  }
  line(doc, y + 1, C.divider, 0.3)
  return y + 4
}

// ── Section header bar ─────────────────────────────────────────
function drawSection(doc, label, y) {
  rect(doc, ML, y, CW, 7, C.tblHdr, C.divider)
  txt(doc, label.toUpperCase(), ML + 2, y + 5, { bold: true, size: 8, color: C.white })
  return y + 10
}

// ── Field row ─────────────────────────────────────────────────
function drawField(doc, label, value, y, shade = false) {
  const rowH = 6
  if (shade) rect(doc, ML, y - 3.5, CW, rowH, C.tblAlt, C.divider)
  txt(doc, label.toUpperCase(), ML + 2, y, { bold: true, size: 8, color: C.muted })
  txt(doc, String(value || '—'), ML + 50, y, { size: 9, color: C.text })
}

// ── Paragraph ────────────────────────────────────────────────
function drawPara(doc, text, y) {
  if (!text) return y
  setFont(doc, false, 9)
  doc.setTextColor(...C.text)
  const lines = doc.splitTextToSize(text, CW)
  doc.text(lines, ML, y)
  return y + lines.length * 4.5 + 2
}

// ── Table ────────────────────────────────────────────────────
function drawTable(doc, headers, rows, startY) {
  const cols = headers.length
  const colW = CW / cols
  let y = startY
  const rowH = 7

  // Header
  rect(doc, ML, y, CW, rowH, C.tblHdr, C.divider)
  headers.forEach((h, i) => {
    txt(doc, h.toUpperCase(), ML + i * colW + 2, y + 4.8, { bold: true, size: 7.5, color: C.white })
  })
  y += rowH

  rows.forEach((row, ri) => {
    if (y + rowH > PH - 22) {
      doc.addPage()
      y = MT
    }
    const fill = ri % 2 === 0 ? C.tblRow : C.tblAlt
    rect(doc, ML, y, CW, rowH, fill, C.divider)
    row.forEach((cell, ci) => {
      const lines = doc.splitTextToSize(String(cell || '—'), colW - 4)
      txt(doc, lines.slice(0, 2).join('\n'), ML + ci * colW + 2, y + 4.8, { size: 7.5 })
    })
    y += rowH
  })

  return y + 3
}

// ── Footer ───────────────────────────────────────────────────
function drawFooter(doc) {
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    const y = PH - 12
    line(doc, y, C.gold, 0.5)
    txt(doc, 'DOKUMEN ASLI COMMAND CENTER SATGAS PAMTAS RI - MLY YONKAV 8/NSW TA 2026',
      ML, y + 4, { bold: true, size: 6, color: C.gold, align: 'center' })
    txt(doc, `Generated: ${new Date().toLocaleString('id-ID')}  |  Hal. ${i} dari ${pages}`,
      ML, y + 9, { size: 6, color: C.muted, align: 'center' })
  }
}

// ══════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════

/**
 * Download PDF: single kerawanan/insiden
 */
export function downloadKerawananPDF(item, posName) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = MT

  drawBanner(doc)
  y = drawTitle(doc, 'LAPORAN INSIDEN KERAWANAN', (item.kategori || '').toUpperCase())
  y = drawMeta(doc, [
    ['Tanggal Pencetakan', new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ['Kategori', item.kategori || '—'],
    ['Status', (item.status || '').toUpperCase()],
  ], y)

  // Status highlight
  const statusColor = item.status?.toLowerCase() === 'aktif' ? C.red : C.green
  txt(doc, `STATUS: ${(item.status || '—').toUpperCase()}`, ML, y, { bold: true, size: 9, color: statusColor })
  y += 6
  line(doc, y, C.divider, 0.3)
  y += 4

  // Info section
  y = drawSection(doc, 'Informasi Insiden', y)
  drawField(doc, 'Jenis Insiden', item.kategori || '—', y)
  y += 7
  drawField(doc, 'Tanggal / Waktu', `${item.tanggal || '—'}${item.waktu ? ' ' + item.waktu : ''}`, y, true)
  y += 7
  drawField(doc, 'Pos Penanggung Jawab', posName || item.pos_id || '—', y)
  y += 7
  drawField(doc, 'Lokasi Insiden', item.lokasi || item.pos_id || '—', y, true)
  y += 7
  drawField(doc, 'Jumlah Pelaku', String(item.jumlah_pelaku || item.pelaku || '—'), y)
  y += 9

  if (item.deskripsi) {
    y = drawSection(doc, 'Uraian Insiden', y)
    y = drawPara(doc, item.deskripsi, y)
    y += 3
  }

  if (item.tindak_lanjut) {
    y = drawSection(doc, 'Penanganan / Tindak Lanjut', y)
    y = drawPara(doc, item.tindak_lanjut, y)
    y += 3
  }

  if (item.lat && item.lng) {
    y = drawSection(doc, 'Koordinat TKP', y)
    drawField(doc, 'Latitude', String(item.lat), y)
    y += 7
    drawField(doc, 'Longitude', String(item.lng), y, true)
  }

  drawFooter(doc)

  const safe = (item.kategori || 'INSIDEN').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  const date  = item.tanggal || new Date().toISOString().split('T')[0]
  doc.save(`INSIDEN_${safe}_${date}.pdf`)
}

/**
 * Download PDF: daftar kerawanan/insiden
 */
export function downloadKerawananListPDF(items, filters, posMap = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = MT

  drawBanner(doc)
  y = drawTitle(doc, 'DAFTAR LAPORAN INSIDEN', 'REKAPITULASI KERAWANAN PERBATASAN')
  y = drawMeta(doc, [
    ['Dicetak', new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ['Total Data', `${items.length} insiden`],
    ['Filter', filters || 'Semua'],
  ], y)

  const headers = ['No', 'Tanggal', 'Pos', 'Kategori', 'Deskripsi', 'Status']
  const rows = items.map((k, i) => [
    String(i + 1),
    k.tanggal || '—',
    posMap[k.pos_id] || k.pos_id || '—',
    k.kategori || '—',
    (k.deskripsi || '—').slice(0, 55),
    (k.status || '—').toUpperCase(),
  ])

  y = drawTable(doc, headers, rows, y)
  drawFooter(doc)
  doc.save(`DAFTAR_INSIDEN_${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Download PDF: single binter/kegiatan
 */
export function downloadBinterPDF(item, posName) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = MT

  drawBanner(doc)
  y = drawTitle(doc, 'LAPORAN KEGIATAN BINTER', (item.jenis_kegiatan || '').toUpperCase())
  y = drawMeta(doc, [
    ['Tanggal Pencetakan', new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ['Jenis Kegiatan', item.jenis_kegiatan || '—'],
  ], y)
  y += 3

  y = drawSection(doc, 'Informasi Kegiatan', y)
  drawField(doc, 'Jenis Kegiatan', item.jenis_kegiatan || '—', y)
  y += 7
  drawField(doc, 'Tanggal', item.tanggal || '—', y, true)
  y += 7
  drawField(doc, 'Pos Pelaksanaan', posName || item.pos_id || '—', y)
  y += 7
  drawField(doc, 'Lokasi', item.lokasi || '—', y, true)
  y += 7
  drawField(doc, 'Sasaran', item.sasaran || '—', y)
  y += 7
  drawField(doc, 'Jumlah Peserta', String(item.jumlah_peserta || '—'), y, true)
  y += 9

  if (item.keterangan) {
    y = drawSection(doc, 'Keterangan / Catatan', y)
    y = drawPara(doc, item.keterangan, y)
  }

  drawFooter(doc)

  const safe = (item.jenis_kegiatan || 'KEGIATAN').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  const date  = item.tanggal || new Date().toISOString().split('T')[0]
  doc.save(`BINTER_${safe}_${date}.pdf`)
}

/**
 * Download PDF: daftar binter/kegiatan
 */
export function downloadBinterListPDF(items, filters, posMap = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = MT

  drawBanner(doc)
  y = drawTitle(doc, 'DAFTAR PROGRAM BINTER', 'REKAPITULASI KEGIATAN PEMBINAAN TERITORIAL')
  y = drawMeta(doc, [
    ['Dicetak', new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ['Total Data', `${items.length} kegiatan`],
    ['Filter', filters || 'Semua'],
  ], y)

  const headers = ['No', 'Tanggal', 'Pos', 'Jenis', 'Lokasi / Sasaran', 'Peserta']
  const rows = items.map((b, i) => [
    String(i + 1),
    b.tanggal || '—',
    posMap[b.pos_id] || b.pos_id || '—',
    b.jenis_kegiatan || '—',
    ((b.lokasi || '—') + (b.sasaran ? ` · ${b.sasaran}` : '')).slice(0, 55),
    String(b.jumlah_peserta || '—'),
  ])

  y = drawTable(doc, headers, rows, y)
  drawFooter(doc)
  doc.save(`DAFTAR_BINTER_${new Date().toISOString().split('T')[0]}.pdf`)
}
