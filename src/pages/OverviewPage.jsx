import { useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { KerawananBadge } from '../components/ui'
// Lazy load PamtasMap (154KB) - only loads when OverviewPage renders
const PamtasMap = lazy(() => import('../components/map/PamtasMap').then(m => ({ default: m.PamtasMap })))
import { usePos, useSummary, useAllKerawanan, useAllBinter, useAutoRefresh } from '../hooks/useSupabase'
import { formatDate } from '../utils/formatDate'
import { useApp } from '../context/AppContext'
import { BINTER_COLOR_MAP } from '../constants/kerawananCategories'

/**
 * OverviewPage — Premium Tactical Command Dashboard
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Panel entrance: 300ms ease-out, staggered
 * - Metric card: 200ms hover lift
 * - Overlay panels: 150ms fade-in
 *
 * Features:
 * - Fullscreen tactical map background
 * - HUD-style metric cards
 * - Threat panel with pulse alerts
 * - Personnel status visualization
 * - Intel situation summary
 */

function getBinterColor(jenis) {
  if (!jenis) return 'var(--color-info)'
  for (const [key, val] of Object.entries(BINTER_COLOR_MAP)) {
    if (jenis.toLowerCase().includes(key.toLowerCase())) return val
  }
  return 'var(--color-info)'
}

export default function OverviewPage() {
  const navigate = useNavigate()

  const { data: posList,   loading: posLoading,       refetch: refetchPos }       = usePos()
  const { data: summary,   loading: summaryLoading,   refetch: refetchSummary }   = useSummary()
  const { data: kerawanan, loading: kerawananLoading, refetch: refetchKerawanan } = useAllKerawanan()
  const { data: binter,    loading: binterLoading,    refetch: refetchBinter }    = useAllBinter()

  useAutoRefresh([refetchPos, refetchSummary, refetchKerawanan, refetchBinter])

  const activeKerawanan = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif')
  const recentBinter    = (binter || [])
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, 5)

  const posNameMap = (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p.nama_pos || p.pos_id
    return acc
  }, {})

  const ancamanPerPos = []
  const seenPos = new Set()
  for (const item of activeKerawanan) {
    if (!seenPos.has(item.pos_id)) {
      seenPos.add(item.pos_id)
      ancamanPerPos.push(item)
    }
    if (ancamanPerPos.length >= 6) break
  }

  const posRawan     = [...new Set(activeKerawanan.map(k => k.pos_id))].length
  const totalPos     = (posList || []).length || 17
  const posAman      = totalPos - posRawan
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--surface-base)' }}>

      {/* ══ MAP — fullscreen background (lazy loaded) ══ */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--map-bg)' }}>
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Memuat peta...</p>
            </div>
          </div>
        }>
          <PamtasMap
            posList={posList || []}
            kerawananList={kerawanan || []}
            height="100%"
          />
        </Suspense>
      </div>

      {/* Grid texture overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none animate-fade-in"
        style={{
          backgroundImage: `
            linear-gradient(var(--border-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ══ TOP ROW — Premium metric cards ══ */}
      <div className="absolute left-2 right-2 z-[10] flex gap-2 pointer-events-none" style={{ top: '8px' }}>
        <MetricCard
          label="TOTAL PERSONEL"
          value={posLoading ? '—' : totalPersonel}
          unit="pax"
          color="var(--accent-primary)"
          icon="users"
        />
        <MetricCard
          label="TOTAL POS"
          value={posLoading ? '—' : (posList || []).length}
          unit="pos aktif"
          color="var(--color-info)"
          icon="map-pin"
        />
        <MetricCard
          label="TOTAL PENDUDUK"
          value={summaryLoading ? '—' : ((summary?.total_penduduk || 0)).toLocaleString('id-ID')}
          unit="jiwa"
          color="var(--color-info)"
          icon="population"
        />
        <MetricCard
          label="KEPALA KELUARGA"
          value={summaryLoading ? '—' : ((summary?.total_kk || 0)).toLocaleString('id-ID')}
          unit="KK"
          color="var(--color-warning)"
          icon="family"
        />
        <MetricCard
          label="KERAWANAN AKTIF"
          value={kerawananLoading ? '—' : activeKerawanan.length}
          unit="kasus"
          color={activeKerawanan.length > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'}
          icon="warning"
          danger={activeKerawanan.length > 0}
        />
        <MetricCard
          label="POS RAWAN"
          value={posRawan}
          unit={`dari ${totalPos} pos`}
          color={posRawan > 0 ? 'var(--color-warning)' : 'var(--accent-primary)'}
          icon="alert"
          danger={posRawan > 3}
        />
        <MetricCard
          label="KEGIATAN BINTER"
          value={(binter || []).length}
          unit="total kegiatan"
          color="var(--color-purple)"
          icon="binter"
        />
      </div>

      {/* ══ LEFT PANEL ══ */}
      <div className="absolute left-2 z-[10] w-60 flex flex-col gap-2 animate-slide-in-left" style={{ top: 'calc(8px + 72px + 20px)', bottom: '36px' }}>

        {/* Ancaman aktif */}
        <OverlayPanel
          title="⚠ ANCAMAN AKTIF"
          badge={activeKerawanan.length}
          badgeDanger
          onMore={() => navigate('/insiden')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5 scrollbar-thin">
            {activeKerawanan.length === 0 ? (
              <div className="flex items-center gap-2 py-3">
                <div className="w-2 h-2 rounded-full"
                  style={{ background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }} />
                <span className="text-[10px] tracking-widest uppercase font-semibold"
                  style={{ color: 'var(--accent-primary)' }}>
                  Kondisi Aman
                </span>
              </div>
            ) : (
              ancamanPerPos.map(item => (
                <ThreatCard
                  key={item.id}
                  item={item}
                  posName={posNameMap[item.pos_id]}
                  onClick={() => navigate('/insiden')}
                />
              ))
            )}
            {activeKerawanan.length > 6 && (
              <button onClick={() => navigate('/insiden')}
                className="w-full text-[9px] py-1.5 tracking-wider uppercase font-semibold transition-all"
                style={{ color: 'var(--color-danger)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--color-danger)'
                  e.currentTarget.style.textShadow = '0 0 8px var(--color-danger)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--color-danger)'
                  e.currentTarget.style.textShadow = 'none'
                }}
              >
                +{activeKerawanan.length - 6} lainnya →
              </button>
            )}
          </div>
        </OverlayPanel>

        {/* Kegiatan Binter */}
        <OverlayPanel title="◈ KEGIATAN BINTER" onMore={() => navigate('/binter')}>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5 scrollbar-thin">
            {recentBinter.length === 0 ? (
              <p className="text-[9px] py-3 text-center tracking-widest uppercase"
                style={{ color: 'var(--text-tertiary)' }}>
                Belum ada data
              </p>
            ) : (
              recentBinter.map((item, i) => (
                <BinterItem
                  key={item.id || i}
                  item={item}
                />
              ))
            )}
          </div>
        </OverlayPanel>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="absolute right-2 z-[10] w-52 flex flex-col gap-2 animate-slide-in-right" style={{ top: 'calc(8px + 72px + 20px)', bottom: '36px' }}>

        {/* Status Personel */}
        <OverlayPanel title="◆ STATUS PERSONEL" onMore={() => navigate('/laporan/demografi')}>
          <PersonelPanel posList={posList} loading={posLoading} navigate={navigate} />
        </OverlayPanel>

        {/* Situasi Intelijen */}
        <OverlayPanel title="◉ SITUASI INTELIJEN">
          <div className="space-y-3">
            <IntelRow label="Pos Aman"          value={posAman}                total={totalPos}  color="var(--accent-primary)" />
            <IntelRow label="Pos Rawan"         value={posRawan}               total={totalPos}  color="var(--color-danger)" />
            <IntelRow label="Kegiatan Binter"   value={(binter||[]).length}    unit="kegiatan" color="var(--color-info)" />
            <IntelRow label="Tindak Pelanggaran" value={activeKerawanan.length} unit="kasus"   color="var(--color-warning)" />
          </div>
        </OverlayPanel>

      </div>

      {/* ══ BOTTOM — layer toggles ══ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center animate-slide-up">
        <MapLayerBar />
      </div>

    </div>
  )
}

/* ── MetricCard Component ──────────────────────────────── */
function MetricCard({ label, value, unit, color, icon, danger }) {
  const icons = {
    users: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    'map-pin': (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    population: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c2.5 0 4.5.5 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5M12 4.5V2m0 18v-2.5m9-12.5h-2.5m2.5 0H22m-7.5 0v2.5M12 13.5V16m-5.5-2.5H2m4.5 0H12m0 0v2.5m0-7.5V2" />
      </svg>
    ),
    family: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21v-4.5m0 0h16.5m-16.5 0v4.5m16.5 0v-4.5m0 4.5h-16.5M12 3v3m0 0a3 3 0 013 3m-3-3a3 3 0 00-3 3m0 0v3m0 0h6m-6 0a3 3 0 01-3-3m3 3a3 3 0 003 3m0 0v3m0 0H6m12 0h-6" />
      </svg>
    ),
    warning: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    alert: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
      </svg>
    ),
    binter: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  }

  return (
    <div
      className={`
        flex-1 min-w-0 px-3 py-2 rounded-sm pointer-events-auto
        transition-all duration-200 ease-out
        hover:translate-y-[-2px] hover:shadow-lg
      `}
      style={{
        background: 'var(--surface-primary)',
        border: `1px solid ${danger ? 'var(--color-danger)' : 'var(--border-subtle)'}`,
        backdropFilter: 'blur(10px)',
        boxShadow: danger ? 'var(--shadow-glow-danger)' : 'var(--shadow-md)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="opacity-60" style={{ color }}>{icons[icon]}</span>
        <span className="text-[8px] tracking-[0.15em] uppercase font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
      </div>
      <div
        className="font-mono font-bold leading-none"
        style={{
          fontSize: '22px',
          color,
          textShadow: `0 0 16px ${color}50`,
        }}
      >
        {value}
      </div>
      <div className="text-[8px] mt-0.5 tracking-wider uppercase" style={{ color: 'var(--text-disabled)' }}>
        {unit}
      </div>
    </div>
  )
}

/* ── ThreatCard Component ──────────────────────────────── */
function ThreatCard({ item, posName, onClick }) {
  return (
    <div
      className="flex items-start gap-2 p-2 rounded-sm cursor-pointer transition-all duration-150"
      style={{
        background: 'var(--color-danger-subtle)',
        border: '1px solid var(--color-danger)',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,59,59,0.15)'
        e.currentTarget.style.boxShadow = '0 0 12px var(--color-danger-subtle)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-danger-subtle)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse"
        style={{ background: 'var(--color-danger)', boxShadow: '0 0 6px var(--color-danger)' }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <KerawananBadge kategori={item.kategori} />
          <span className="text-[8px] font-bold tracking-wide flex-shrink-0 px-1.5 py-0.5 rounded-sm"
            style={{
              color: '#ffffff',
              background: 'var(--color-danger)',
              boxShadow: '0 0 8px rgba(255,59,59,0.4)',
            }}>
            {posName
              ? posName.replace(/^Pos /i, 'POS ').toUpperCase()
              : item.pos_id}
          </span>
        </div>
        <p className="text-[9px] truncate" style={{ color: 'var(--text-tertiary)' }}>
          {item.deskripsi ? item.deskripsi.slice(0, 35) : '—'}
        </p>
      </div>
    </div>
  )
}

/* ── BinterItem Component ─────────────────────────────── */
function BinterItem({ item }) {
  const binterColor = getBinterColor(item.jenis_kegiatan)
  return (
    <div className="flex items-start gap-2">
      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
        style={{
          background: binterColor,
          boxShadow: `0 0 6px ${binterColor}`,
        }} />
      <div className="min-w-0">
        <p className="text-[10px] font-medium truncate leading-tight"
          style={{ color: 'var(--text-primary)' }}>
          {item.jenis_kegiatan || 'Kegiatan'}
        </p>
        <p className="text-[9px] truncate" style={{ color: 'var(--text-tertiary)' }}>
          {item.pos_id} · {item.tanggal ? formatDate(item.tanggal) : '—'}
        </p>
      </div>
    </div>
  )
}

/* ── STATUS PERSONEL panel ──────────────────────────────── */
function PersonelPanel({ posList, loading, navigate }) {
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  const sorted = [...(posList || [])]
    .sort((a, b) => {
      const aIsKotis = a.pos_id === 'KT' || a.pos_id === 'KOTIS'
      const bIsKotis = b.pos_id === 'KT' || b.pos_id === 'KOTIS'
      if (aIsKotis && !bIsKotis) return -1
      if (!aIsKotis && bIsKotis) return 1
      return (Number(b.jumlah_personel) || 0) - (Number(a.jumlah_personel) || 0)
    })
    .slice(0, 6)

  const maxPersonel = sorted[0] ? Math.max(...sorted.map(p => Number(p.jumlah_personel) || 0)) : 1

  const wilayahMap = { 'INDONESIA': { count: 0, personel: 0 }, 'MALAYSIA': { count: 0, personel: 0 } }
  ;(posList || []).forEach(p => {
    const key = p.kabupaten === 'Malaysia' ? 'MALAYSIA' : 'INDONESIA'
    wilayahMap[key].count++
    wilayahMap[key].personel += Number(p.jumlah_personel) || 0
  })
  const wilayahData = Object.entries(wilayahMap).filter(([, v]) => v.count > 0)

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 rounded-sm animate-pulse" style={{ background: 'var(--accent-muted)' }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 rounded-sm animate-pulse" style={{ background: 'var(--accent-muted)' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">

      {/* ── Angka utama ── */}
      <div className="flex items-end justify-between px-0.5">
        <div>
          <p className="text-[8px] uppercase tracking-[0.18em] mb-0.5"
            style={{ color: 'var(--text-tertiary)' }}>Total Kekuatan</p>
          <p className="font-mono font-bold leading-none"
            style={{
              fontSize: '26px',
              color: 'var(--accent-primary)',
              textShadow: 'var(--shadow-glow)',
            }}>
            {totalPersonel}
          </p>
          <p className="text-[8px] mt-0.5 tracking-wide" style={{ color: 'var(--text-disabled)' }}>
            org · {(posList || []).length} pos
          </p>
        </div>

        {/* Wilayah pills */}
        <div className="flex flex-col gap-1 items-end">
          {wilayahData.map(([wilayah, { count, personel }]) => {
            const color = wilayah === 'MALAYSIA' ? 'var(--color-warning)' : 'var(--color-info)'
            return (
              <div key={wilayah} className="flex items-center gap-1.5 px-2 py-1 rounded-sm transition-colors duration-150"
                style={{ background: 'var(--surface-secondary)', border: `1px solid ${color}25` }}>
                <div className="text-right">
                  <p className="font-mono text-[10px] font-bold leading-none" style={{ color }}>
                    {personel} <span className="text-[7px] font-normal opacity-60">org</span>
                  </p>
                  <p className="text-[7px] uppercase tracking-wide leading-tight"
                    style={{ color: 'var(--text-tertiary)' }}>
                    {wilayah} · {count} pos
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px" style={{ background: 'var(--border-subtle)' }} />

      {/* ── Bar chart ── */}
      <div className="space-y-1.5">
        <p className="text-[7px] uppercase tracking-[0.2em] px-0.5"
          style={{ color: 'var(--text-disabled)' }}>Kekuatan per Pos (org)</p>
        {sorted.map((pos, i) => {
          const num    = Number(pos.jumlah_personel) || 0
          const pct    = maxPersonel > 0 ? Math.max(Math.round((num / maxPersonel) * 100), num > 0 ? 4 : 0) : 0
          const isKT   = pos.pos_id === 'KT' || pos.pos_id === 'KOTIS'
          const posNo  = isKT ? 'KT' : pos.pos_id.replace(/^POS-0?/, '')
          const accent = isKT ? '#ffd700' : i === 1 ? 'var(--accent-primary)' : i === 2 ? 'var(--accent-muted)' : 'var(--text-disabled)'
          return (
            <div key={pos.pos_id}
              className="flex items-center gap-2 cursor-pointer group transition-opacity duration-150"
              onClick={() => navigate(`/pos/${pos.pos_id}`)}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
              style={{ opacity: 0.7 }}
            >
              <span className="font-mono text-[8px] w-3 text-right flex-shrink-0"
                style={{ color: 'var(--text-disabled)' }}>{i + 1}</span>
              <span className="font-mono text-[9px] font-bold w-6 text-center flex-shrink-0 rounded-sm py-px transition-colors duration-150"
                style={{
                  color: accent,
                  background: `${accent}18`,
                  border: `1px solid ${accent}33`,
                }}>
                {posNo}
              </span>
              <div className="flex-1 h-[5px] rounded-full overflow-hidden"
                style={{ background: 'var(--surface-muted)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    minWidth: num > 0 ? '4px' : '0',
                    background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                    boxShadow: isKT ? `0 0 6px ${accent}66` : 'none',
                  }} />
              </div>
              <span className="font-mono text-[9px] font-bold w-12 text-right flex-shrink-0"
                style={{ color: 'var(--text-tertiary)' }}>
                {num} <span style={{ color: 'var(--text-disabled)', fontSize: '7px' }}>org</span>
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

/* ── OverlayPanel Component ────────────────────────────── */
function OverlayPanel({ title, badge, badgeDanger, onMore, children }) {
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-secondary)' }}
      >
        <span className="text-[9px] font-bold tracking-[0.15em] uppercase"
          style={{ color: 'var(--accent-primary)' }}>
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge !== undefined && (
            <span
              className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition-colors duration-150"
              style={badgeDanger && Number(badge) > 0 ? {
                color: 'var(--color-danger)',
                background: 'var(--color-danger-subtle)',
                border: '1px solid var(--color-danger)',
              } : {
                color: 'var(--accent-primary)',
                background: 'var(--accent-muted)',
                border: '1px solid var(--accent-primary)',
              }}
            >
              {badge}
            </span>
          )}
          {onMore && (
            <button
              onClick={onMore}
              className="text-[8px] tracking-widest uppercase transition-colors duration-150"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              SEMUA →
            </button>
          )}
        </div>
      </div>
      <div className="p-2.5">{children}</div>
    </div>
  )
}

/* ── IntelRow Component ─────────────────────────────── */
function IntelRow({ label, value, total, unit, color }) {
  const pct = total ? Math.round((value / total) * 100) : null
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[8px] uppercase tracking-[0.1em]" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
        <span className="font-mono text-[10px] font-bold" style={{ color }}>
          {value}{unit ? ` ${unit}` : ''}{pct !== null ? ` / ${total}` : ''}
        </span>
      </div>
      {pct !== null && (
        <div className="h-[2px] rounded-full overflow-hidden"
          style={{ background: 'var(--surface-muted)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: color,
              boxShadow: `0 0 6px ${color}50`,
            }} />
        </div>
      )}
    </div>
  )
}

/* ── MapLayerBar Component ─────────────────────────── */
function MapLayerBar() {
  const { mapLayers, toggleMapLayer } = useApp()

  const layers = [
    { key: 'pos',         label: 'Pos',         color: 'var(--accent-primary)' },
    { key: 'narkoba',     label: 'Narkoba',     color: '#dc2626' },
    { key: 'kriminal',    label: 'Kriminal',    color: '#ef4444' },
    { key: 'logging',     label: 'Logging',     color: '#d97706' },
    { key: 'trading',     label: 'Trading',     color: '#f59e0b' },
    { key: 'trafficking', label: 'Trafficking', color: '#db2777' },
    { key: 'border',      label: 'Border',      color: '#0ea5e9' },
    { key: 'pmInp',       label: 'PMI NP',      color: '#ea580c' },
    { key: 'binter',      label: 'Binter',      color: 'var(--color-info)' },
  ]

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-sm transition-colors duration-150"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {layers.map(({ key, label, color }) => {
        const active = mapLayers[key]
        return (
          <button
            key={key}
            onClick={() => toggleMapLayer(key)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm transition-all duration-150 whitespace-nowrap"
            style={{
              background: active ? `${color}18` : 'transparent',
              border: `1px solid ${active ? color + '44' : 'var(--border-subtle)'}`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-150"
              style={{
                background: active ? color : 'var(--text-disabled)',
                boxShadow: active ? `0 0 4px ${color}` : 'none',
              }}
            />
            <span
              className="text-[8px] tracking-wide font-medium transition-colors duration-150"
              style={{ color: active ? 'var(--text-primary)' : 'var(--text-disabled)' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}