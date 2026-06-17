import { useState } from 'react'
import { usePos } from '../hooks/useGasApi'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { exportToCSV } from '../utils/exportPDF'

export default function AdminPage() {
  const { data: posList, loading } = usePos()
  const [copied, setCopied] = useState(false)

  const gasUrl = import.meta.env.VITE_GAS_URL || ''
  const isMocked = !gasUrl || gasUrl.includes('YOUR_SCRIPT_ID')

  const handleCopyGasUrl = () => {
    if (gasUrl && !isMocked) {
      navigator.clipboard.writeText(gasUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExportPos = () => {
    if (!posList?.length) return
    exportToCSV(
      posList,
      ['pos_id', 'nama_pos', 'lokasi_desa', 'kabupaten', 'lat', 'lng', 'komandan_pos', 'jumlah_personel'],
      'data-pos-satgas'
    )
  }

  return (
    <div className="p-4 space-y-4 fade-in max-w-3xl">

      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h2 className="text-[rgba(200,214,229,0.85)] font-bold text-sm uppercase tracking-widest mb-1">
          ⚙ Pengaturan Sistem
        </h2>
        <p className="text-[rgba(200,214,229,0.3)] text-[10px]">
          Konfigurasi koneksi data dan informasi sistem
        </p>
      </div>

      {/* ── Status koneksi GAS ──────────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◉ Koneksi Google Apps Script</span>
          <span className={`hud-badge ${isMocked ? 'hud-badge-warning' : 'hud-badge-ok'}`}>
            {isMocked ? 'DEMO MODE' : 'CONNECTED'}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="hud-label mb-1">GAS Endpoint URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-[10px] px-2 py-1.5 rounded-sm truncate"
                  style={{
                    background: 'rgba(0,255,136,0.04)',
                    border: '1px solid rgba(0,255,136,0.15)',
                    color: isMocked ? 'rgba(255,170,0,0.6)' : 'rgba(0,255,136,0.6)',
                  }}>
                  {isMocked ? 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec' : gasUrl}
                </code>
                <button
                  className="hud-btn text-[9px] px-2 flex-shrink-0"
                  onClick={handleCopyGasUrl}
                  disabled={isMocked}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {isMocked && (
            <div className="px-3 py-2.5 rounded-sm"
              style={{ background: 'rgba(255,170,0,0.06)', border: '1px solid rgba(255,170,0,0.2)' }}>
              <p className="text-[#ffaa00] text-[10px] font-bold mb-1">⚠ Mode Demo Aktif</p>
              <p className="text-[rgba(255,170,0,0.65)] text-[10px] leading-relaxed">
                Dashboard menggunakan data dummy. Untuk data nyata, buat file <code className="font-mono">.env</code> di
                folder project dan tambahkan:
              </p>
              <code className="block mt-2 font-mono text-[10px] px-2 py-1.5 rounded-sm"
                style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(0,255,136,0.6)' }}>
                VITE_GAS_URL=https://script.google.com/macros/s/YOUR_ID/exec
              </code>
            </div>
          )}
        </div>
      </div>

      {/* ── Koordinat 17 Pos ────────────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◬ Koordinat 17 Pos Satgas</span>
          <button className="hud-btn text-[9px] px-2" onClick={handleExportPos} disabled={!posList?.length}>
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <LoadingSpinner text="Memuat data pos..." />
          ) : (
            <table className="w-full text-[10px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
                  {['Pos ID', 'Nama Pos', 'Desa', 'Kabupaten', 'Lat', 'Lng', 'Komandan', 'Personel'].map(h => (
                    <th key={h} className="px-3 py-2 text-left hud-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(posList || []).map((pos, i) => (
                  <tr
                    key={pos.pos_id}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(0,255,136,0.05)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(0,255,136,0.015)',
                    }}
                  >
                    <td className="px-3 py-2 font-mono text-[rgba(0,255,136,0.7)] font-bold">{pos.pos_id}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.7)]">{pos.nama_pos}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.45)]">{pos.lokasi_desa || '—'}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.45)]">{pos.kabupaten || '—'}</td>
                    <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.5)]">{pos.lat || '—'}</td>
                    <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.5)]">{pos.lng || '—'}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.45)]">{pos.komandan_pos || '—'}</td>
                    <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.5)]">{pos.jumlah_personel || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Info sistem ─────────────────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◈ Informasi Sistem</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2">
          {[
            ['Aplikasi',    'Command Center Satgas Pamtas RI-MAL'],
            ['Satuan',      'YONKAV 8/NSW'],
            ['Tahun Anggaran', 'TA 2026'],
            ['Wilayah',     'Kalimantan Utara'],
            ['Frontend',    'React + Vite + Tailwind CSS'],
            ['Map Engine',  'Leaflet.js + OpenStreetMap'],
            ['Backend',     'Google Apps Script + Google Sheets'],
            ['Hosting',     'GitHub Pages'],
            ['Refresh',     'Otomatis setiap 5 menit'],
            ['Mode',        isMocked ? 'Demo (data dummy)' : 'Produksi (data nyata)'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3 py-1" style={{ borderBottom: '1px solid rgba(0,255,136,0.04)' }}>
              <span className="hud-label w-36 flex-shrink-0">{k}</span>
              <span className="text-[rgba(200,214,229,0.6)] text-[10px]">{v}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
