import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  useDemografi, useTokoh, useBinter, useKerawanan
} from '../hooks/useGasApi'
import { usePos } from '../hooks/useGasApi'
import { DemografiTable } from '../components/pos/DemografiTable'
import { GeoDemoKonsos } from '../components/pos/GeoDemoKonsos'
import { TokohList } from '../components/pos/TokohList'
import { BinterList } from '../components/pos/BinterList'
import { KerawananList } from '../components/pos/KerawananList'
import { PhotoGallery } from '../components/ui/PhotoGallery'
import { formatNumber } from '../utils/formatDate'

const TABS = [
  { id: 'info',       label: 'Info Pos',   icon: '◆' },
  { id: 'demografi',  label: 'Demografi',  icon: '◈' },
  { id: 'geodemo',    label: 'Geo-Demo-Konsos', icon: '◬' },
  { id: 'tokoh',      label: 'Tokoh',      icon: '◉' },
  { id: 'binter',     label: 'Binter',     icon: '◫' },
  { id: 'kerawanan',  label: 'Kerawanan',  icon: '⚠' },
  { id: 'foto',       label: 'Foto Satelit', icon: '▣' },
]

export default function PosDetailPage() {
  const { posId } = useParams()
  const navigate  = useNavigate()
  const { setSelectedPosId } = useApp()

  const [activeTab, setActiveTab] = useState('info')

  const { data: posList } = usePos()
  const pos = (posList || []).find(p => p.pos_id === posId)

  const {
    data: demografi, loading: demLoading, refresh: demRefresh,
  } = useDemografi(posId)

  const {
    data: tokohList, loading: tokohLoading, refresh: tokohRefresh,
  } = useTokoh(posId)

  const {
    data: binterList, loading: binterLoading, refresh: binterRefresh,
  } = useBinter(posId)

  const {
    data: kerawananList, loading: kerawananLoading, refresh: kerawananRefresh,
  } = useKerawanan(posId)

  const activeKerawanan = (kerawananList || []).filter(k => k.status === 'aktif').length

  // Sync ke map saat halaman dibuka
  useState(() => {
    setSelectedPosId && setSelectedPosId(posId)
  })

  return (
    <div className="flex flex-col h-full fade-in">

      {/* ── Header pos ─────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: 'rgba(4,11,6,0.9)',
          borderBottom: '1px solid rgba(0,255,136,0.15)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Breadcrumb + nama */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/')}
                className="text-[9px] text-[rgba(0,255,136,0.4)] hover:text-[rgba(0,255,136,0.7)] tracking-widest uppercase transition-colors"
              >
                ← Overview
              </button>
              <span className="text-[rgba(0,255,136,0.2)] text-xs">/</span>
              <span className="text-[9px] text-[rgba(200,214,229,0.3)] tracking-widest uppercase">
                {posId}
              </span>
            </div>
            <h2 className="text-[rgba(200,214,229,0.9)] font-bold text-base leading-tight truncate">
              {pos?.nama_pos || posId}
            </h2>
            <p className="text-[rgba(200,214,229,0.35)] text-xs mt-0.5">
              {[pos?.lokasi_desa, pos?.kabupaten].filter(Boolean).join(' · ')}
            </p>
          </div>

          {/* Info pills */}
          <div className="flex-shrink-0 flex flex-wrap gap-2 justify-end">
            {pos?.komandan_pos && (
              <InfoPill label="Komandan" value={pos.komandan_pos} />
            )}
            {pos?.jumlah_personel && (
              <InfoPill label="Personel" value={`${pos.jumlah_personel} org`} />
            )}
            {demografi?.total_penduduk && (
              <InfoPill label="Penduduk" value={formatNumber(demografi.total_penduduk)} color="#4488ff" />
            )}
            {activeKerawanan > 0 && (
              <InfoPill label="Kerawanan" value={`${activeKerawanan} aktif`} color="#ff3333" pulse />
            )}
          </div>
        </div>

        {/* ── Tab nav ──────────────────────────────────────── */}
        <div className="flex gap-0.5 mt-3 border-b border-[rgba(0,255,136,0.1)] overflow-x-auto">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            const hasBadge = tab.id === 'kerawanan' && activeKerawanan > 0
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold tracking-[0.12em] uppercase
                  border-b-2 transition-all whitespace-nowrap flex-shrink-0 relative ${
                  isActive
                    ? 'text-[#00ff88] border-[#00ff88] bg-[rgba(0,255,136,0.06)]'
                    : 'text-[rgba(200,214,229,0.35)] border-transparent hover:text-[rgba(200,214,229,0.6)] hover:border-[rgba(0,255,136,0.25)]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {hasBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff3333] rounded-full animate-pulse"
                    style={{ boxShadow: '0 0 4px rgba(255,51,51,0.8)' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' && (
          <InfoPosTab pos={pos} />
        )}

        {activeTab === 'demografi' && (
          <DemografiTable demografi={demografi} loading={demLoading} />
        )}

        {activeTab === 'geodemo' && (
          <GeoDemoKonsos demografi={demografi} loading={demLoading} />
        )}

        {activeTab === 'tokoh' && (
          <TokohList
            tokohList={tokohList}
            loading={tokohLoading}
            posId={posId}
            onRefresh={tokohRefresh}
          />
        )}

        {activeTab === 'binter' && (
          <BinterList
            binterList={binterList}
            loading={binterLoading}
            posId={posId}
            onRefresh={binterRefresh}
          />
        )}

        {activeTab === 'kerawanan' && (
          <KerawananList
            kerawananList={kerawananList}
            loading={kerawananLoading}
            posId={posId}
            onRefresh={kerawananRefresh}
          />
        )}

        {activeTab === 'foto' && (
          <FotoTab pos={pos} />
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────── */

function InfoPill({ label, value, color = '#00ff88', pulse }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px]"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}22`,
      }}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
          style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      )}
      <span style={{ color: `${color}70` }} className="uppercase tracking-wider">{label}</span>
      <span className="font-mono font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

function InfoPosTab({ pos }) {
  if (!pos) return <div className="text-[rgba(200,214,229,0.3)] text-xs text-center py-16">Data pos tidak ditemukan</div>

  const sections = [
    {
      title: 'IDENTITAS POS',
      rows: [
        { label: 'ID Pos',           value: pos.pos_id },
        { label: 'Nama Pos',         value: pos.nama_pos },
        { label: 'Lokasi Desa',      value: pos.lokasi_desa },
        { label: 'Kecamatan',        value: pos.kecamatan },
        { label: 'Kabupaten',        value: pos.kabupaten },
        { label: 'Provinsi',         value: pos.provinsi },
        { label: 'Koordinat',        value: pos.lat && pos.lng ? `${pos.lat}, ${pos.lng}` : '—' },
        { label: 'Jumlah Patok',     value: pos.jumlah_patok ? `${pos.jumlah_patok} patok` : '—' },
      ],
    },
    {
      title: 'KOMANDAN & PERSONEL',
      rows: [
        { label: 'Komandan Pos',      value: pos.komandan_pos || '—' },
        { label: 'Danssk',            value: pos.danssk || '—' },
        { label: 'DPP',               value: pos.dpp || '—' },
        { label: 'Kekuatan Personel', value: pos.jumlah_personel ? `${pos.jumlah_personel} orang` : '—' },
      ],
    },
    {
      title: 'FASILITAS & INFRASTRUKTUR',
      rows: [
        { label: 'Kondisi Bangunan', value: pos.kondisi_bangunan || '—' },
        { label: 'Sumber Air',       value: pos.sumber_air || '—' },
        { label: 'Sumber Listrik',   value: pos.sumber_listrik || '—' },
        { label: 'Jaringan GSM',     value: pos.jaringan_gsm || '—' },
      ],
    },
    {
      title: 'KERAWANAN UTAMA',
      rows: [
        { label: 'Potensi Ancaman',  value: pos.kerawanan_utama || '—', highlight: true },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <div key={section.title} className="rounded-sm overflow-hidden"
          style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
          <div className="px-3 py-2"
            style={{ background: 'rgba(0,255,136,0.05)', borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'rgba(0,255,136,0.7)' }}>{section.title}</span>
          </div>
          <div className="divide-y divide-[rgba(0,255,136,0.05)]">
            {section.rows.map(row => (
              <div key={row.label} className="flex items-start gap-3 px-3 py-2">
                <span className="text-[10px] uppercase tracking-wider flex-shrink-0 w-36"
                  style={{ color: 'rgba(200,214,229,0.35)' }}>{row.label}</span>
                <span className={`text-[11px] font-medium flex-1 ${row.highlight ? 'text-[#ffaa00]' : 'text-[rgba(200,214,229,0.8)]'}`}>
                  {row.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function FotoTab({ pos }) {
  const urls = pos?.foto_satelit_url
    ? pos.foto_satelit_url.split(',').map(s => s.trim()).filter(Boolean)
    : []

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-3xl mb-3 text-[rgba(0,255,136,0.2)]">▣</div>
        <p className="text-[rgba(200,214,229,0.3)] text-xs uppercase tracking-widest mb-2">
          Belum ada foto satelit
        </p>
        <p className="text-[rgba(200,214,229,0.2)] text-[10px] max-w-xs">
          Tambahkan URL foto Google Drive pada kolom <span className="font-mono text-[rgba(0,255,136,0.4)]">foto_satelit_url</span> di Google Sheets
        </p>
        {pos?.lat && pos?.lng && (
          <div className="mt-4 px-3 py-2 rounded-sm"
            style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}>
            <p className="font-mono text-[rgba(0,255,136,0.6)] text-xs">
              {pos.lat}°N, {pos.lng}°E
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {pos?.lat && pos?.lng && (
        <div className="flex items-center gap-2">
          <span className="hud-label">Koordinat</span>
          <span className="font-mono text-xs text-[rgba(0,255,136,0.6)]">
            {pos.lat}°N, {pos.lng}°E
          </span>
        </div>
      )}
      <PhotoGallery urls={urls} />
    </div>
  )
}
