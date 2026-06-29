import { useState } from 'react'

const TABS = [
  { id: 'overview',   label: 'Overview',       icon: '◈' },
  { id: 'pos',        label: 'Data Pos',        icon: '◉' },
  { id: 'demografi',  label: 'Demografi',       icon: '◬' },
  { id: 'tokoh',      label: 'Tokoh',           icon: '◆' },
  { id: 'binter',     label: 'Binter',          icon: '◇' },
  { id: 'kerawanan',  label: 'Kerawanan',       icon: '⚠' },
  { id: 'patroli',    label: 'Patroli',         icon: '◎' },
]

export default function PanduanPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--surface-base)' }}>
    <div className="p-4 space-y-4 fade-in max-w-4xl">

      {/* Header */}
      <div>
        <h2 className="font-bold text-sm uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-primary)' }}>
          ◈ Panduan Input Data Google Sheets
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Petunjuk pengisian data untuk operator pos — data akan otomatis tampil di dashboard
        </p>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
            style={activeTab === t.id ? {
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
            } : {
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-tertiary)',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'pos'       && <PosTab />}
        {activeTab === 'demografi' && <DemografiTab />}
        {activeTab === 'tokoh'     && <TokohTab />}
        {activeTab === 'binter'    && <BinterTab />}
        {activeTab === 'kerawanan' && <KerawananTab />}
        {activeTab === 'patroli'   && <PatroliTab />}
      </div>

    </div>
    </div>
  )
}

/* ── Komponen bantu ───────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div className="hud-panel">
      <div className="hud-header">
        <span className="hud-title">{title}</span>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

function ColTable({ cols }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {['Kolom', 'Tipe', 'Contoh Isi', 'Keterangan'].map(h => (
              <th key={h} className="px-3 py-2 text-left hud-label">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cols.map((c, i) => (
            <tr key={c[0]} style={{
              borderBottom: '1px solid var(--border-subtle)',
              background: i % 2 === 0 ? 'transparent' : 'var(--surface-secondary)',
            }}>
              <td className="px-3 py-2 font-mono font-bold whitespace-nowrap" style={{ color: 'var(--accent-primary)' }}>{c[0]}</td>
              <td className="px-3 py-2">
                <span className="px-1.5 py-0.5 rounded-sm font-bold"
                  style={c[1] === 'TEXT'
                    ? { background: 'var(--color-info-subtle)', color: 'var(--color-info)', border: '1px solid var(--color-info)' }
                    : c[1] === 'NUMBER'
                    ? { background: 'var(--color-warning-subtle)', color: 'var(--color-warning)', border: '1px solid var(--color-warning)' }
                    : c[1] === 'DATE'
                    ? { background: 'var(--accent-muted)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }
                    : { background: 'var(--color-purple-subtle)', color: 'var(--color-purple)', border: '1px solid var(--color-purple)' }
                  }>{c[1]}</span>
              </td>
              <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{c[2]}</td>
              <td className="px-3 py-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{c[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AlertBox({ type, children }) {
  const styles = {
    info:    { bg: 'var(--color-info-subtle)',  border: 'var(--color-info)',  color: 'var(--color-info)', icon: 'ℹ' },
    warning: { bg: 'var(--color-warning-subtle)', border: 'var(--color-warning)', color: 'var(--color-warning)', icon: '⚠' },
    success: { bg: 'var(--accent-muted)',        border: 'var(--accent-primary)', color: 'var(--accent-primary)', icon: '✓' },
    danger:  { bg: 'var(--color-danger-subtle)', border: 'var(--color-danger)', color: 'var(--color-danger)', icon: '✕' },
  }
  const s = styles[type] || styles.info
  return (
    <div className="px-3 py-2.5 rounded-sm leading-relaxed flex gap-2"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      <span className="flex-shrink-0 font-bold">{s.icon}</span>
      <span>{children}</span>
    </div>
  )
}

function StepList({ steps }) {
  return (
    <ol className="space-y-2">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-sm flex items-center justify-center font-bold font-mono"
            style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
            {i + 1}
          </span>
          <span className="leading-relaxed pt-0.5" style={{ color: 'var(--text-secondary)' }}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

/* ── Tab Contents ─────────────────────────────────────────── */

function OverviewTab() {
  return (
    <div className="space-y-4">
      <Section title="◈ Cara Kerja Sistem">
        <p className="text-[rgba(200,214,229,0.6)] text-[10px] leading-relaxed">
          Dashboard ini terhubung langsung ke <strong className="text-[rgba(0,255,136,0.8)]">Google Sheets</strong> melalui
          Google Apps Script. Setiap data yang diinput ke Sheets akan otomatis tampil di dashboard dalam
          <strong className="text-[rgba(0,255,136,0.8)]"> 5 menit</strong> (waktu refresh cache).
        </p>

        {/* Flow diagram */}
        <div className="flex items-center gap-2 flex-wrap py-2">
          {[
            { label: 'Operator', sub: 'Input data', color: '#00ff88' },
            '→',
            { label: 'Google Sheets', sub: '6 Tab data', color: '#4ade80' },
            '→',
            { label: 'Apps Script', sub: 'API endpoint', color: '#ffd700' },
            '→',
            { label: 'Dashboard', sub: 'Tampil realtime', color: '#00bfff' },
          ].map((item, i) => (
            typeof item === 'string'
              ? <span key={i} className="text-[rgba(0,255,136,0.4)] text-lg font-bold">{item}</span>
              : (
                <div key={i} className="px-3 py-2 rounded-sm text-center"
                  style={{ background: 'rgba(0,255,136,0.04)', border: `1px solid ${item.color}30` }}>
                  <p className="text-[10px] font-bold" style={{ color: item.color }}>{item.label}</p>
                  <p className="text-[9px] text-[rgba(200,214,229,0.35)]">{item.sub}</p>
                </div>
              )
          ))}
        </div>

        <AlertBox type="success">
          Data di-cache 5 menit. Setelah input, refresh dashboard atau tunggu otomatis.
        </AlertBox>
      </Section>

      <Section title="◬ Struktur 6 Tab Google Sheets">
        <div className="grid grid-cols-2 gap-2">
          {[
            { tab: 'pos',       desc: 'Data pokok 17 pos satgas (koordinat, personel, kondisi)',  color: '#00ff88', icon: '📍' },
            { tab: 'demografi', desc: 'Data kependudukan, agama, tempat ibadah per pos',          color: '#4ade80', icon: '👥' },
            { tab: 'tokoh',     desc: 'Tokoh adat, masyarakat, agama di wilayah binaan',          color: '#ffd700', icon: '👤' },
            { tab: 'binter',    desc: 'Riwayat kegiatan pembinaan teritorial',                   color: '#00bfff', icon: '🤝' },
            { tab: 'kerawanan', desc: 'Laporan insiden dan ancaman per pos',                      color: '#ff5555', icon: '⚠' },
            { tab: 'patroli',   desc: 'Laporan kegiatan patroli — rute, personel, dan temuan',    color: '#aa88ff', icon: '🪖' },
          ].map(t => (
            <div key={t.tab} className="flex gap-2.5 p-2.5 rounded-sm"
              style={{ background: 'rgba(0,255,136,0.025)', border: `1px solid ${t.color}20` }}>
              <span className="text-base flex-shrink-0">{t.icon}</span>
              <div>
                <p className="font-mono text-[10px] font-bold" style={{ color: t.color }}>{t.tab}</p>
                <p className="text-[9px] text-[rgba(200,214,229,0.45)] leading-relaxed mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="◆ Aturan Umum Input">
        <div className="space-y-2">
          <AlertBox type="warning">
            Kolom <code className="font-mono">pos_id</code> WAJIB diisi dan harus sesuai format: <code className="font-mono">POS-1</code> s/d <code className="font-mono">POS-17</code> atau <code className="font-mono">KOTIS</code>
          </AlertBox>
          <AlertBox type="danger">
            JANGAN mengubah nama kolom header (baris pertama). Apps Script membaca berdasarkan nama kolom.
          </AlertBox>
          <AlertBox type="info">
            Tanggal diisi format: <code className="font-mono">YYYY-MM-DD</code> (contoh: 2026-03-15) agar terbaca konsisten.
          </AlertBox>
          <AlertBox type="success">
            Kolom opsional boleh dikosongkan. Dashboard akan menampilkan "—" untuk data kosong.
          </AlertBox>
        </div>
      </Section>
    </div>
  )
}

function PosTab() {
  return (
    <div className="space-y-4">
      <Section title="◉ Tab: pos — Data Pokok Pos Satgas">
        <p className="text-[rgba(200,214,229,0.5)] text-[10px] leading-relaxed">
          Tab ini berisi data master setiap pos. Diisi sekali di awal, lalu diupdate jika ada perubahan
          (rotasi komandan, penambahan personel, dsb).
        </p>
        <ColTable cols={[
          ['pos_id',          'TEXT',   'KT',                                      'Wajib. Kode pos: KT, AJ, TA, BB, BK, GSG, KD, SU, SK, TB, SL, SMB, SML, LB, GSL, ML, LMS'],
          ['nama_pos',        'TEXT',   'POS KOTIS',                               'Nama resmi pos satgas'],
          ['lokasi_desa',     'TEXT',   'Ds. Pasir Putih',                         'Desa/kelurahan lokasi pos'],
          ['kecamatan',       'TEXT',   'Kec. Nunukan Tengah',                     'Kecamatan'],
          ['kabupaten',       'TEXT',   'Kab. Nunukan',                            'Kabupaten'],
          ['provinsi',        'TEXT',   'Kalimantan Utara',                        'Provinsi'],
          ['lat',             'NUMBER', '-8.265254',                               'Latitude (desimal). Salin dari Google Maps'],
          ['lng',             'NUMBER', '112.7322575',                             'Longitude (desimal)'],
          ['komandan_pos',    'TEXT',   'Letkol Kav Dian Kriswijaya',              'Nama dan pangkat Komandan Pos. Kosongkan jika belum ada'],
          ['danssk',          'TEXT',   '—',                                       'Dansat Setingkat Kompi. Kosongkan jika belum ada data'],
          ['dpp',             'TEXT',   '—',                                       'Danpamtas Pos. Kosongkan jika belum ada data'],
          ['kuat_pers',       'NUMBER', '62',                                      'Jumlah personel di pos'],
          ['kondisi_bangunan','TEXT',   'Permanen',                                'Permanen / Semi Permanen / Darurat'],
          ['sumber_air',      'TEXT',   'PDAM',                                    'PDAM / Sumur / Sungai / Hujan'],
          ['sumber_listrik',  'TEXT',   'PLN',                                     'PLN / Genset / Solar Panel'],
          ['jaringan_gsm',    'TEXT',   'Telkomsel, Indosat',                      'Provider yang tersedia. Bisa lebih dari satu, pisahkan dengan koma'],
          ['jumlah_patok',    'NUMBER', '0',                                       'Jumlah patok perbatasan di AO pos. Isi 0 jika tidak ada'],
          ['kerawanan_utama', 'TEXT',   'TKI Ilegal, Terorisme, Penyelundupan Narkoba', 'Potensi ancaman utama. Bisa lebih dari satu, pisahkan dengan koma'],
          ['foto_satelit_url','TEXT',   '—',                                       'Link foto satelit dari Google Drive (opsional)'],
        ]} />
        <AlertBox type="info">
          Koordinat lat/lng bisa didapat dari Google Maps: klik titik lokasi pos → salin angka koordinat.
        </AlertBox>
        <AlertBox type="warning">
          Kode pos_id WAJIB sesuai daftar resmi: <code className="font-mono">KT AJ TA BB BK GSG KD SU SK TB SL SMB SML LB GSL ML LMS</code>. Salah kode → data tidak terhubung ke peta.
        </AlertBox>
      </Section>
    </div>
  )
}

function DemografiTab() {
  return (
    <div className="space-y-4">
      <Section title="◬ Tab: demografi — Data Kependudukan">
        <p className="text-[rgba(200,214,229,0.5)] text-[10px] leading-relaxed">
          Satu baris per kelurahan/desa per pos. Satu pos bisa memiliki beberapa baris
          (misal: Pos AJ mencakup Kel. Tanjung Karang dan Kel. Balansiku).
          Diisi berdasarkan data dari pemerintah desa atau hasil pendataan langsung.
        </p>
        <ColTable cols={[
          ['pos_id',          'TEXT',   'AJ',                                    'Wajib. Harus sesuai kode pos di tab pos'],
          ['nama_kelurahan',  'TEXT',   'Tanjung Karang',                        'Nama kelurahan/desa yang dicakup'],
          ['kecamatan',       'TEXT',   'Sebatik',                               'Kecamatan'],
          ['kabupaten',       'TEXT',   'Nunukan',                               'Kabupaten'],
          ['total_penduduk',  'NUMBER', '2667',                                  'Total jiwa di kelurahan tersebut (contoh: Kel. Tanjung Karang)'],
          ['total_kk',        'NUMBER', '651',                                   'Total Kepala Keluarga'],
          ['islam',           'NUMBER', '2666',                                  'Jumlah pemeluk agama Islam'],
          ['kristen',         'NUMBER', '1',                                     'Jumlah pemeluk agama Kristen'],
          ['katolik',         'NUMBER', '0',                                     'Jumlah pemeluk agama Katolik'],
          ['hindu',           'NUMBER', '0',                                     'Jumlah pemeluk agama Hindu'],
          ['buddha',          'NUMBER', '0',                                     'Jumlah pemeluk agama Buddha'],
          ['konghucu',        'NUMBER', '0',                                     'Jumlah pemeluk agama Konghucu'],
          ['lainnya',         'NUMBER', '0',                                     'Agama/kepercayaan lainnya. Tulis "—" jika tidak ada data'],
          ['masjid',          'NUMBER', '—',                                     'Jumlah masjid/mushola. Kosongkan jika belum ada data'],
          ['gereja',          'NUMBER', '—',                                     'Jumlah gereja'],
          ['pura',            'NUMBER', '—',                                     'Jumlah pura'],
          ['vihara',          'NUMBER', '—',                                     'Jumlah vihara'],
          ['geografi',        'TEXT',   'Pulau Sebatik, pegunungan rendah',      'Deskripsi kondisi geografis wilayah'],
          ['demografi_notes', 'TEXT',   'Hampir 100% Bugis 2.658',               'Catatan suku/etnis dominan dan demografi tambahan'],
          ['konsos_notes',    'TEXT',   'Berbatasan Malaysia, area perkebunan',  'Kondisi sosial, batas wilayah, potensi khusus'],
        ]} />
        <AlertBox type="info">
          Pos dengan lebih dari satu kelurahan binaan: input <strong>satu baris per kelurahan</strong> dengan pos_id yang sama.
          Contoh: Pos AJ → baris 1 (Tanjung Karang, 2667 jiwa) + baris 2 (Balansiku, 1300 jiwa).
        </AlertBox>
        <AlertBox type="warning">
          Pastikan total agama tidak melebihi total_penduduk. Dashboard akan menampilkan chart pie berdasarkan data ini.
        </AlertBox>
      </Section>
    </div>
  )
}

function TokohTab() {
  return (
    <div className="space-y-4">
      <Section title="◆ Tab: tokoh — Data Tokoh Wilayah">
        <p className="text-[rgba(200,214,229,0.5)] text-[10px] leading-relaxed">
          Satu baris per tokoh. Bisa lebih dari satu tokoh per pos. Diisi saat pendataan awal dan
          diupdate bila ada perubahan (pindah, meninggal, jabatan baru).
        </p>
        <ColTable cols={[
          ['id',        'TEXT',   '1',                             'ID unik. Nomor urut: 1, 2, 3, dst.'],
          ['pos_id',    'TEXT',   'KT',                            'Wajib. Kode pos yang membina tokoh ini'],
          ['nama',      'TEXT',   'H. Irwan Sabri, S.E',           'Nama lengkap tokoh'],
          ['kategori',  'TEXT',   'TOMAS',                         'TOMAS (Tokoh Masyarakat) / TODAT (Tokoh Adat) / TOGA (Tokoh Agama)'],
          ['jabatan',   'TEXT',   'Bupati Nunukan',                'Jabatan/peran tokoh di pemerintahan atau masyarakat'],
          ['alamat',    'TEXT',   'Jl. Ujang Dewa Selisun',        'Alamat tinggal atau kantor'],
          ['no_telp',   'TEXT',   '—',                             'Nomor HP yang bisa dihubungi. Kosongkan jika tidak ada'],
          ['catatan',   'TEXT',   'PEMDA',                         'Catatan penting: instansi, afiliasi, atau keterangan lain'],
        ]} />
        <AlertBox type="info">
          Contoh baris ke-2 (data nyata): <code className="font-mono">2 | KT | Hermanus | TOMAS | Wakil Bupati | Jl. Ujang Dewa Selisun | — | PEMDA</code>
        </AlertBox>
        <StepList steps={[
          'Buka tab tokoh di Google Sheets',
          'Tambah baris baru di bawah data terakhir',
          'Isi id dengan nomor urut lanjutan (1, 2, 3, ...)',
          'Isi pos_id sesuai kode pos yang melaporkan (contoh: KT, AJ, TA)',
          'Isi kategori: TOMAS / TODAT / TOGA sesuai peran tokoh',
          'Isi data tokoh lengkap — no_telp dan catatan boleh dikosongkan',
          'Simpan — data otomatis tampil di tab Tokoh pada halaman detail pos',
        ]} />
      </Section>
    </div>
  )
}

function BinterTab() {
  return (
    <div className="space-y-4">
      <Section title="◇ Tab: binter — Kegiatan Pembinaan Teritorial">
        <p className="text-[rgba(200,214,229,0.5)] text-[10px] leading-relaxed">
          Setiap kegiatan binter diinput satu baris. Diisi segera setelah kegiatan selesai dilaksanakan.
        </p>
        <ColTable cols={[
          ['id',             'TEXT',   'BIN-001',                                         'ID unik. Format: BIN-001, BIN-002, dst.'],
          ['pos_id',         'TEXT',   'AJ',                                              'Wajib. Kode pos pelaksana kegiatan'],
          ['tanggal',        'DATE',   '2026-06-15',                                      'Tanggal kegiatan (format YYYY-MM-DD)'],
          ['jenis_kegiatan', 'TEXT',   'Pengobatan Gratis',                               'Pilih dari daftar jenis kegiatan di bawah'],
          ['lokasi',         'TEXT',   'Balai Desa Aji Kuning, Kec. Sebatik Barat',       'Lokasi pelaksanaan kegiatan'],
          ['sasaran',        'TEXT',   'Warga Desa Aji Kuning dan sekitarnya',            'Sasaran/peserta kegiatan'],
          ['jumlah_peserta', 'NUMBER', '87',                                              'Jumlah peserta yang hadir'],
          ['keterangan',     'TEXT',   'Bekerjasama dengan Puskesmas Kec. Sebatik Barat, 6 personel Pos AJ, pelayanan kesehatan umum dan pembagian obat gratis', 'Keterangan tambahan'],
          ['foto_url',       'TEXT',   '—',                                               'Link foto dari Google Drive (opsional)'],
        ]} />

        <div className="space-y-2">
          <p className="hud-label">Jenis Kegiatan yang Valid:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Bakti Sosial','Penyuluhan Kesehatan','Penyuluhan Pertanian',
              'Penyuluhan Hukum','Pembangunan Fisik','Olahraga Bersama',
              'Silaturahmi Tokoh','Patroli Bersama','Pengobatan Gratis',
              'Pembagian Sembako','Kegiatan Keagamaan','Lainnya',
            ].map(j => (
              <span key={j} className="px-2 py-0.5 rounded-sm text-[9px] font-medium"
                style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', color: 'rgba(0,191,255,0.75)' }}>
                {j}
              </span>
            ))}
          </div>
        </div>

        <AlertBox type="info">
          Untuk foto: upload ke Google Drive → klik kanan → "Dapatkan link" → pastikan akses "Siapa saja yang punya link" → salin URL ke kolom foto_url.
        </AlertBox>
      </Section>
    </div>
  )
}

function KerawananTab() {
  return (
    <div className="space-y-4">
      <Section title="⚠ Tab: kerawanan — Laporan Insiden & Ancaman">
        <p className="text-[rgba(200,214,229,0.5)] text-[10px] leading-relaxed">
          Setiap insiden atau temuan ancaman diinput satu baris. Status diupdate saat penanganan selesai.
          Data ini akan tampil sebagai marker merah di peta.
        </p>
        <ColTable cols={[
          ['id',           'TEXT',   'KRW-001',                                       'ID unik. Format: KRW-001, KRW-002, dst.'],
          ['pos_id',       'TEXT',   'KT',                                            'Wajib. Kode pos yang melaporkan'],
          ['tanggal',      'DATE',   '—',                                             'Tanggal kejadian (format YYYY-MM-DD). Kosongkan jika tidak diketahui persis'],
          ['kategori',     'TEXT',   'Trafficking',                                   'Kategori insiden (lihat daftar di bawah)'],
          ['deskripsi',    'TEXT',   'Pulau Nunukan merupakan daerah transit TKI ke Malaysia, sangat rawan perdagangan manusia (Human Trafficking) dan imigran gelap. Berfungsi sebagai pintu gerbang PJTKI Kab. Nunukan', 'Uraian lengkap kejadian / kondisi kerawanan'],
          ['status',       'TEXT',   'aktif',                                         'aktif = belum selesai / selesai = sudah ditangani'],
          ['lat',          'NUMBER', '—',                                             'Koordinat TKP (opsional, untuk marker di peta)'],
          ['lng',          'NUMBER', '—',                                             'Koordinat TKP (opsional)'],
          ['pelaku',       'TEXT',   'Jaringan PJTKI ilegal',                         'Identitas / kelompok pelaku jika diketahui'],
          ['tindak_lanjut','TEXT',   'Pengawasan ketat di pelabuhan dan jalur penyeberangan', 'Tindak lanjut yang sudah atau sedang dilakukan'],
          ['foto_url',     'TEXT',   '—',                                             'Link foto barang bukti dari Google Drive (opsional)'],
        ]} />
        <AlertBox type="info">
          Contoh baris ke-2 (data nyata): <code className="font-mono">KRW-002 | KT | — | PMI NP | Pulau Nunukan menjadi tempat transit dan proses TKI yang akan bekerja ke Malaysia, sebagian melalui jalur non-prosedural | aktif | — | — | Calo TKI | Koordinasi dengan BP2MI dan imigrasi | —</code>
        </AlertBox>

        <div className="space-y-2">
          <p className="hud-label">Kategori Kerawanan yang Valid (7 Kategori):</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Narkoba',     color: '#ff3333', desc: 'Peredaran/penggunaan narkoba' },
              { label: 'Kriminal',    color: '#ff6600', desc: 'Kejahatan umum warga sekitar' },
              { label: 'Logging',     color: '#22c55e', desc: 'Penebangan liar / illegal logging' },
              { label: 'Trading',     color: '#eab308', desc: 'Penyelundupan, perdagangan ilegal, ketergantungan ekonomi' },
              { label: 'Trafficking', color: '#ec4899', desc: 'Perdagangan orang / human trafficking' },
              { label: 'Border',      color: '#3b82f6', desc: 'Patok batas hilang / rusak SAJA' },
              { label: 'PMI NP',      color: '#8b5cf6', desc: 'PMI non-prosedural / imigran gelap' },
            ].map(k => (
              <div key={k.label} className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
                style={{ background: `${k.color}10`, border: `1px solid ${k.color}35` }}>
                <span className="text-[9px] font-bold" style={{ color: k.color }}>{k.label}</span>
                <span className="text-[8px]" style={{ color: 'rgba(200,214,229,0.35)' }}>— {k.desc}</span>
              </div>
            ))}
          </div>
          <AlertBox type="warning">
            Gunakan nama kategori <strong>persis seperti di atas</strong> (huruf besar/kecil harus sama).
            Nama lama (Ilegal Logging, Human Trafficking, dll) masih terbaca tapi sebaiknya gunakan nama baru.
          </AlertBox>
        </div>

        <AlertBox type="danger">
          Status WAJIB diisi: <code className="font-mono">aktif</code> atau <code className="font-mono">selesai</code> (huruf kecil).
          Status aktif akan memunculkan indikator merah di marker pos dan sidebar.
        </AlertBox>

        <div className="hud-panel" style={{ background: 'rgba(220,38,38,0.04)', borderColor: 'rgba(220,38,38,0.15)' }}>
          <div className="hud-header" style={{ borderColor: 'rgba(220,38,38,0.15)' }}>
            <span className="hud-title text-[rgba(255,100,100,0.8)]">SOP Pelaporan Kerawanan</span>
          </div>
          <div className="p-3">
            <StepList steps={[
              'Kejadian/temuan diterima oleh Komandan Pos',
              'Danpos memerintahkan operator untuk input ke tab kerawanan',
              'Isi semua kolom wajib, koordinat TKP diisi jika memungkinkan',
              'Status = aktif saat pertama input',
              'Danpos melakukan penanganan dan koordinasi',
              'Setelah selesai ditangani, update status menjadi selesai dan isi tindak_lanjut',
              'Dashboard akan otomatis update dalam 5 menit',
            ]} />
          </div>
        </div>
      </Section>
    </div>
  )
}

function PatroliTab() {
  return (
    <div className="space-y-4">
      <Section title="◎ Tab: patroli — Laporan Kegiatan Patroli">
        <p className="text-[rgba(200,214,229,0.5)] text-[10px] leading-relaxed">
          Setiap pelaksanaan patroli diinput satu baris. Diisi segera setelah patroli selesai dan kembali ke pos.
          Data ini digunakan untuk evaluasi intensitas pengamanan wilayah perbatasan.
        </p>
        <ColTable cols={[
          ['id',             'TEXT',   'PAT-001',                                         'ID unik. Format: PAT-001, PAT-002, dst.'],
          ['pos_id',         'TEXT',   'TA',                                              'Wajib. Kode pos pelaksana patroli'],
          ['tanggal',        'DATE',   '2026-06-18',                                      'Tanggal pelaksanaan patroli (format YYYY-MM-DD)'],
          ['jenis_patroli',  'TEXT',   'Patroli Patok',                                   'Jenis patroli (lihat daftar di bawah)'],
          ['rute',           'TEXT',   'Pos TA → Patok C.112 → Patok C.113 → Kembali Pos','Rute/jalur yang ditempuh'],
          ['jumlah_personel','NUMBER', '6',                                               'Jumlah personel yang ikut patroli'],
          ['hasil_patroli',  'TEXT',   'Patok C.112 kondisi baik, C.113 cat memudar perlu peremajaan', 'Temuan/hasil selama patroli. Isi "Nihil, kondisi aman" jika tidak ada temuan'],
          ['catatan',        'TEXT',   'Cuaca cerah, tidak ada aktivitas mencurigakan sepanjang rute', 'Catatan tambahan (opsional)'],
          ['foto_url',       'TEXT',   '—',                                               'Link foto dokumentasi dari Google Drive (opsional)'],
        ]} />

        <div className="space-y-2">
          <p className="hud-label">Jenis Patroli yang Valid:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Patroli Patok',    desc: 'Pengecekan kondisi patok batas RI-MAL' },
              { label: 'Patroli Rutin',    desc: 'Patroli harian wilayah AO' },
              { label: 'Patroli Malam',    desc: 'Patroli malam hari' },
              { label: 'Patroli Bersama',  desc: 'Bersama aparat lain (Polri, BNPP)' },
              { label: 'Patroli Sungai',   desc: 'Patroli menggunakan jalur sungai' },
              { label: 'Patroli Udara',    desc: 'Pengamatan dari ketinggian / drone' },
              { label: 'Lainnya',          desc: 'Patroli di luar kategori di atas' },
            ].map(j => (
              <div key={j.label} className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
                style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.18)' }}>
                <span className="text-[9px] font-bold" style={{ color: 'rgba(0,255,136,0.8)' }}>{j.label}</span>
                <span className="text-[8px]" style={{ color: 'rgba(200,214,229,0.35)' }}>— {j.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hud-panel" style={{ background: 'rgba(0,255,136,0.02)', borderColor: 'rgba(0,255,136,0.12)' }}>
          <div className="hud-header">
            <span className="hud-title">SOP Input Laporan Patroli</span>
          </div>
          <div className="p-3">
            <StepList steps={[
              'Patroli selesai, seluruh personel kembali ke pos',
              'Danpos atau operator buka tab patroli di Google Sheets',
              'Tambah baris baru, isi id lanjut dari nomor terakhir (PAT-XXX)',
              'Isi pos_id dengan kode pos pelaksana (contoh: TA, BB, BK)',
              'Isi tanggal, jenis patroli, rute yang ditempuh, dan jumlah personel',
              'Isi hasil_patroli dengan temuan penting (kondisi patok, aktivitas mencurigakan, dll)',
              'Jika tidak ada temuan, tulis: Nihil, kondisi aman',
              'Upload foto ke Google Drive jika ada, salin link ke kolom foto_url',
              'Simpan — data tampil di dashboard dalam 5 menit',
            ]} />
          </div>
        </div>

        <AlertBox type="info">
          Kolom <code className="font-mono">hasil_patroli</code> wajib diisi meski tidak ada temuan — tulis <code className="font-mono">Nihil, kondisi aman</code> agar laporan tetap tercatat lengkap.
        </AlertBox>
      </Section>
    </div>
  )
}
