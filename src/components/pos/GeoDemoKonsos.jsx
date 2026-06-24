import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'

/**
 * GeoDemoKonsos — Tab Geo-Demo-Konsos di PosDetailPage.
 *
 * Karena field geografi/demografi_notes/konsos_notes tidak ada di schema Supabase,
 * komponen ini men-derive analisis dari data demografi yang sudah tersedia
 * (jumlah_penduduk, jumlah_kk, laki_laki, perempuan) dan data pos (kabupaten, provinsi).
 * Field teks bebas tetap ditampilkan jika ada, sebagai override.
 */
export function GeoDemoKonsos({ demografi, pos, loading }) {
  if (loading) return <LoadingSpinner text="Memuat data..." />
  if (!demografi && !pos) return <EmptyState title="Data belum tersedia" />

  // ── Derived demografi analysis ──────────────────────────
  const penduduk  = demografi?.jumlah_penduduk  || 0
  const kk        = demografi?.jumlah_kk        || 0
  const lakiLaki  = demografi?.laki_laki        || 0
  const perempuan = demografi?.perempuan        || 0

  const rasioSex     = perempuan > 0 ? (lakiLaki / perempuan * 100).toFixed(1) : null
  const rataKK       = kk > 0 ? (penduduk / kk).toFixed(1) : null
  const pctLaki      = penduduk > 0 ? Math.round((lakiLaki / penduduk) * 100) : null
  const pctPerempuan = penduduk > 0 ? Math.round((perempuan / penduduk) * 100) : null

  // Klasifikasi kepadatan per KK (kasar)
  let klasifikasiDemo = '—'
  if (penduduk > 0 && kk > 0) {
    if (penduduk < 500)        klasifikasiDemo = 'Wilayah Jarang Penduduk'
    else if (penduduk < 2000)  klasifikasiDemo = 'Wilayah Penduduk Sedang'
    else                       klasifikasiDemo = 'Wilayah Padat Penduduk'
  }

  const hasDemoData = penduduk > 0 || kk > 0

  return (
    <div className="space-y-3 fade-in">

      {/* ── 1. Kondisi Geografi ─────────────────────────── */}
      <Section
        icon="◬"
        label="Kondisi Geografi"
        color="rgba(0,255,136,0.25)"
        glow="rgba(0,255,136,0.15)"
      >
        {demografi?.geografi ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.geografi}
          </p>
        ) : (
          <div className="space-y-2">
            {pos?.kabupaten && (
              <InfoRow label="Kabupaten" value={pos.kabupaten} />
            )}
            {pos?.kecamatan && (
              <InfoRow label="Kecamatan" value={pos.kecamatan} />
            )}
            {pos?.lokasi_desa && (
              <InfoRow label="Desa / Lokasi" value={pos.lokasi_desa} />
            )}
            {pos?.provinsi && (
              <InfoRow label="Provinsi" value={pos.provinsi} />
            )}
            {pos?.lat && pos?.lng && (
              <InfoRow label="Koordinat" value={`${pos.lat}°N, ${pos.lng}°E`} mono />
            )}
            {pos?.jumlah_patok && (
              <InfoRow label="Jumlah Patok" value={`${pos.jumlah_patok} patok`} />
            )}
            {!pos?.kabupaten && !pos?.lokasi_desa && (
              <p className="text-[rgba(200,214,229,0.25)] text-xs italic tracking-wide">
                Data geografi belum diisi.
              </p>
            )}
          </div>
        )}
      </Section>

      {/* ── 2. Kondisi Demografi ────────────────────────── */}
      <Section
        icon="◈"
        label="Kondisi Demografi"
        color="rgba(68,136,255,0.25)"
        glow="rgba(68,136,255,0.15)"
      >
        {demografi?.demografi_notes ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.demografi_notes}
          </p>
        ) : hasDemoData ? (
          <div className="space-y-3">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Total Penduduk" value={penduduk.toLocaleString('id-ID')} unit="jiwa" color="#4488ff" />
              <StatBox label="Kepala Keluarga" value={kk.toLocaleString('id-ID')} unit="KK" color="#4488ff" />
              <StatBox label="Laki-laki" value={lakiLaki.toLocaleString('id-ID')} unit={pctLaki !== null ? `${pctLaki}%` : 'jiwa'} color="#4488ff" />
              <StatBox label="Perempuan" value={perempuan.toLocaleString('id-ID')} unit={pctPerempuan !== null ? `${pctPerempuan}%` : 'jiwa'} color="#bb88ff" />
            </div>

            {/* Rasio bar laki-perempuan */}
            {pctLaki !== null && (
              <div>
                <div className="flex justify-between text-[8px] mb-1"
                  style={{ color: 'rgba(200,214,229,0.35)' }}>
                  <span>Laki-laki {pctLaki}%</span>
                  <span>Perempuan {pctPerempuan}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden flex"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full transition-all duration-700"
                    style={{ width: `${pctLaki}%`, background: '#4488ff' }} />
                  <div className="h-full flex-1"
                    style={{ background: 'rgba(187,136,255,0.6)' }} />
                </div>
              </div>
            )}

            {/* Derived metrics */}
            <div className="space-y-1 pt-1 border-t border-[rgba(68,136,255,0.08)]">
              {rataKK && (
                <InfoRow label="Rata-rata Jiwa/KK" value={`${rataKK} jiwa`} />
              )}
              {rasioSex && (
                <InfoRow label="Rasio Jenis Kelamin" value={`${rasioSex} (L per 100 P)`} />
              )}
              <InfoRow label="Klasifikasi" value={klasifikasiDemo} />
            </div>
          </div>
        ) : (
          <p className="text-[rgba(200,214,229,0.25)] text-xs italic tracking-wide">
            Data demografi belum diisi. Isi melalui tab Demografi.
          </p>
        )}
      </Section>

      {/* ── 3. Kondisi Sosial (Konsos) ──────────────────── */}
      <Section
        icon="◉"
        label="Kondisi Sosial (Konsos)"
        color="rgba(187,136,255,0.25)"
        glow="rgba(187,136,255,0.15)"
      >
        {demografi?.konsos_notes ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.konsos_notes}
          </p>
        ) : hasDemoData ? (
          <div className="space-y-2">
            <p className="text-[rgba(200,214,229,0.5)] text-[11px] leading-relaxed">
              Berdasarkan data demografi, wilayah ini memiliki{' '}
              <span className="text-[rgba(200,214,229,0.8)] font-medium">
                {penduduk.toLocaleString('id-ID')} jiwa
              </span>{' '}
              dalam{' '}
              <span className="text-[rgba(200,214,229,0.8)] font-medium">
                {kk.toLocaleString('id-ID')} kepala keluarga
              </span>
              {rataKK && (
                <>, rata-rata <span className="text-[rgba(200,214,229,0.8)] font-medium">{rataKK} jiwa per KK</span></>
              )}.
            </p>
            <div className="px-3 py-2 rounded-sm mt-2"
              style={{ background: 'rgba(187,136,255,0.04)', border: '1px solid rgba(187,136,255,0.12)' }}>
              <p className="text-[9px] uppercase tracking-[0.15em] mb-1"
                style={{ color: 'rgba(187,136,255,0.5)' }}>Catatan</p>
              <p className="text-[10px] leading-relaxed"
                style={{ color: 'rgba(200,214,229,0.4)' }}>
                Data kondisi sosial terperinci (adat istiadat, agama, mata pencaharian, tingkat pendidikan)
                dapat diisi oleh operator melalui pembaruan data pos.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[rgba(200,214,229,0.25)] text-xs italic tracking-wide">
            Data kondisi sosial belum diisi.
          </p>
        )}
      </Section>
    </div>
  )
}

/* ── Helper sub-components ─────────────────────────────────── */

function Section({ icon, label, color, glow, children }) {
  return (
    <div className="hud-panel relative overflow-hidden"
      style={{ borderLeftColor: color, borderLeftWidth: '2px' }}>
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none rounded-sm"
        style={{ background: `radial-gradient(ellipse at top left, ${glow}, transparent)` }} />
      <div className="hud-header">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color }}>{icon}</span>
          <span className="hud-title">{label}</span>
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-32"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</span>
      <span className={`text-[11px] font-medium text-[rgba(200,214,229,0.75)] ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </span>
    </div>
  )
}

function StatBox({ label, value, unit, color }) {
  return (
    <div className="px-3 py-2 rounded-sm text-center"
      style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <p className="text-[8px] uppercase tracking-wider mb-0.5"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</p>
      <p className="font-mono font-bold text-base leading-none"
        style={{ color, textShadow: `0 0 10px ${color}55` }}>{value}</p>
      {unit && (
        <p className="text-[8px] mt-0.5" style={{ color: 'rgba(200,214,229,0.3)' }}>{unit}</p>
      )}
    </div>
  )
}
