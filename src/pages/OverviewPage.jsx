import { useNavigate } from 'react-router-dom'
import { PamtasMap } from '../components/map/PamtasMap'
import { KerawananBadge } from '../components/ui/Badge'
import { usePos, useSummary, useAllKerawanan, useAllBinter, useAutoRefresh } from '../hooks/useGasApi'
import { formatDate } from '../utils/formatDate'
import { useApp } from '../context/AppContext'
import { BINTER_COLOR_MAP } from '../constants/kerawananCategories'

function getBinterColor(jenis) {
  if (!jenis) return '#4488ff'
  for (const [key, val] of Object.entries(BINTER_COLOR_MAP)) {
    if (jenis.toLowerCase().includes(key.toLowerCase())) return val
  }
  return '#4488ff'
}

export default function OverviewPage() {
  const navigate = useNavigate()

  const { data: posList,   loading: posLoading,       refetch: refetchPos }       = usePos()
  const { data: summary,   loading: summaryLoading,   refetch: refetchSummary }   = useSummary()
  const { data: kerawanan, loading: kerawananLoading, refetch: refetchKerawanan } = useAllKerawanan()
  const { data: binter,    loading: binterLoading,    refetch: refetchBinter }    = useAllBinter()

  // Auto-refresh setiap 5 menit
  useAutoRefresh([refetchPos, refetchSummary, refetchKerawanan, refetchBinter])

  const activeKerawanan = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif')
  const recentBinter    = (binter || [])
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, 5)

  // Lookup pos_id → nama_pos dari posList GAS
  const posNameMap = (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p.nama_pos || p.pos_id
    return acc
  }, {})

  // Ambil 1 ancaman per pos (pos berbeda), max 6
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
  // Hitung total personel dari posList (field jumlah_personel sudah dinormalisasi dari kuat_pers)
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050810]">

      {/* ══ MAP — fullscreen background ══ */}
      <div className="absolute inset-0 z-0">
        <PamtasMap
          posList={posList || []}
          kerawananList={kerawanan || []}
          height="100%"
        />
      </div>

      {/* Grid texture overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ══ TOP ROW — metric cards aligned with panel outer boundaries ══ */}
      <div className="absolute left-2 right-2 z-[10] flex gap-2 pointer-events-none" style={{ top: '8px' }}>
        <MetricCard
          label="TOTAL PERSONEL"
          value={posLoading ? '—' : totalPersonel}
          unit="pax"
          color="#00ff88"
          icon="◫"
        />
        <MetricCard
          label="TOTAL POS"
          value={posLoading ? '—' : (posList || []).length}
          unit="pos aktif"
          color="#4488ff"
          icon="◈"
        />
        <MetricCard
          label="TOTAL PENDUDUK"
          value={summaryLoading ? '—' : ((summary?.total_penduduk || 0)).toLocaleString('id-ID')}
          unit="jiwa"
          color="#4488ff"
          icon="◉"
        />
        <MetricCard
          label="KEPALA KELUARGA"
          value={summaryLoading ? '—' : ((summary?.total_kk || 0)).toLocaleString('id-ID')}
          unit="KK"
          color="#ffaa00"
          icon="◈"
        />
        <MetricCard
          label="KERAWANAN AKTIF"
          value={kerawananLoading ? '—' : activeKerawanan.length}
          unit="kasus"
          color={activeKerawanan.length > 0 ? '#ff3333' : '#00ff88'}
          icon="⚠"
          danger={activeKerawanan.length > 0}
        />
        <MetricCard
          label="POS RAWAN"
          value={posRawan}
          unit={`dari ${totalPos} pos`}
          color={posRawan > 0 ? '#ff8844' : '#00ff88'}
          icon="◆"
          danger={posRawan > 3}
        />
        <MetricCard
          label="KEGIATAN BINTER"
          value={(binter || []).length}
          unit="total kegiatan"
          color="#bb88ff"
          icon="★"
        />
      </div>

      {/* ══ LEFT PANEL ══ */}
      <div className="absolute left-2 z-[10] w-60 flex flex-col gap-2" style={{ top: 'calc(8px + 72px + 20px)', bottom: '36px' }}>

        {/* Ancaman aktif */}
        <OverlayPanel title="⚠ ANCAMAN AKTIF" badge={activeKerawanan.length} badgeDanger>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
            {activeKerawanan.length === 0 ? (
              <div className="flex items-center gap-2 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
                  style={{ boxShadow: '0 0 6px rgba(0,255,136,0.8)' }} />
                <span className="text-[10px] text-[rgba(0,255,136,0.7)] tracking-widest uppercase">
                  Kondisi Aman
                </span>
              </div>
            ) : (
              ancamanPerPos.map(item => (
                <div key={item.id}
                  className="flex items-start gap-2 p-2 cursor-pointer transition-all rounded-sm"
                  style={{ background: 'rgba(255,51,51,0.06)', border: '1px solid rgba(255,51,51,0.2)' }}
                  onClick={() => navigate('/kerawanan')}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff3333] mt-1.5 flex-shrink-0 animate-pulse"
                    style={{ boxShadow: '0 0 5px rgba(255,51,51,0.9)' }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <KerawananBadge kategori={item.kategori} />
                      <span className="text-[8px] font-bold tracking-wide flex-shrink-0"
                        style={{ color: 'rgba(255,100,100,0.75)' }}>
                        {posNameMap[item.pos_id]
                          ? posNameMap[item.pos_id].replace(/^Pos /i, 'POS ').toUpperCase()
                          : item.pos_id}
                      </span>
                    </div>
                    <p className="text-[9px] text-[rgba(200,214,229,0.45)] truncate">
                      {item.deskripsi ? item.deskripsi.slice(0, 35) : '—'}
                    </p>
                  </div>
                </div>
              ))
            )}
            {activeKerawanan.length > 6 && (
              <button onClick={() => navigate('/kerawanan')}
                className="w-full text-[9px] text-[rgba(255,51,51,0.6)] hover:text-[#ff3333] py-1 tracking-wider uppercase transition-colors">
                +{activeKerawanan.length - 6} lainnya →
              </button>
            )}
          </div>
        </OverlayPanel>

        {/* Kegiatan Binter */}
        <OverlayPanel title="◈ KEGIATAN BINTER" onMore={() => navigate('/binter')}>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
            {recentBinter.length === 0 ? (
              <p className="text-[9px] text-[rgba(200,214,229,0.3)] py-2 text-center tracking-widest uppercase">
                Belum ada data
              </p>
            ) : (
              recentBinter.map((item, i) => (
                <div key={item.id || i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: getBinterColor(item.jenis_kegiatan),
                      boxShadow: `0 0 4px ${getBinterColor(item.jenis_kegiatan)}`,
                    }} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-[rgba(200,214,229,0.8)] truncate leading-tight">
                      {item.jenis_kegiatan || 'Kegiatan'}
                    </p>
                    <p className="text-[9px] text-[rgba(200,214,229,0.35)] truncate">
                      {item.pos_id} · {item.tanggal ? formatDate(item.tanggal) : '—'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </OverlayPanel>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="absolute right-2 z-[10] w-52 flex flex-col gap-2" style={{ top: 'calc(8px + 72px + 20px)' }}>

        {/* Status Personel — redesigned */}
        <OverlayPanel title="◆ STATUS PERSONEL" onMore={() => navigate('/laporan/demografi')}>
          <PersonelPanel posList={posList} loading={posLoading} navigate={navigate} />
        </OverlayPanel>

        {/* Situasi Intelijen */}
        <OverlayPanel title="◉ SITUASI INTELIJEN">
          <div className="space-y-3">
            <IntelRow label="Pos Aman"          value={posAman}                total={totalPos}  color="#00ff88" />
            <IntelRow label="Pos Rawan"         value={posRawan}               total={totalPos}  color="#ff3333" />
            <IntelRow label="Kegiatan Binter"   value={(binter||[]).length}    unit="kegiatan" color="#4488ff" />
            <IntelRow label="Tindak Pelanggaran" value={activeKerawanan.length} unit="kasus"   color="#ffaa00" />
          </div>
        </OverlayPanel>

      </div>

      {/* ══ BOTTOM — layer toggles ══ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center">
        <MapLayerBar />
      </div>

    </div>
  )
}

/* ── STATUS PERSONEL panel ──────────────────────────────── */
function PersonelPanel({ posList, loading, navigate }) {
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  const top5 = [...(posList || [])]
    .sort((a, b) => (Number(b.jumlah_personel) || 0) - (Number(a.jumlah_personel) || 0))
    .slice(0, 5)

  // Kelompokkan per kabupaten dari data aktual
  const kabMap = {}
  ;(posList || []).forEach(p => {
    const kab = (p.kabupaten || 'Lainnya').replace('Kab. ', '')
    if (!kabMap[kab]) kabMap[kab] = { count: 0, personel: 0 }
    kabMap[kab].count++
    kabMap[kab].personel += Number(p.jumlah_personel) || 0
  })
  const kabData = Object.entries(kabMap)
    .sort((a, b) => b[1].personel - a[1].personel)
    .slice(0, 2)

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 rounded-sm bg-[rgba(0,255,136,0.04)] animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 rounded-sm bg-[rgba(0,255,136,0.04)] animate-pulse" />
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
            style={{ color: 'rgba(200,214,229,0.35)' }}>Total Kekuatan</p>
          <p className="font-mono font-bold leading-none"
            style={{ fontSize: '26px', color: '#00ff88', textShadow: '0 0 18px rgba(0,255,136,0.45)' }}>
            {totalPersonel}
          </p>
          <p className="text-[8px] mt-0.5 tracking-wide"
            style={{ color: 'rgba(200,214,229,0.25)' }}>
            personel · {(posList || []).length} pos
          </p>
        </div>

        {/* Kabupaten pills — dari data aktual */}
        <div className="flex flex-col gap-1 items-end">
          {kabData.map(([kab, { count, personel }]) => (
            <div key={kab} className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
              style={{ background: 'rgba(68,136,255,0.07)', border: '1px solid rgba(68,136,255,0.18)' }}>
              <div className="text-right">
                <p className="font-mono text-[10px] font-bold leading-none" style={{ color: '#4488ff' }}>
                  {personel}
                </p>
                <p className="text-[7px] uppercase tracking-wide leading-tight"
                  style={{ color: 'rgba(200,214,229,0.3)' }}>
                  {kab.slice(0, 3)} · {count} POS
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px" style={{ background: 'rgba(0,255,136,0.08)' }} />

      {/* ── Top 5 bar chart — % dari TOTAL personel, bukan dari max ── */}
      <div className="space-y-1.5">
        <p className="text-[7px] uppercase tracking-[0.2em] px-0.5"
          style={{ color: 'rgba(200,214,229,0.25)' }}>Kekuatan per Pos (% dari total)</p>
        {top5.map((pos, i) => {
          const num    = Number(pos.jumlah_personel) || 0
          const pct    = totalPersonel > 0 ? Math.round((num / totalPersonel) * 100) : 0
          const posNo  = pos.pos_id === 'KOTIS' ? '★' : pos.pos_id.replace('POS-', '')
          const accent = i === 0 ? '#ffd700' : i === 1 ? '#00ff88' : i === 2 ? 'rgba(0,255,136,0.65)' : 'rgba(0,255,136,0.4)'
          return (
            <div key={pos.pos_id}
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate(`/pos/${pos.pos_id}`)}>
              {/* Rank */}
              <span className="font-mono text-[8px] w-3 text-right flex-shrink-0 opacity-40"
                style={{ color: '#00ff88' }}>{i + 1}</span>
              {/* Pos label */}
              <span className="font-mono text-[9px] font-bold w-5 text-center flex-shrink-0 rounded-sm py-px"
                style={{
                  color: accent,
                  background: `${accent}18`,
                  border: `1px solid ${accent}33`,
                }}>
                {posNo}
              </span>
              {/* Bar */}
              <div className="flex-1 h-[5px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                    boxShadow: i === 0 ? `0 0 6px ${accent}66` : 'none',
                  }} />
              </div>
              {/* Value + pct */}
              <span className="font-mono text-[9px] font-bold w-10 text-right flex-shrink-0"
                style={{ color: 'rgba(200,214,229,0.45)' }}>{num} <span style={{ color: 'rgba(200,214,229,0.25)', fontSize: '7px' }}>{pct}%</span></span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────── */

function MetricCard({ label, value, unit, color, icon, danger }) {
  return (
    <div className="flex-1 min-w-0 px-3 py-2 rounded-sm pointer-events-auto"
      style={{
        background: 'rgba(5,8,10,0.82)',
        border: `1px solid ${danger ? 'rgba(255,51,51,0.3)' : 'rgba(0,255,136,0.15)'}`,
        backdropFilter: 'blur(10px)',
        boxShadow: danger ? '0 0 12px rgba(255,51,51,0.1)' : '0 0 12px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px]" style={{ color }}>{icon}</span>
        <span className="text-[8px] tracking-[0.15em] uppercase"
          style={{ color: 'rgba(200,214,229,0.4)' }}>{label}</span>
      </div>
      <div className="font-mono font-bold leading-none"
        style={{ fontSize: '22px', color, textShadow: `0 0 16px ${color}66` }}>
        {value}
      </div>
      <div className="text-[8px] mt-0.5 tracking-wider" style={{ color: 'rgba(200,214,229,0.3)' }}>
        {unit}
      </div>
    </div>
  )
}

function OverlayPanel({ title, badge, badgeDanger, onMore, children }) {
  return (
    <div className="rounded-sm overflow-hidden"
      style={{
        background: 'rgba(5,8,10,0.88)',
        border: '1px solid rgba(0,255,136,0.18)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: '1px solid rgba(0,255,136,0.1)', background: 'rgba(0,255,136,0.04)' }}>
        <span className="text-[9px] font-bold tracking-[0.15em] uppercase"
          style={{ color: 'rgba(0,255,136,0.85)' }}>
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge !== undefined && (
            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
              style={badgeDanger && Number(badge) > 0 ? {
                color: '#ff3333',
                background: 'rgba(255,51,51,0.12)',
                border: '1px solid rgba(255,51,51,0.3)',
              } : {
                color: 'rgba(0,255,136,0.6)',
                background: 'rgba(0,255,136,0.06)',
                border: '1px solid rgba(0,255,136,0.2)',
              }}>
              {badge}
            </span>
          )}
          {onMore && (
            <button onClick={onMore}
              className="text-[8px] tracking-widest uppercase transition-colors"
              style={{ color: 'rgba(0,255,136,0.4)' }}
              onMouseEnter={e => e.target.style.color = '#00ff88'}
              onMouseLeave={e => e.target.style.color = 'rgba(0,255,136,0.4)'}
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

function IntelRow({ label, value, total, unit, color }) {
  const pct = total ? Math.round((value / total) * 100) : null
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[8px] uppercase tracking-[0.1em]"
          style={{ color: 'rgba(200,214,229,0.4)' }}>{label}</span>
        <span className="font-mono text-[10px] font-bold" style={{ color }}>
          {value}{unit ? ` ${unit}` : ''}{pct !== null ? ` / ${total}` : ''}
        </span>
      </div>
      {pct !== null && (
        <div className="h-[2px] rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: color }} />
        </div>
      )}
    </div>
  )
}

function MapLayerBar() {
  const { mapLayers, toggleMapLayer } = useApp()

  const layers = [
    { key: 'pos',         label: 'Pos',         color: '#00ff88' },
    { key: 'narkoba',     label: 'Narkoba',     color: '#dc2626' },
    { key: 'kriminal',    label: 'Kriminal',    color: '#ef4444' },
    { key: 'logging',     label: 'Logging',     color: '#d97706' },
    { key: 'trading',     label: 'Trading',     color: '#f59e0b' },
    { key: 'trafficking', label: 'Trafficking', color: '#db2777' },
    { key: 'border',      label: 'Border',      color: '#0ea5e9' },
    { key: 'pmInp',       label: 'PMI NP',      color: '#ea580c' },
    { key: 'binter',      label: 'Binter',      color: '#4488ff' },
  ]

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-sm"
      style={{
        background: 'rgba(5,8,10,0.85)',
        border: '1px solid rgba(0,255,136,0.12)',
        backdropFilter: 'blur(8px)',
      }}>
      {layers.map(({ key, label, color }) => {
        const active = mapLayers[key]
        return (
          <button
            key={key}
            onClick={() => toggleMapLayer(key)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm transition-all whitespace-nowrap"
            style={{
              background: active ? `${color}18` : 'transparent',
              border: `1px solid ${active ? color + '44' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all"
              style={{
                background: active ? color : 'rgba(255,255,255,0.15)',
                boxShadow: active ? `0 0 4px ${color}` : 'none',
              }} />
            <span className="text-[8px] tracking-wide font-medium"
              style={{ color: active ? 'rgba(200,214,229,0.75)' : 'rgba(200,214,229,0.25)' }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
