import { useParams, useNavigate } from 'react-router-dom'
import { usePos, useDemografi, useTokoh, useBinter, useKerawanan, usePatroli } from '../../hooks/useGasApi'
import { hitungKerawananPos } from '../../constants/kerawananCategories'
import { formatDate, formatNumber } from '../../utils/formatDate'
import { exportToPDF } from '../../utils/exportPDF'
import { APP_CONFIG } from '../../constants/config'

export default function LaporanPosPage() {
  const { posId } = useParams()
  const navigate  = useNavigate()

  const { data: posList }         = usePos()
  const { data: demografi }       = useDemografi(posId)
  const { data: tokohList }       = useTokoh(posId)
  const { data: binterList }      = useBinter(posId)
  const { data: kerawananList }   = useKerawanan(posId)
  const { data: patroliList }     = usePatroli(posId)

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

  return (
    <>
      {/* ── Tombol aksi (tidak ikut print) ─── */}
      <div className="print:hidden flex items-center gap-3 px-4 py-3 border-b border-[rgba(0,255,136,0.12)]"
        style={{ background: 'rgba(4,11,6,0.9)' }}>
        <button
          onClick={() => navigate(`/pos/${posId}`)}
          className="text-[9px] text-[rgba(0,255,136,0.4)] hover:text-[rgba(0,255,136,0.7)] tracking-widest uppercase transition-colors"
        >
          ← Kembali ke Pos
        </button>
        <span className="text-[rgba(0,255,136,0.15)] text-xs flex-1" />
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

      {/* ── Konten laporan ─────────────────── */}
      <div
        id="laporan-pos"
        className="p-6 max-w-4xl mx-auto space-y-6 print:p-4 print:space-y-4"
        style={{ fontFamily: 'monospace' }}
      >
        {/* Header */}
        <div className="text-center space-y-1 border-b-2 border-[rgba(0,255,136,0.3)] pb-4 print:border-black">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[rgba(200,214,229,0.4)] print:text-gray-500">
            {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.BATALYON} · {APP_CONFIG.TAHUN_ANGGARAN}
          </p>
          <h1 className="text-xl font-bold text-[rgba(200,214,229,0.9)] print:text-black">
            LAPORAN DATA POS PAMTAS
          </h1>
          <h2 className="text-base font-bold text-[#00ff88] print:text-black">
            {pos?.nama_pos || posId}
          </h2>
          <p className="text-[10px] text-[rgba(200,214,229,0.4)] print:text-gray-500">
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
              ['Total Penduduk',   formatNumber(demografi.total_penduduk || demografi.jumlah_penduduk) || '—'],
              ['Jumlah KK',        formatNumber(demografi.total_kk || demografi.jumlah_kk) || '—'],
              ['Laki-laki',        formatNumber(demografi.total_laki || demografi.laki_laki) || '—'],
              ['Perempuan',        formatNumber(demografi.total_perempuan || demografi.perempuan) || '—'],
            ]} />
          ) : (
            <EmptyRow>Data demografi belum tersedia</EmptyRow>
          )}
        </Section>

        {/* ── 4. Tokoh Masyarakat ──────────── */}
        <Section title={`IV. TOKOH MASYARAKAT (${(tokohList || []).length} orang)`}>
          {(tokohList || []).length > 0 ? (
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-[rgba(0,255,136,0.2)] print:border-gray-400">
                  <Th>No</Th><Th>Nama</Th><Th>Jabatan</Th><Th>Pengaruh</Th><Th>Keterangan</Th>
                </tr>
              </thead>
              <tbody>
                {tokohList.map((t, i) => (
                  <tr key={t.id || i} className="border-b border-[rgba(0,255,136,0.07)] print:border-gray-200">
                    <Td>{i + 1}</Td>
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
            <StatBox label="Klasifikasi" value={level} color={level === 'SIAGA' ? '#ff3333' : level === 'WASPADA' ? '#ffaa00' : '#00ff88'} />
            <StatBox label="Skor Ancaman" value={`${totalPoin} poin`} />
            <StatBox label="Aktif" value={activeInsiden.length} color={activeInsiden.length > 0 ? '#ff3333' : '#00ff88'} />
            <StatBox label="Selesai" value={selesaiInsiden.length} />
          </div>
          {(kerawananList || []).length > 0 ? (
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-[rgba(0,255,136,0.2)] print:border-gray-400">
                  <Th>No</Th><Th>Tanggal</Th><Th>Jenis</Th><Th>Deskripsi</Th><Th>Pelaku</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {[...activeInsiden, ...selesaiInsiden].map((k, i) => (
                  <tr key={k.id || i} className="border-b border-[rgba(0,255,136,0.07)] print:border-gray-200">
                    <Td>{i + 1}</Td>
                    <Td>{formatDate(k.tanggal)}</Td>
                    <Td>{k.kategori || k.jenis || '—'}</Td>
                    <Td>{k.deskripsi || k.uraian || '—'}</Td>
                    <Td>{k.pelaku || '—'}</Td>
                    <Td>
                      <span className={k.status === 'aktif' ? 'text-[#ff3333] print:text-red-700' : 'text-[#00ff88] print:text-green-700'}>
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
              style={{ background: 'rgba(255,170,0,0.05)', border: '1px solid rgba(255,170,0,0.15)' }}>
              <span className="text-[rgba(255,170,0,0.5)] uppercase tracking-wider mr-2">Potensi Ancaman:</span>
              <span className="text-[rgba(200,214,229,0.7)]">{pos.kerawanan_utama}</span>
            </div>
          )}
        </Section>

        {/* ── 6. Kegiatan Binter ───────────── */}
        <Section title={`VI. KEGIATAN BINTER (${(binterList || []).length} kegiatan)`}>
          {binterSorted.length > 0 ? (
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-[rgba(0,255,136,0.2)] print:border-gray-400">
                  <Th>No</Th><Th>Tanggal</Th><Th>Jenis</Th><Th>Sasaran</Th><Th>Hasil</Th>
                </tr>
              </thead>
              <tbody>
                {binterSorted.slice(0, 20).map((b, i) => (
                  <tr key={b.id || i} className="border-b border-[rgba(0,255,136,0.07)] print:border-gray-200">
                    <Td>{i + 1}</Td>
                    <Td>{formatDate(b.tanggal)}</Td>
                    <Td>{b.jenis_binter || b.jenis || '—'}</Td>
                    <Td>{b.sasaran || '—'}</Td>
                    <Td>{b.hasil || b.keterangan || '—'}</Td>
                  </tr>
                ))}
                {binterSorted.length > 20 && (
                  <tr>
                    <td colSpan={5} className="px-2 py-1.5 text-[rgba(200,214,229,0.3)] italic text-center text-[9px]">
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
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-[rgba(0,255,136,0.2)] print:border-gray-400">
                  <Th>No</Th><Th>Tanggal</Th><Th>Jenis</Th><Th>Personel</Th><Th>Rute</Th><Th>Hasil</Th>
                </tr>
              </thead>
              <tbody>
                {patroliSorted.slice(0, 20).map((p, i) => (
                  <tr key={p.id || i} className="border-b border-[rgba(0,255,136,0.07)] print:border-gray-200">
                    <Td>{i + 1}</Td>
                    <Td>{formatDate(p.tanggal)}</Td>
                    <Td>{p.jenis_patroli || '—'}</Td>
                    <Td>{p.jumlah_personel ? `${p.jumlah_personel} org` : '—'}</Td>
                    <Td>{p.rute || '—'}</Td>
                    <Td>{p.hasil_patroli || '—'}</Td>
                  </tr>
                ))}
                {patroliSorted.length > 20 && (
                  <tr>
                    <td colSpan={6} className="px-2 py-1.5 text-[rgba(200,214,229,0.3)] italic text-center text-[9px]">
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
        <div className="border-t border-[rgba(0,255,136,0.15)] print:border-gray-400 pt-4 text-center">
          <p className="text-[9px] text-[rgba(200,214,229,0.25)] tracking-[0.2em] uppercase print:text-gray-400">
            {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.YONKAV} · {APP_CONFIG.WILAYAH} · {APP_CONFIG.TAHUN_ANGGARAN}
          </p>
        </div>
      </div>
    </>
  )
}

/* ── Helper components ─────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm print:text-black print:border print:border-gray-400"
        style={{ color: 'rgba(0,255,136,0.8)', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}>
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
          <tr key={label} className="border-b border-[rgba(0,255,136,0.07)] print:border-gray-200">
            <td className="px-3 py-1.5 w-40 text-[rgba(200,214,229,0.4)] uppercase tracking-wider print:text-gray-500 print:w-36">
              {label}
            </td>
            <td className="px-3 py-1.5 text-[rgba(200,214,229,0.8)] print:text-black">
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
    <th className="px-2 py-1.5 text-left text-[rgba(200,214,229,0.5)] uppercase tracking-wider font-bold print:text-gray-600">
      {children}
    </th>
  )
}

function Td({ children }) {
  return (
    <td className="px-2 py-1.5 text-[rgba(200,214,229,0.75)] align-top print:text-black">
      {children}
    </td>
  )
}

function EmptyRow({ children }) {
  return (
    <p className="text-[rgba(200,214,229,0.25)] text-[10px] italic px-3 py-2 print:text-gray-400">
      {children}
    </p>
  )
}

function StatBox({ label, value, color = '#c8d6e5' }) {
  return (
    <div className="px-3 py-2 rounded-sm flex-1 text-center print:border print:border-gray-300"
      style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)' }}>
      <p className="text-[8px] uppercase tracking-wider text-[rgba(200,214,229,0.35)] mb-0.5 print:text-gray-500">
        {label}
      </p>
      <p className="font-bold text-sm print:text-black" style={{ color }}>
        {value}
      </p>
    </div>
  )
}
