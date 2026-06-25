import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  useDemografi, useTokoh, useBinter, useKerawanan, usePos, usePatroli
} from '../hooks/useSupabase'
import { DemografiTable } from '../components/pos/DemografiTable'
import { GeoDemoKonsos } from '../components/pos/GeoDemoKonsos'
import { TokohList } from '../components/pos/TokohList'
import { BinterList } from '../components/pos/BinterList'
import { KerawananList } from '../components/pos/KerawananList'
import { PatroliList } from '../components/pos/PatroliList'
import { Modal } from '../components/ui/Modal'
import { PosForm } from '../components/forms/PosForm'
import { formatNumber } from '../utils/formatDate'
import { aggregateDemografi } from '../utils/demografi'
import { hitungKerawananPos } from '../constants/kerawananCategories'
import { isDriveUrl, driveToThumbnail } from '../utils/driveUrl'
import { POS_TABS, VALID_POS_TABS } from '../constants/config'
import { posService } from '../services/pos.service'
import { useToast } from '../components/ui/Toast'

export default function PosDetailPage() {
  const { posId, tab } = useParams()
  const navigate  = useNavigate()
  const location  = useLocation()
  const { setSelectedPosId } = useApp()
  const { showToast } = useToast()

  const normalizedTab = tab?.toLowerCase()
  const [activeTab, setActiveTab] = useState(
    VALID_POS_TABS.includes(normalizedTab) ? normalizedTab : 'info'
  )
  const [editPosOpen, setEditPosOpen] = useState(false)
  // ID insiden yang harus di-highlight (dikirim via navigate state dari InsidenPage)
  const highlightId = location.state?.highlightId || null

  // Sync activeTab jika URL tab berubah (navigasi langsung via URL)
  useEffect(() => {
    const t = tab?.toLowerCase()
    if (VALID_POS_TABS.includes(t) && t !== activeTab) {
      setActiveTab(t)
    }
  }, [tab]) // eslint-disable-line

  const { data: posList, loading: posListLoading, error: posListError, refresh: posRefresh } = usePos()
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

  const {
    data: patroliList, loading: patroliLoading, refresh: patroliRefresh,
  } = usePatroli(posId)

  const activeKerawanan = (kerawananList || []).filter(k => k.status === 'aktif').length
  const { totalPoin, level } = hitungKerawananPos(kerawananList)

  // Ringkasan demografi (array → objek terjumlah), pakai nama kolom skema aktual
  const demografiSummary = aggregateDemografi(demografi)

  const handleSavePos = async (payload) => {
    try {
      await posService.update(posId, payload)
      posRefresh()
      setEditPosOpen(false)
      showToast('Data pos berhasil diperbarui', 'success')
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    }
  }

  // Sync ke map saat halaman dibuka
  useEffect(() => {
    setSelectedPosId && setSelectedPosId(posId)
  }, [posId, setSelectedPosId])

  // Error state — GAS gagal
  if (posListError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
        <div className="text-3xl text-[rgba(255,51,51,0.4)]">⚠</div>
        <p className="text-[rgba(255,100,100,0.7)] text-sm font-bold uppercase tracking-widest">
          Gagal Memuat Data
        </p>
        <p className="text-[rgba(200,214,229,0.35)] text-xs max-w-xs">
          Koneksi ke server gagal. Periksa koneksi internet dan coba lagi.
        </p>
        <p className="font-mono text-[rgba(255,100,100,0.4)] text-[10px]">{posListError}</p>
        <button
          className="hud-btn mt-2"
          onClick={() => window.location.reload()}
        >
          ↺ Coba Lagi
        </button>
      </div>
    )
  }

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
          <div className="flex-shrink-0 flex flex-wrap gap-2 justify-end items-start">
            {pos?.komandan_pos && (
              <InfoPill label="Komandan" value={pos.komandan_pos} />
            )}
            {pos?.jumlah_personel && (
              <InfoPill label="Personel" value={`${pos.jumlah_personel} org`} />
            )}
            {demografiSummary?.total_penduduk > 0 && (
              <InfoPill label="Penduduk" value={formatNumber(demografiSummary.total_penduduk)} color="#4488ff" />
            )}
            {activeKerawanan > 0 && (
              <InfoPill label="Insiden" value={`${activeKerawanan} aktif`} color="#ff3333" pulse />
            )}
            {level !== 'AMAN' && (
              <InfoPill
                label="Klasifikasi"
                value={`${level} (${totalPoin} poin)`}
                color={level === 'SIAGA' ? '#ff3333' : '#ffaa00'}
                pulse={level === 'SIAGA'}
              />
            )}
            {/* Tombol cetak laporan */}
            <button
              onClick={() => navigate(`/laporan/pos/${posId}`)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] transition-colors"
              style={{
                background: 'rgba(68,136,255,0.06)',
                border: '1px solid rgba(68,136,255,0.2)',
                color: 'rgba(68,136,255,0.7)',
              }}
              title="Cetak laporan pos"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Laporan
            </button>
          </div>
        </div>

        {/* ── Tab nav ──────────────────────────────────────── */}
        <div className="flex gap-0.5 mt-3 border-b border-[rgba(0,255,136,0.1)] overflow-x-auto">
          {POS_TABS.map(tab => {
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
          <InfoPosTab pos={pos} onEdit={() => setEditPosOpen(true)} />
        )}

        {activeTab === 'demografi' && (
          <DemografiTable demografi={demografi} loading={demLoading} />
        )}

        {activeTab === 'geodemo' && (
          <GeoDemoKonsos demografi={demografiSummary} pos={pos} loading={demLoading} />
        )}

        {activeTab === 'tokoh' && (
          <TokohList
            tokohList={tokohList}
            loading={tokohLoading}
            posId={posId}
            posNama={pos?.nama_pos}
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
            highlightId={highlightId}
          />
        )}

        {activeTab === 'patroli' && (
          <PatroliList
            patroliList={patroliList}
            loading={patroliLoading}
            posId={posId}
            onRefresh={patroliRefresh}
          />
        )}

        {activeTab === 'foto' && (
          <DokumentasiTab pos={pos} />
        )}
      </div>

      {/* ── Modal edit pos ─────────────────────────────────── */}
      <Modal
        isOpen={editPosOpen}
        onClose={() => setEditPosOpen(false)}
        title={`Edit Data Pos — ${posId}`}
        size="lg"
      >
        <PosForm
          initialData={pos}
          onSave={handleSavePos}
          onCancel={() => setEditPosOpen(false)}
        />
      </Modal>
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

function InfoPosTab({ pos, onEdit }) {
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
      rows: pos.pos_id === 'KOTIS' || pos.pos_id === 'KT'
        ? [
            { label: 'Komandan Satgas',  value: pos.komandan_pos  || 'Letkol Kav Dian Kriswijaya, S.I.P.' },
            { label: 'Pasi Intel',       value: pos.pasi_intel    || 'Lettu Kav Rudy Agustinud Abednego Siahaan, S.Tr.Han.' },
            { label: 'Pasi Ops',         value: pos.pasi_ops      || 'Letda Kav Yudhatama Risa Alfarisi, S.Tr.Han.' },
            { label: 'Pasi Minlog',      value: pos.pasi_minlog   || 'Lettu Kav Johan Wicaksana, S.T.' },
            { label: 'Pasi Ter',         value: pos.pasi_ter      || 'Lettu Kav M. Afif Ma\'ruf, S.Tr.Han.' },
            { label: 'Pabintal',         value: pos.pabintal      || 'Kapten Kav Aldo Luthfan Aldama, S.Tr.Han.' },
            { label: 'Pa Analis',        value: pos.pa_analis     || 'Letda Kav Ridho Al Fahrizi, S.T.' },
            { label: 'Kekuatan Personel', value: pos.jumlah_personel ? `${pos.jumlah_personel} orang` : '62 orang' },
          ]
        : [
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
      <div className="flex justify-end">
        <button className="hud-btn text-[10px]" onClick={onEdit}>
          ✎ Edit Data Pos
        </button>
      </div>
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

function DokumentasiTab({ pos }) {
  const [newUrl, setNewUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [extraUrls, setExtraUrls] = useState([])

  const savedUrls = pos?.foto_satelit_url
    ? pos.foto_satelit_url.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const allUrls = [...savedUrls, ...extraUrls]

  function handleAddUrl() {
    const trimmed = newUrl.trim()
    if (!trimmed) return
    // Validasi minimal: harus URL
    try {
      new URL(trimmed)
    } catch {
      setUrlError('URL tidak valid')
      return
    }
    if (allUrls.includes(trimmed)) {
      setUrlError('URL sudah ada')
      return
    }
    setExtraUrls(prev => [...prev, trimmed])
    setNewUrl('')
    setUrlError('')
  }

  function handleRemoveExtra(url) {
    setExtraUrls(prev => prev.filter(u => u !== url))
  }

  return (
    <div className="space-y-4">
      {/* Koordinat info */}
      {pos?.lat && pos?.lng && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm"
          style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.12)' }}>
          <span className="hud-label">Koordinat Pos</span>
          <span className="font-mono text-xs text-[rgba(0,255,136,0.6)]">
            {pos.lat}°N, {pos.lng}°E
          </span>
        </div>
      )}

      {/* Input tambah URL foto */}
      <div className="rounded-sm overflow-hidden"
        style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
        <div className="px-3 py-1.5"
          style={{ background: 'rgba(0,255,136,0.03)', borderBottom: '1px solid rgba(0,255,136,0.08)' }}>
          <span className="text-[8px] font-bold tracking-[0.2em] uppercase"
            style={{ color: 'rgba(0,255,136,0.7)' }}>Tambah Foto</span>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex gap-2">
            <input
              className="hud-input flex-1 text-[10px]"
              placeholder="https://drive.google.com/file/d/... atau URL foto langsung"
              value={newUrl}
              onChange={e => { setNewUrl(e.target.value); setUrlError('') }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl() } }}
            />
            <button
              className="hud-btn text-[10px] px-3 flex-shrink-0"
              onClick={handleAddUrl}
              disabled={!newUrl.trim()}
            >
              + Tambah
            </button>
          </div>
          {urlError && (
            <p className="text-[10px] text-[rgba(255,80,80,0.8)]">✕ {urlError}</p>
          )}
          <p className="text-[9px] leading-relaxed" style={{ color: 'rgba(200,214,229,0.35)' }}>
            Google Drive: klik kanan foto → "Dapatkan link" → akses "Siapa saja yang punya link" → salin URL.
            Untuk menyimpan permanen, tambahkan URL ke kolom{' '}
            <span className="font-mono text-[rgba(0,255,136,0.5)]">foto_satelit_url</span>{' '}
            di sheet <span className="font-mono text-[rgba(0,255,136,0.5)]">pos</span> (pisah koma).
          </p>
        </div>
      </div>

      {/* Galeri foto */}
      {allUrls.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="hud-label">Dokumentasi ({allUrls.length})</p>
            {extraUrls.length > 0 && (
              <span className="text-[9px] text-[rgba(255,170,0,0.6)] italic">
                {extraUrls.length} URL baru (belum disimpan ke sheet)
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {allUrls.map((url, i) => (
              <GalleryItem
                key={url + i}
                url={url}
                isExtra={extraUrls.includes(url)}
                onRemove={() => handleRemoveExtra(url)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="text-3xl mb-3 text-[rgba(0,255,136,0.2)]">▣</div>
          <p className="text-[rgba(200,214,229,0.3)] text-xs uppercase tracking-widest mb-2">
            Belum ada dokumentasi
          </p>
          <p className="text-[rgba(200,214,229,0.2)] text-[10px] max-w-xs">
            Tambahkan URL foto di atas untuk melihat galeri dokumentasi pos ini.
          </p>
        </div>
      )}
    </div>
  )
}

function GalleryItem({ url, isExtra, onRemove }) {
  const thumbUrl = isDriveUrl(url)
    ? driveToThumbnail(url, 400)
    : url
  const fullUrl = url

  return (
    <div className="relative group rounded-sm overflow-hidden"
      style={{
        aspectRatio: '16/9',
        background: 'rgba(0,255,136,0.03)',
        border: isExtra ? '1px solid rgba(255,170,0,0.25)' : '1px solid rgba(0,255,136,0.15)',
      }}>
      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-3 h-3 z-10 pointer-events-none"
        style={{ borderTop: `1px solid ${isExtra ? 'rgba(255,170,0,0.5)' : 'rgba(0,255,136,0.5)'}`, borderLeft: `1px solid ${isExtra ? 'rgba(255,170,0,0.5)' : 'rgba(0,255,136,0.5)'}` }} />
      <span className="absolute bottom-0 right-0 w-3 h-3 z-10 pointer-events-none"
        style={{ borderBottom: `1px solid ${isExtra ? 'rgba(255,170,0,0.5)' : 'rgba(0,255,136,0.5)'}`, borderRight: `1px solid ${isExtra ? 'rgba(255,170,0,0.5)' : 'rgba(0,255,136,0.5)'}` }} />

      <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        <img
          src={thumbUrl}
          alt="Dokumentasi"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling && (e.target.nextSibling.style.display = 'flex')
          }}
        />
        {/* Fallback saat gambar gagal load */}
        <div className="hidden w-full h-full items-center justify-center absolute inset-0"
          style={{ color: 'rgba(200,214,229,0.2)', fontSize: 11 }}>
          ▣ Gagal load
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,255,136,0.08)' }}>
          <span className="text-[rgba(0,255,136,0.8)] text-xs tracking-widest uppercase font-bold">
            Buka →
          </span>
        </div>
      </a>

      {/* Badge "baru" + tombol hapus untuk URL yang baru ditambahkan */}
      {isExtra && (
        <div className="absolute top-1 right-1 flex items-center gap-1 z-20">
          <span className="text-[8px] px-1 py-0.5 rounded-sm font-bold"
            style={{ background: 'rgba(255,170,0,0.15)', color: 'rgba(255,170,0,0.8)', border: '1px solid rgba(255,170,0,0.25)' }}>
            BARU
          </span>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onRemove() }}
            className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] transition-colors"
            style={{ background: 'rgba(255,51,51,0.2)', color: 'rgba(255,51,51,0.8)', border: '1px solid rgba(255,51,51,0.3)' }}
            title="Hapus dari preview"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
