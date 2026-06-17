/**
 * COMMAND CENTER SATGAS PAMTAS RI-MAL
 * Google Apps Script Backend — Code.gs
 * Deploy sebagai Web App: Execute as Me, Access: Anyone
 *
 * Struktur Sheet yang diperlukan:
 *   pos | demografi | tokoh | binter | kerawanan
 */

// ── Konfigurasi ─────────────────────────────────────────────
var SPREADSHEET_ID = '' // Kosongkan jika script melekat pada spreadsheet
                        // Isi jika script terpisah dari spreadsheet

var SHEET_NAMES = {
  pos:        'pos',
  demografi:  'demografi',
  tokoh:      'tokoh',
  binter:     'binter',
  kerawanan:  'kerawanan',
}

// ── Helper ──────────────────────────────────────────────────
function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID)
  }
  return SpreadsheetApp.getActiveSpreadsheet()
}

function getSheet(name) {
  var ss = getSpreadsheet()
  var sheet = ss.getSheetByName(name)
  if (!sheet) throw new Error('Sheet "' + name + '" tidak ditemukan')
  return sheet
}

function sheetToObjects(sheet) {
  var data = sheet.getDataRange().getValues()
  if (data.length < 2) return []
  var headers = data[0].map(function(h) { return String(h).trim() })
  return data.slice(1)
    .filter(function(row) { return row.some(function(c) { return c !== '' }) })
    .map(function(row) {
      var obj = {}
      headers.forEach(function(h, i) { obj[h] = row[i] === '' ? null : row[i] })
      return obj
    })
}

function findRowIndex(sheet, idColName, idValue) {
  var data  = sheet.getDataRange().getValues()
  var headers = data[0].map(function(h) { return String(h).trim() })
  var col   = headers.indexOf(idColName)
  if (col < 0) return -1
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][col]) === String(idValue)) return i + 1 // 1-based row
  }
  return -1
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function(h) { return String(h).trim() })
}

function generateId() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 12)
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', data: data }))
    .setMimeType(ContentService.MimeType.JSON)
}

function errorResponse(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message: msg }))
    .setMimeType(ContentService.MimeType.JSON)
}

// ── CORS headers via output ─────────────────────────────────
// GAS Web App tidak support custom response headers,
// tetapi JSON response sudah cukup untuk fetch() dari browser

// ═══════════════════════════════════════════════════════════
// doGet — semua endpoint READ
// ═══════════════════════════════════════════════════════════
function doGet(e) {
  try {
    var action = e.parameter.action || ''
    var pos_id = e.parameter.pos_id || ''
    var status = e.parameter.status || ''
    var bulan  = e.parameter.bulan  || ''

    switch (action) {

      case 'getAllPos':
        return jsonResponse(sheetToObjects(getSheet(SHEET_NAMES.pos)))

      case 'getSummary':
        return jsonResponse(getSummary())

      case 'getDemografi':
        if (!pos_id) return errorResponse('pos_id diperlukan')
        return jsonResponse(getDemografi(pos_id))

      case 'getTokoh':
        if (!pos_id) return errorResponse('pos_id diperlukan')
        return jsonResponse(getFiltered(SHEET_NAMES.tokoh, 'pos_id', pos_id))

      case 'getBinter':
        if (!pos_id) return errorResponse('pos_id diperlukan')
        return jsonResponse(getFiltered(SHEET_NAMES.binter, 'pos_id', pos_id))

      case 'getKerawanan':
        if (!pos_id) return errorResponse('pos_id diperlukan')
        var rows = getFiltered(SHEET_NAMES.kerawanan, 'pos_id', pos_id)
        if (status) rows = rows.filter(function(r) { return r.status === status })
        return jsonResponse(rows)

      case 'getAllKerawanan':
        var all = sheetToObjects(getSheet(SHEET_NAMES.kerawanan))
        if (status) all = all.filter(function(r) { return r.status === status })
        return jsonResponse(all)

      case 'getAllBinter':
        return jsonResponse(sheetToObjects(getSheet(SHEET_NAMES.binter)))

      default:
        return jsonResponse({ message: 'Command Center Satgas Pamtas RI-MAL API', version: '1.0' })
    }
  } catch (err) {
    return errorResponse(err.message)
  }
}

// ═══════════════════════════════════════════════════════════
// doPost — semua endpoint WRITE
// ═══════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var body   = JSON.parse(e.postData.contents)
    var action = body.action || ''

    switch (action) {

      // ── Pos ────────────────────────────────────────────
      case 'updatePos':
        return jsonResponse(updateRow(SHEET_NAMES.pos, 'pos_id', body))

      // ── Demografi ──────────────────────────────────────
      case 'updateDemografi':
        return jsonResponse(upsertRow(SHEET_NAMES.demografi, 'pos_id', body))

      // ── Tokoh ──────────────────────────────────────────
      case 'addTokoh':
        body.id = body.id || generateId()
        body.created_at = new Date().toISOString()
        return jsonResponse(appendRow(SHEET_NAMES.tokoh, body))

      case 'updateTokoh':
        if (!body.id) return errorResponse('id diperlukan')
        return jsonResponse(updateRow(SHEET_NAMES.tokoh, 'id', body))

      case 'deleteTokoh':
        if (!body.id) return errorResponse('id diperlukan')
        return jsonResponse(deleteRow(SHEET_NAMES.tokoh, 'id', body.id))

      // ── Binter ─────────────────────────────────────────
      case 'addBinter':
        body.id = body.id || generateId()
        body.created_at = new Date().toISOString()
        return jsonResponse(appendRow(SHEET_NAMES.binter, body))

      case 'deleteBinter':
        if (!body.id) return errorResponse('id diperlukan')
        return jsonResponse(deleteRow(SHEET_NAMES.binter, 'id', body.id))

      // ── Kerawanan ──────────────────────────────────────
      case 'addKerawanan':
        body.id = body.id || generateId()
        body.created_at = new Date().toISOString()
        return jsonResponse(appendRow(SHEET_NAMES.kerawanan, body))

      case 'updateKerawanan':
        if (!body.id) return errorResponse('id diperlukan')
        return jsonResponse(updateRow(SHEET_NAMES.kerawanan, 'id', body))

      case 'deleteKerawanan':
        if (!body.id) return errorResponse('id diperlukan')
        return jsonResponse(deleteRow(SHEET_NAMES.kerawanan, 'id', body.id))

      default:
        return errorResponse('Action tidak dikenal: ' + action)
    }
  } catch (err) {
    return errorResponse(err.message)
  }
}

// ═══════════════════════════════════════════════════════════
// Fungsi bantu READ
// ═══════════════════════════════════════════════════════════
function getSummary() {
  var pos       = sheetToObjects(getSheet(SHEET_NAMES.pos))
  var demografi = sheetToObjects(getSheet(SHEET_NAMES.demografi))
  var kerawanan = sheetToObjects(getSheet(SHEET_NAMES.kerawanan))

  var totalPenduduk = demografi.reduce(function(s, d) {
    return s + (Number(d.total_penduduk) || 0)
  }, 0)

  var totalKK = demografi.reduce(function(s, d) {
    return s + (Number(d.total_kk) || 0)
  }, 0)

  var kerawananAktif = kerawanan.filter(function(k) {
    return k.status === 'aktif'
  }).length

  return {
    total_pos:       pos.length,
    total_penduduk:  totalPenduduk,
    total_kk:        totalKK,
    kerawanan_aktif: kerawananAktif,
  }
}

function getDemografi(pos_id) {
  var rows = getFiltered(SHEET_NAMES.demografi, 'pos_id', pos_id)
  return rows.length > 0 ? rows[0] : null
}

function getFiltered(sheetName, keyCol, keyVal) {
  return sheetToObjects(getSheet(sheetName)).filter(function(r) {
    return String(r[keyCol]) === String(keyVal)
  })
}

// ═══════════════════════════════════════════════════════════
// Fungsi bantu WRITE
// ═══════════════════════════════════════════════════════════

/** Tambah baris baru, kolom disesuaikan header yang ada */
function appendRow(sheetName, data) {
  var sheet   = getSheet(sheetName)
  var headers = getHeaders(sheet)

  // Tambah kolom baru jika ada field yang belum ada di header
  var keys = Object.keys(data)
  keys.forEach(function(k) {
    if (headers.indexOf(k) < 0) {
      var lastCol = sheet.getLastColumn() + 1
      sheet.getRange(1, lastCol).setValue(k)
      headers.push(k)
    }
  })

  var row = headers.map(function(h) {
    var v = data[h]
    return v !== undefined && v !== null ? v : ''
  })
  sheet.appendRow(row)
  return { inserted: data.id || true }
}

/** Update baris berdasarkan key column */
function updateRow(sheetName, keyCol, data) {
  var sheet   = getSheet(sheetName)
  var headers = getHeaders(sheet)
  var rowIdx  = findRowIndex(sheet, keyCol, data[keyCol])
  if (rowIdx < 0) return { updated: false, reason: 'Row tidak ditemukan' }

  Object.keys(data).forEach(function(k) {
    var col = headers.indexOf(k)
    if (col >= 0) {
      sheet.getRange(rowIdx, col + 1).setValue(data[k] !== null ? data[k] : '')
    }
  })
  return { updated: true }
}

/** Upsert: update jika ada, append jika tidak */
function upsertRow(sheetName, keyCol, data) {
  var sheet  = getSheet(sheetName)
  var rowIdx = findRowIndex(sheet, keyCol, data[keyCol])
  if (rowIdx > 0) {
    return updateRow(sheetName, keyCol, data)
  }
  return appendRow(sheetName, data)
}

/** Hapus baris berdasarkan key column */
function deleteRow(sheetName, keyCol, keyVal) {
  var sheet  = getSheet(sheetName)
  var rowIdx = findRowIndex(sheet, keyCol, keyVal)
  if (rowIdx < 0) return { deleted: false, reason: 'Row tidak ditemukan' }
  sheet.deleteRow(rowIdx)
  return { deleted: true }
}

// ═══════════════════════════════════════════════════════════
// Setup awal — jalankan sekali untuk buat semua sheet
// ═══════════════════════════════════════════════════════════
function setupSheets() {
  var ss = getSpreadsheet()

  var schemas = {
    pos: [
      'pos_id','nama_pos','lokasi_desa','kabupaten','provinsi',
      'lat','lng','komandan_pos','jumlah_personel','foto_satelit_url','keterangan'
    ],
    demografi: [
      'pos_id','total_penduduk','total_kk',
      'islam','kristen','katolik','hindu','buddha','konghucu','lainnya',
      'masjid','gereja','pura','vihara',
      'geografi','demografi_notes','konsos_notes'
    ],
    tokoh: [
      'id','pos_id','nama','kategori','jabatan','alamat','no_telp','catatan','created_at'
    ],
    binter: [
      'id','pos_id','tanggal','jenis_kegiatan','lokasi','sasaran',
      'jumlah_peserta','keterangan','foto_url','created_at'
    ],
    kerawanan: [
      'id','pos_id','tanggal','kategori','deskripsi','status',
      'lat','lng','pelaku','tindak_lanjut','foto_url','created_at'
    ],
  }

  Object.keys(schemas).forEach(function(name) {
    var sheet = ss.getSheetByName(name)
    if (!sheet) {
      sheet = ss.insertSheet(name)
      Logger.log('Sheet dibuat: ' + name)
    }
    // Cek apakah header sudah ada
    var existing = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : []
    if (existing.every(function(c) { return c === '' })) {
      sheet.getRange(1, 1, 1, schemas[name].length).setValues([schemas[name]])
      sheet.getRange(1, 1, 1, schemas[name].length)
        .setBackground('#1a3a1a')
        .setFontColor('#00ff88')
        .setFontWeight('bold')
      Logger.log('Header set pada: ' + name)
    }
  })

  Logger.log('Setup selesai! Semua sheet siap.')
}

// ═══════════════════════════════════════════════════════════
// Seed data dummy — jalankan untuk tes awal (opsional)
// ═══════════════════════════════════════════════════════════
function seedDummyPos() {
  var posData = [
    { pos_id:'POS-01', nama_pos:'Long Bawan',    lokasi_desa:'Long Bawan',    kabupaten:'Nunukan', lat:3.8994,  lng:115.6937, komandan_pos:'Lettu Kav Ahmad',   jumlah_personel:25 },
    { pos_id:'POS-02', nama_pos:'Long Midang',   lokasi_desa:'Long Midang',   kabupaten:'Nunukan', lat:3.9614,  lng:115.7232, komandan_pos:'Lettu Kav Budi',     jumlah_personel:22 },
    { pos_id:'POS-03', nama_pos:'Long Layu',     lokasi_desa:'Long Layu',     kabupaten:'Nunukan', lat:3.8234,  lng:115.8456, komandan_pos:'Lettu Kav Cahyo',    jumlah_personel:20 },
    { pos_id:'POS-04', nama_pos:'Krayan Selatan',lokasi_desa:'Long Pasia',    kabupaten:'Nunukan', lat:3.7123,  lng:115.9234, komandan_pos:'Lettu Kav Dika',     jumlah_personel:23 },
    { pos_id:'POS-05', nama_pos:'Ba Binuang',    lokasi_desa:'Ba Binuang',    kabupaten:'Nunukan', lat:4.0123,  lng:115.5678, komandan_pos:'Lettu Kav Eko',      jumlah_personel:21 },
  ]

  posData.forEach(function(pos) { appendRow('pos', pos) })
  Logger.log('Seed data pos selesai: ' + posData.length + ' pos')
}
