import { useState } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { useToast } from '../ui/Toast'
import { usePos, useDemografi } from '../../hooks/useSupabase'
import { demografiService } from '../../services/demografi.service'
import { POS_LIST } from '../../constants/posList'

/**
 * GeoDemoKonsos — Tab Geo-Demo-Konsos di PosDetailPage.
 *
 * Menampilkan tiga aspek: Kondisi Geografi, Kondisi Demografi, Kondisi Sosial.
 * - Kondisi Geografi: Data dari POS, bisa edit langsung
 * - Kondisi Demografi: Data dari demografi, bisa edit Total Penduduk & KK
 * - Kondisi Sosial: Auto-generated analysis, bisa edit manual
 */

/// ══════════════════════════════════════════════════════════════════════════════
//  AUTO-GENERATED DESCRIPTIONS
/// ══════════════════════════════════════════════════════════════════════════════

function generateGeografiAuto(pos) {
  const posId = pos?.pos_id || ''
  const posData = POS_LIST.find(p => p.pos_id === posId) || {}
  const { lat, lng, jumlah_personel: personel = 0, nama_pos: namaPos } = posData

  const isKotis = posId === 'KOTIS' || posId === 'KT'
  const isDPP = posId.includes('DPP')
  const isSebatik = namaPos?.toLowerCase().includes('sebatik') ||
    posData.lokasi_desa?.toLowerCase().includes('sebatik')

  const elevasiHint = (lat && lng)
    ? (lat < -4 ? 'elevasi dataran tinggi/becek khas hutan tropis perbatasan' : 'elevasi rendah hingga dataran beach/frontier yang landai')
    : ''

  const koordinatHint = (lat && lng)
    ? `berkoordinat ${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'LU' : 'LS'}, ${Math.abs(lng).toFixed(4)}°BT`
    : ''

  let personelKlasifikasi = isKotis
    ? `sebagai Pos Induk (Kotis) memiliki kekuatan tertinggi yaitu ${personel} personel TNI AD, berfungsi sebagai pusat komando dan koordinasi operasi di seluruh wilayah tugas`
    : personel >= 20
    ? `berkedudukan sebagai pos dengan kekuatan sedang (${personel} personel), mampu menjalankan operasi patroli mandiri dan reaksi cepat dalam radius tugasnya`
    : personel >= 10
    ? `berposisi sebagai pos dengan kekuatan terbatas (${personel} personel), mengutamakan fungsi surveillance (pengawasan) dan early warning terhadap aktivitas di sekitar GBN`
    : `memiliki kekuatan personel minimal (${personel} personel), lebih mengutamakan fungsi pengamatan定点 (observation post) dan pelaporan situasi perbatasan`

  let lokasiDeskripsi = isKotis
    ? `Pos ini terletak di kawasan ${posData.lokasi_desa || 'Pasir Putih'}, merupakan simpul utama operasi seluruh pos yang berada dalam yurisdiksi Yonkav 8/NSW.`
    : isDPP
    ? `Pos DPP (Dewan Pengarah Pos) berfungsi sebagai pos pendukung dengan peran spesifik dalam koordinasi tingkat detachemen.`
    : isSebatik
    ? `Wilayah tugas berada di Pulau Sebatik yang merupakan kawasan perbatasan darat terbesar antara Indonesia dan Malaysia di Kalimantan Utara.`
    : `Berada di wilayah perbatasan darat dengan topografi yang bervariasi antara dataran beach hingga forested hill.`

  let aksesibilitas = isKotis || isDPP
    ? 'Pos memiliki akses jalan yang relatif baik dan dapat dijangkau dengan kendaraan bermotor sepanjang tahun.'
    : 'Akses menuju pos dapat dilalui melalui jalan tanah dan sungai pada musim kemarau.'

  return [
    `**${namaPos || posId}** (${posId}) ${koordinatHint} merupakan bagian integral dari Garis Batas Negara (GBN) di wilayah perbatasan darat Indonesia-Malaysia.`,
    lokasiDeskripsi,
    `Pos ini beroperasi ${personelKlasifikasi}.`,
    `Wilayah tugas memiliki karakteristik ${elevasiHint}. ${aksesibilitas}`,
  ].join('\n\n')
}

function generateKonsosAuto(demografiSummary, pos) {
  const { total_penduduk: penduduk = 0, total_kk: kk = 0 } = demografiSummary || {}
  const posId = pos?.pos_id || ''
  const namaPos = pos?.nama_pos || posId
  const posData = POS_LIST.find(p => p.pos_id === posId) || {}
  const { jumlah_personel: personel = 0 } = posData

  const isKotis = posId === 'KOTIS' || posId === 'KT'
  const isDPP = posId.includes('DPP')
  const isSebatik = namaPos?.toLowerCase().includes('sebatik')

  const padatHint = penduduk < 200
    ? 'kepadatan sangat rendah — zona penyangga perbatasan dengan interaksi sosial yang minim'
    : penduduk < 1000
    ? 'kepadatan rendah dengan ikatan sosial yang erat (close-knit community) khas komunitas pedesaan perbatasan'
    : penduduk < 5000
    ? 'kepadatan sedang dengan struktur sosial yang sudah lebih terdiferensiasi dan hierarkis'
    : 'kepadatan tinggi dengan dinamika sosial yang kompleks dan beragam'

  let ekonomiDesc = isKotis || isDPP
    ? `Struktur ekonomi di sekitar ${namaPos} didominasi oleh sektor jasa dan perdagangan perbatasan. Keberadaan Pasar Nunukan sebagai titik perdagangan utama menarik mobilitas ekonomi dari seluruh wilayah perbatasan.`
    : isSebatik
    ? `Ekonomi Pulau Sebatik dicirikan oleh dual ekonomi: sektor perkebunan kelapa sawit dan perdagangan lintas batas unofficial.`
    : `Mata pencaharian masyarakat di sektor ini didominasi oleh pertanian subsisten, perlanian, dan perdagangan lintas batas unofficial.`

  let sosialLayananDesc = penduduk > 2000
    ? `Tingkat pendidikan masyarakat di kawasan ini bervariasi: sebagian besar memiliki pendidikan SD-SMP. Akses terhadap pendidikan tinggi dan fasilitas kesehatan masih terbatas.`
    : `Akses terhadap fasilitas pendidikan dan kesehatan di wilayah ini sangat terbatas.`

  let lintasBatasDesc = isSebatik
    ? `Hubungan sosial antara warga Indonesia dan Malaysia di Pulau Sebatik memiliki karakter yang sangat khusus dengan interaksi daily yang intens.`
    : `Hubungan antarwarga di sekitar GBN pada umumnya berjalan harmonis, didukung oleh ikatan etnis, agama, dan keluarga yang melintasi batas negara.`

  const posRoleDesc = isKotis
    ? `Keberadaan Kotis ${namaPos} memberikan efek stabilisator yang sangat signifikan terhadap keamanan dan ketertiban di seluruh wilayah perbatasan.`
    : `Keberadaan pos ${namaPos} dengan ${personel} personel TNI memberikan efek stabilisator terhadap keamanan dan ketertiban di sektornya.`

  const rekomendasiDesc = isKotis || isDPP
    ? `**Rekomendasi:** Fokus BINLA pada penguatan governance lokal dan economic empowerment. BINTEK difokuskan pada peningkatan kesadaran hukum dan civic responsibility.`
    : `**Rekomendasi:** Sesuaikan pendekatan BINLA dengan karakter sosial masing-masing pos.`

  return [
    `**Analisis Kondisi Sosial**\nKondisi sosial masyarakat di wilayah perbatasan ini dicirikan oleh ${padatHint}.`,
    `\n**Struktur Ekonomi:** ${ekonomiDesc}`,
    sosialLayananDesc ? `\n**Pendidikan & Kesehatan:** ${sosialLayananDesc}` : '',
    `\n**Dinamika Lintas Batas:** ${lintasBatasDesc}`,
    `\n**Peran Pos:** ${posRoleDesc}`,
    `\n${rekomendasiDesc}`,
  ].filter(Boolean).join('')
}

/// ══════════════════════════════════════════════════════════════════════════════
//  HELPER COMPONENTS
/// ══════════════════════════════════════════════════════════════════════════════

function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[9px] px-2 py-0.5 rounded-sm transition-all duration-150 flex-shrink-0"
      style={{
        color: 'rgba(0,255,136,0.5)',
        border: '1px solid rgba(0,255,136,0.2)',
        background: 'rgba(0,255,136,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#00ff88'
        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)'
        e.currentTarget.style.background = 'rgba(0,255,136,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(0,255,136,0.5)'
        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)'
        e.currentTarget.style.background = 'rgba(0,255,136,0.04)'
      }}
    >
      ✎ Edit
    </button>
  )
}

function Section({ icon, label, color, glow, children, headerRight }) {
  return (
    <div className="hud-panel relative overflow-hidden"
      style={{ borderLeftColor: color, borderLeftWidth: '2px' }}>
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none rounded-sm"
        style={{ background: `radial-gradient(ellipse at top left, ${glow}, transparent)` }} />
      <div className="hud-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color }}>{icon}</span>
          <span className="hud-title">{label}</span>
        </div>
        {headerRight}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, mono, editable, onChange, saving }) {
  const [editValue, setEditValue] = useState(value || '')

  if (editable) {
    return (
      <div className="flex items-start gap-3 py-1.5 border-b border-[rgba(0,255,136,0.05)] last:border-0">
        <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-32"
          style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</span>
        <input
          type="text"
          value={editValue}
          onChange={e => {
            setEditValue(e.target.value)
            onChange && onChange(e.target.value)
          }}
          disabled={saving}
          className="flex-1 bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.15)] rounded px-2 py-1 text-[11px] text-[rgba(200,214,229,0.85)] outline-none focus:border-[rgba(0,255,136,0.4)] transition-colors"
        />
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 py-1 border-b border-[rgba(0,255,136,0.05)] last:border-0">
      <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-32"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</span>
      <span className={`text-[11px] font-medium text-[rgba(200,214,229,0.75)] ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </span>
    </div>
  )
}

function StatBox({ label, value, unit, color, editable, onChange, saving }) {
  const [editValue, setEditValue] = useState(value || '')

  if (editable) {
    return (
      <div className="px-3 py-2 rounded-sm text-center"
        style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
        <p className="text-[8px] uppercase tracking-wider mb-1"
          style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</p>
        <input
          type="number"
          value={editValue}
          onChange={e => {
            setEditValue(e.target.value)
            onChange && onChange(e.target.value)
          }}
          disabled={saving}
          className="w-full bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.15)] rounded px-2 py-1 text-[14px] font-mono font-bold text-center outline-none focus:border-[rgba(0,255,136,0.4)] transition-colors"
          style={{ color }}
        />
        {unit && <p className="text-[8px] mt-0.5" style={{ color: 'rgba(200,214,229,0.3)' }}>{unit}</p>}
      </div>
    )
  }

  return (
    <div className="px-3 py-2 rounded-sm text-center"
      style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <p className="text-[8px] uppercase tracking-wider mb-0.5"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</p>
      <p className="font-mono font-bold text-base leading-none"
        style={{ color, textShadow: `0 0 10px ${color}55` }}>{value}</p>
      {unit && <p className="text-[8px] mt-0.5" style={{ color: 'rgba(200,214,229,0.3)' }}>{unit}</p>}
    </div>
  )
}

function KonsosEditForm({ initial, onSave, onCancel, saving }) {
  const [value, setValue] = useState(initial || '')

  return (
    <div className="space-y-3">
      <textarea
        className="hud-input w-full resize-none text-xs leading-relaxed"
        rows={10}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Deskripsikan kondisi sosial: adat istiadat, agama dominan, mata pencaharian, tingkat pendidikan, isu sosial, hubungan lintas batas, dll."
        disabled={saving}
      />
      <p className="text-[9px]" style={{ color: 'rgba(200,214,229,0.3)' }}>
        Kosongkan untuk menghapus narasi dan kembali ke tampilan otomatis.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="hud-btn hud-btn-danger flex-1 text-[10px]"
          disabled={saving}
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => onSave(value)}
          className="hud-btn flex-1 text-[10px]"
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 border border-[#00ff88] border-t-transparent rounded-full animate-spin" />
              Menyimpan…
            </span>
          ) : 'Simpan'}
        </button>
      </div>
    </div>
  )
}

function EmptyHint({ text }) {
  return (
    <p className="text-[rgba(200,214,229,0.25)] text-xs italic tracking-wide">{text}</p>
  )
}

/// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
/// ══════════════════════════════════════════════════════════════════════════════

export function GeoDemoKonsos({ demografi, pos, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const [editingGeografi, setEditingGeografi] = useState(false)
  const [editingDemografi, setEditingDemografi] = useState(false)
  const [editingKonsos, setEditingKonsos] = useState(false)
  const [saving, setSaving] = useState(false)

  // Local edit state
  const [geoEdit, setGeoEdit] = useState({
    kabupaten: pos?.kabupaten || '',
    kecamatan: pos?.kecamatan || '',
    lokasi_desa: pos?.lokasi_desa || '',
    provinsi: pos?.provinsi || '',
    lat: pos?.lat || '',
    lng: pos?.lng || '',
    jumlah_patok: pos?.jumlah_patok || '',
  })

  const [demoEdit, setDemoEdit] = useState({
    total_penduduk: demografi?.total_penduduk || 0,
    total_kk: demografi?.total_kk || 0,
  })

  // Initialize edit state when data changes
  useState(() => {
    if (pos) {
      setGeoEdit({
        kabupaten: pos.kabupaten || '',
        kecamatan: pos.kecamatan || '',
        lokasi_desa: pos.lokasi_desa || '',
        provinsi: pos.provinsi || '',
        lat: pos.lat || '',
        lng: pos.lng || '',
        jumlah_patok: pos.jumlah_patok || '',
      })
    }
  }, [pos])

  useState(() => {
    if (demografi) {
      setDemoEdit({
        total_penduduk: demografi.total_penduduk || 0,
        total_kk: demografi.total_kk || 0,
      })
    }
  }, [demografi])

  if (loading) return <LoadingSpinner text="Memuat data..." />
  if (!demografi && !pos) return <EmptyState title="Data belum tersedia" />

  const { total_penduduk: penduduk = 0, total_kk: kk = 0 } = demografi || {}
  const hasDemoData = penduduk > 0 || kk > 0
  const rataKK = kk > 0 && penduduk > 0 ? (penduduk / kk).toFixed(1) : null

  let klasifikasiDemo = '—'
  if (penduduk > 0 && kk > 0) {
    if (penduduk < 500) klasifikasiDemo = 'Wilayah Jarang Penduduk'
    else if (penduduk < 2000) klasifikasiDemo = 'Wilayah Penduduk Sedang'
    else klasifikasiDemo = 'Wilayah Padat Penduduk'
  }

  const autoGeografi = generateGeografiAuto(pos)
  const autoKonsos = generateKonsosAuto(demografi, pos)

  // Handle geografi save
  const handleSaveGeografi = async () => {
    setSaving(true)
    try {
      // Update via demografi service - save as notes
      const geoText = `Kabupaten: ${geoEdit.kabupaten}\nKecamatan: ${geoEdit.kecamatan}\nDesa/Lokasi: ${geoEdit.lokasi_desa}\nProvinsi: ${geoEdit.provinsi}\nKoordinat: ${geoEdit.lat}, ${geoEdit.lng}\nJumlah Patok: ${geoEdit.jumlah_patok}`
      await demografiService.upsert(posId, { geografi: geoText })
      showToast('Data geografi berhasil disimpan', 'success')
      setEditingGeografi(false)
      onRefresh && onRefresh()
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // Handle demografi save
  const handleSaveDemografi = async () => {
    setSaving(true)
    try {
      await demografiService.upsert(posId, {
        total_penduduk: Number(demoEdit.total_penduduk) || 0,
        total_kk: Number(demoEdit.total_kk) || 0,
      })
      showToast('Data demografi berhasil disimpan', 'success')
      setEditingDemografi(false)
      onRefresh && onRefresh()
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // Handle konsos save
  const handleSaveKonsos = async (value) => {
    setSaving(true)
    try {
      await demografiService.upsert(posId, { konsos_notes: value.trim() || null })
      showToast('Analisis sosial berhasil disimpan', 'success')
      setEditingKonsos(false)
      onRefresh && onRefresh()
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // Get coordinate display
  const getCoordDisplay = () => {
    const lat = geoEdit.lat
    const lng = geoEdit.lng
    if (!lat && !lng) return '—'
    return `${lat}°N, ${lng}°E`
  }

  return (
    <div className="space-y-3 fade-in">

      {/* ── 1. KONDISI GEOGRAFI ─────────────────────────────────── */}
      <Section
        icon="◬"
        label="Kondisi Geografi"
        color="rgba(0,255,136,0.25)"
        glow="rgba(0,255,136,0.15)"
        headerRight={!editingGeografi && (
          <EditButton onClick={() => setEditingGeografi(true)} />
        )}
      >
        {editingGeografi ? (
          <div className="space-y-2">
            <InfoRow
              label="Kabupaten"
              value={geoEdit.kabupaten}
              editable
              saving={saving}
              onChange={v => setGeoEdit(p => ({ ...p, kabupaten: v }))}
            />
            <InfoRow
              label="Kecamatan"
              value={geoEdit.kecamatan}
              editable
              saving={saving}
              onChange={v => setGeoEdit(p => ({ ...p, kecamatan: v }))}
            />
            <InfoRow
              label="Desa / Lokasi"
              value={geoEdit.lokasi_desa}
              editable
              saving={saving}
              onChange={v => setGeoEdit(p => ({ ...p, lokasi_desa: v }))}
            />
            <InfoRow
              label="Provinsi"
              value={geoEdit.provinsi}
              editable
              saving={saving}
              onChange={v => setGeoEdit(p => ({ ...p, provinsi: v }))}
            />
            <InfoRow
              label="Koordinat"
              value={getCoordDisplay()}
              mono
            />
            <InfoRow
              label="Jumlah Patok"
              value={geoEdit.jumlah_patok || '—'}
              editable
              saving={saving}
              onChange={v => setGeoEdit(p => ({ ...p, jumlah_patok: v }))}
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingGeografi(false)}
                className="hud-btn hud-btn-danger flex-1 text-[10px]"
                disabled={saving}
              >
                Batal
              </button>
              <button
                onClick={handleSaveGeografi}
                className="hud-btn flex-1 text-[10px]"
                disabled={saving}
              >
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <InfoRow label="Kabupaten" value={pos?.kabupaten || '—'} />
            <InfoRow label="Kecamatan" value={pos?.kecamatan || '—'} />
            <InfoRow label="Desa / Lokasi" value={pos?.lokasi_desa && pos.lokasi_desa !== '—' ? pos.lokasi_desa : '—'} />
            <InfoRow label="Provinsi" value={pos?.provinsi || '—'} />
            <InfoRow
              label="Koordinat"
              value={pos?.lat && pos?.lng ? `${pos.lat}°N, ${pos.lng}°E` : '—'}
              mono
            />
            <InfoRow label="Jumlah Patok" value={pos?.jumlah_patok ? `${pos.jumlah_patok} patok` : '—'} />
          </div>
        )}
      </Section>

      {/* ── 2. KONDISI DEMOGRAFI ───────────────────────────────── */}
      <Section
        icon="◈"
        label="Kondisi Demografi"
        color="rgba(68,136,255,0.25)"
        glow="rgba(68,136,255,0.15)"
        headerRight={!editingDemografi && (
          <EditButton onClick={() => setEditingDemografi(true)} />
        )}
      >
        {editingDemografi ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatBox
                label="Total Penduduk"
                value={demoEdit.total_penduduk || 0}
                unit="jiwa"
                color="#4488ff"
                editable
                saving={saving}
                onChange={v => setDemoEdit(p => ({ ...p, total_penduduk: v }))}
              />
              <StatBox
                label="Kepala Keluarga"
                value={demoEdit.total_kk || 0}
                unit="KK"
                color="#4488ff"
                editable
                saving={saving}
                onChange={v => setDemoEdit(p => ({ ...p, total_kk: v }))}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingDemografi(false)}
                className="hud-btn hud-btn-danger flex-1 text-[10px]"
                disabled={saving}
              >
                Batal
              </button>
              <button
                onClick={handleSaveDemografi}
                className="hud-btn flex-1 text-[10px]"
                disabled={saving}
              >
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <StatBox
                label="Total Penduduk"
                value={penduduk > 0 ? penduduk.toLocaleString('id-ID') : '—'}
                unit="jiwa"
                color="#4488ff"
              />
              <StatBox
                label="Kepala Keluarga"
                value={kk > 0 ? kk.toLocaleString('id-ID') : '—'}
                unit="KK"
                color="#4488ff"
              />
            </div>
            {rataKK && (
              <div className="pt-1 border-t border-[rgba(68,136,255,0.08)]">
                <InfoRow label="Rata-rata Jiwa/KK" value={`${rataKK} jiwa`} />
              </div>
            )}
            {hasDemoData && (
              <InfoRow label="Klasifikasi" value={klasifikasiDemo} />
            )}
            {!hasDemoData && (
              <EmptyHint text="Data demografi belum tersedia. Klik Edit untuk menambahkan data." />
            )}
          </div>
        )}
      </Section>

      {/* ── 3. KONDISI SOSIAL (KONSOS) ─────────────────────────── */}
      <Section
        icon="◉"
        label="Kondisi Sosial (Konsos)"
        color="rgba(187,136,255,0.25)"
        glow="rgba(187,136,255,0.15)"
        headerRight={!editingKonsos && (
          <EditButton onClick={() => setEditingKonsos(true)} />
        )}
      >
        {editingKonsos ? (
          <KonsosEditForm
            initial={demografi?.konsos_notes || ''}
            onSave={handleSaveKonsos}
            onCancel={() => setEditingKonsos(false)}
            saving={saving}
          />
        ) : demografi?.konsos_notes ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.konsos_notes}
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
              {autoKonsos}
            </p>
          </div>
        )}
      </Section>

    </div>
  )
}
