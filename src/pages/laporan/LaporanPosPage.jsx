import { useParams, useNavigate } from 'react-router-dom'
import { usePos, useDemografi, useTokoh, useBinter, useKerawanan, usePatroli } from '../../hooks/useSupabase'
import { hitungKerawananPos } from '../../constants/kerawananCategories'
import { formatDate, formatNumber } from '../../utils/formatDate'
import { aggregateDemografi } from '../../utils/demografi'
import { exportToPDF } from '../../utils/exportPDF'
import { APP_CONFIG } from '../../constants/config'
import { LoadingSpinner } from '../../components/ui'

export default function LaporanPosPage() {
  const { posId } = useParams()
  const navigate  = useNavigate()

  const { data: posList }         = usePos()
  const { data: demografiRaw }    = useDemografi(posId)
  const { data: tokohList }       = useTokoh(posId)
  const { data: binterList }      = useBinter(posId)
  const { data: kerawananList }   = useKerawanan(posId)
  const { data: patroliList }     = usePatroli(posId)

  const demografi = aggregateDemografi(demografiRaw)

  const pos = (posList || []).find(p => p.pos_id === posId)
  const { totalPoin, level } = hitungKerawananPos(kerawananList)
  const activeInsiden = (kerawananList || []).filter(k => k.status === 'aktif')
  const selesaiInsiden = (kerawananList || []).filter(k => k.status === 'selesai')
  const patroliSorted = [...(patroliList || [])].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  const binterSorted  = [...(binterList  || [])].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const handlePrint = () => {
    exportToPDF(`Laporan Pos ${pos?.nama_pos || posId} — ${APP_CONFIG.SATGAS_NAME}`)
  }

  // Loading state
  if (!posList) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--surface-base)' }}>
        <LoadingSpinner text="Memuat laporan pos..." />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Tombol aksi (tidak ikut print) ─── */}
      <div className="print:hidden flex-shrink-0 flex items-center gap-3 px-4 py-3"
        style={{ background: 'var(--surface-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => navigate(`/pos/${posId}`)}
          className="text-[9px] uppercase tracking-widest transition-all"
          style={{ color: 'var(--accent-primary)' }}
        >
          ← Kembali ke Pos
        </button>
        <span className="text-xs flex-1" style={{ color: 'var(--border-subtle)' }} />
        <button
          onClick={handlePrint}
          className="hud-btn flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak / Simpan PDF
        </button>
      </div>

      {/* ── Konten laporan (scrollable) ─── */}
      <div className="flex-1 overflow-y-auto">
        <div
          id="laporan-pos"
          className="p-6 max-w-4xl mx-auto space-y-6 print:p-4 print:space-y-4"
        style={{ fontFamily: 'monospace', background: 'var(--surface-base)', color: 'var(--text-primary)' }}
      >
        {/* Header */}
        <div className="text-center space-y-1 pb-4" style={{ borderBottom: '2px solid var(--accent-muted)' }}>
          <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
            {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.BATALYON} · {APP_CONFIG.TAHUN_ANGGARAN}
          </p>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            LAPORAN DATA POS PAMTAS
          </h1>
          <h2 className="text-base font-bold" style={{ color: 'var(--accent-primary)' }}>
            {pos?.nama_pos || posId}
          </h2>
          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            Dicetak: {today}
          </p>
        </div>

        {/* ── 1. Identitas Pos ─────────────── */}
        <Section title="I. IDENTITAS POS">
          <TwoColTable rows={[
            ['ID Pos',            pos?.pos_id || '—'],
            ['Nama Pos',          pos?.nama_pos || '—'],
            ['Lokasi Desa',       pos?.lokasi_desa || '—'],
            ['Kecamatan',         pos?.kecamatan || '—'],
            ['Kabupaten',         pos?.kabupaten || '—'],
            ['Provinsi',          pos?.provinsi || '—'],
            ['Koordinat',         pos?.lat && pos?.lng ? `${pos.lat}°N, ${pos.lng}°E` : '—'],
            ['Jumlah Patok',      pos?.jumlah_patok ? `${pos.jumlah_patok} patok` : '—'],
          ]} />
        </Section>

        {/* ── 2. Komandan & Personel ───────── */}
        <Section title="II. KOMANDAN &amp; PERSONEL">
          <TwoColTable rows={[
            ['Komandan Pos',      pos?.komandan_pos || '—'],
            ['Danssk',            pos?.danssk || '—'],
            ['DPP',               pos?.dpp || '—'],
            ['Kekuatan Personel', pos?.jumlah_personel ? `${pos.jumlah_personel} orang` : '—'],
            ['Kondisi Bangunan',  pos?.kondisi_bangunan || '—'],
            ['Sumber Air',        pos?.sumber_air || '—'],
            ['Sumber Listrik',    pos?.sumber_listrik || '—'],
            ['Jaringan GSM',      pos?.jaringan_gsm || '—'],
          ]} />
        </Section>

        {/* ── 3. Demografi ─────────────────── */}
        <Section title="III. DATA DEMOGRAFI WILAYAH">
          {demografi ? (
            <TwoColTable rows={[
              ['Total Penduduk',   formatNumber(demografi.total_penduduk) || '—'],
              ['Jumlah KK',        formatNumber(demografi.total_kk) || '—'],
              ['Rata-rata Jiwa/KK', demografi.total_kk > 0
                ? (demografi.total_penduduk / demografi.total_kk).toFixed(1)
                : '—'],
            ]} />
          ) : (
            <EmptyRow>Data demografi belum tersedia</EmptyRow>
          )}
        </Section>

        {/* ── 4. Tokoh Masyarakat ──────────── */}
        <Section title={`IV. TOKOH MASYARAKAT (${(tokohList || []).length} orang)`}>
          {(tokohList || []).length > 0 ? (
            <table className="w-full text-[10px] border-collapse" aria-label="Daftar Tokoh Masyarakat">
              <thead>
                <tr>
                  <Th scope="col">No</Th>
                  <Th scope="col">Nama</Th>
                  <Th scope="col">Jabatan</Th>
                  <Th scope="col">Pengaruh</Th>
                  <Th scope="col">Keterangan</Th>
                </tr>
              </thead>
              <tbody>
                {tokohList.map((t, i) => (
                  <tr key={t.id || i}>
                    <Td scope="row">{i + 1}</Td>
                    <Td>{t.nama}</Td>
                    <Td>{t.jabatan || '—'}</Td>
                    <Td>{t.pengaruh || '—'}</Td>
                    <Td>{t.keterangan || '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyRow>Belum ada data tokoh</EmptyRow>
          )}
        </Section>

        {/* ── 5. Data Insiden ──────────────── */}
        <Section title={`V. DATA INSIDEN (${(kerawananList || []).length} total)`}>
          <div className="flex gap-4 mb-3 text-[10px]">
            <StatBox
              label="Klasifikasi"
              value={level}
              color={level === 'SIAGA' ? 'var(--color-danger)' : level === 'WASPADA' ? 'var(--color-warning)' : 'var(--accent-primary)'}
            />
            <StatBox label="Skor Ancaman" value={`${totalPoin} poin`} />
            <StatBox label="Aktif" value={activeInsiden.length} color={activeInsiden.length > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'} />
            <StatBox label="Selesai" value={selesaiInsiden.length} />
          </div>
          {(kerawananList || []).length > 0 ? (
            <table className="w-full text-[10px] border-collapse" aria-label="Daftar Insiden">
              <thead>
                <tr>
                  <Th scope="col">No</Th>
                  <Th scope="col">Tanggal</Th>
                  <Th scope="col">Jenis</Th>
                  <Th scope="col">Deskripsi</Th>
                  <Th scope="col">Pelaku</Th>
                  <Th scope="col">Status</Th>
                </tr>
              </thead>
              <tbody>
                {[...activeInsiden, ...selesaiInsiden].map((k, i) => (
                  <tr key={k.id || i}>
                    <Td scope="row">{i + 1}</Td>
                    <Td>{formatDate(k.tanggal)}</Td>
                    <Td>{k.kategori || k.jenis || '—'}</Td>
                    <Td>{k.deskripsi || k.uraian || '—'}</Td>
                    <Td>{k.pelaku || '—'}</Td>
                    <Td>
                      <span style={{ color: k.status === 'aktif' ? 'var(--color-danger)' : 'var(--accent-primary)' }}>
                        {k.status?.toUpperCase() || '—'}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyRow>Tidak ada data insiden</EmptyRow>
          )}
          {pos?.kerawanan_utama && (
            <div className="mt-3 p-2 rounded-sm text-[10px]"
              style={{ background: 'var(--color-warning-subtle)', border: '1px solid var(--color-warning-subtle)' }}>
              <span className="uppercase tracking-wider mr-2" style={{ color: 'var(--color-warning)' }}>Potensi Ancaman:</span>
              <span style={{ color: 'var(--text-secondary)' }}>{pos.kerawanan_utama}</span>
            </div>
          )}
        </Section>

        {/* ── 6. Kegiatan Binter ───────────── */}
        <Section title={`VI. KEGIATAN BINTER (${(binterList || []).length} kegiatan)`}>
          {binterSorted.length > 0 ? (
            <table className="w-full text-[10px] border-collapse" aria-label="Daftar Kegiatan Binter">
              <thead>
                <tr>
                  <Th scope="col">No</Th>
                  <Th scope="col">Tanggal</Th>
                  <Th scope="col">Jenis</Th>
                  <Th scope="col">Sasaran</Th>
                  <Th scope="col">Hasil</Th>
                </tr>
              </thead>
              <tbody>
                {binterSorted.slice(0, 20).map((b, i) => (
                  <tr key={b.id || i}>
                    <Td scope="row">{i + 1}</Td>
                    <Td>{formatDate(b.tanggal)}</Td>
                    <Td>{b.jenis_binter || b.jenis || '—'}</Td>
                    <Td>{b.sasaran || '—'}</Td>
                    <Td>{b.hasil || b.keterangan || '—'}</Td>
                  </tr>
                ))}
                {binterSorted.length > 20 && (
                  <tr>
                    <td colSpan={5} className="px-2 py-1.5 italic text-center text-[9px]"
                      style={{ color: 'var(--text-tertiary)' }}>
                      … dan {binterSorted.length - 20} kegiatan lainnya
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <EmptyRow>Belum ada data kegiatan binter</EmptyRow>
          )}
        </Section>

        {/* ── 7. Laporan Patroli ───────────── */}
        <Section title={`VII. LAPORAN PATROLI (${(patroliList || []).length} laporan)`}>
          {patroliSorted.length > 0 ? (
            <table className="w-full text-[10px] border-collapse" aria-label="Daftar Laporan Patroli">
              <thead>
                <tr>
                  <Th scope="col">No</Th>
                  <Th scope="col">Tanggal</Th>
                  <Th scope="col">Jenis</Th>
                  <Th scope="col">Personel</Th>
                  <Th scope="col">Rute</Th>
                  <Th scope="col">Hasil</Th>
                </tr>
              </thead>
              <tbody>
                {patroliSorted.slice(0, 20).map((p, i) => (
                  <tr key={p.id || i}>
                    <Td scope="row">{i + 1}</Td>
                    <Td>{formatDate(p.tanggal)}</Td>
                    <Td>{p.jenis_patroli || '—'}</Td>
                    <Td>{p.jumlah_personel ? `${p.jumlah_personel} org` : '—'}</Td>
                    <Td>{p.rute || '—'}</Td>
                    <Td>{p.hasil_patroli || '—'}</Td>
                  </tr>
                ))}
                {patroliSorted.length > 20 && (
                  <tr>
                    <td colSpan={6} className="px-2 py-1.5 italic text-center text-[9px]"
                      style={{ color: 'var(--text-tertiary)' }}>
                      … dan {patroliSorted.length - 20} laporan lainnya
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <EmptyRow>Belum ada laporan patroli</EmptyRow>
          )}
        </Section>

        {/* Footer */}
        <div className="pt-4 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
            {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.YONKAV} · {APP_CONFIG.WILAYAH} · {APP_CONFIG.TAHUN_ANGGARAN}
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}

/* ── Helper components ─────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm"
        style={{ color: 'var(--accent-primary)', background: 'var(--accent-muted)', border: '1px solid var(--border-subtle)' }}>
        {title}
      </h3>
      <div>{children}</div>
    </div>
  )
}

function TwoColTable({ rows }) {
  return (
    <table className="w-full text-[10px] border-collapse">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td className="px-3 py-1.5 w-40 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              {label}
            </td>
            <td className="px-3 py-1.5" style={{ color: 'var(--text-secondary)' }}>
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Th({ children }) {
  return (
    <th className="px-2 py-1.5 text-left uppercase tracking-wider font-bold"
      style={{ color: 'var(--text-tertiary)' }}>
      {children}
    </th>
  )
}

function Td({ children }) {
  return (
    <td className="px-2 py-1.5 align-top" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </td>
  )
}

function EmptyRow({ children }) {
  return (
    <p className="text-[10px] italic px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
      {children}
    </p>
  )
}

function StatBox({ label, value, color = 'var(--text-secondary)' }) {
  return (
    <div className="px-3 py-2 rounded-sm flex-1 text-center"
      style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}>
      <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p className="font-bold text-sm" style={{ color }}>
        {value}
      </p>
    </div>
  )
}
