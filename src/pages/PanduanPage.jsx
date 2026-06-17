import { useState } from 'react'

const GAS_SHEET_URL = 'https://docs.google.com/spreadsheets'

const TABS = [
  { id: 'overview',   label: 'Overview',       icon: '◈' },
  { id: 'pos',        label: 'Data Pos',        icon: '◉' },
  { id: 'demografi',  label: 'Demografi',       icon: '◬' },
  { id: 'tokoh',      label: 'Tokoh',           icon: '◆' },
  { id: 'binter',     label: 'Binter',          icon: '◇' },
  { id: 'kerawanan',  label: 'Kerawanan',       icon: '⚠' },
]

export default function PanduanPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="p-4 space-y-4 fade-in max-w-4xl">

      {/* Header */}
      <div>
        <h2 className="text-[rgba(200,214,229,0.85)] font-bold text-sm uppercase tracking-widest mb-1">
          ◈ Panduan Input Data Google Sheets
        </h2>
        <p className="text-[rgba(200,214,229,0.3)] text-[10px]">
          Petunjuk pengisian data untuk operator pos — data akan otomatis tampil di dashboard
        </p>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all"
            style={activeTab === t.id ? {
              background: 'rgba(0,255,136,0.12)',
              border: '1px solid rgba(0,255,136,0.4)',
              color: '#00ff88',
            } : {
              background: 'rgba(0,255,136,0.03)',
              border: '1px solid rgba(0,255,136,0.1)',
              color: 'rgba(200,214,229,0.4)',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'pos'       && <PosTab />}
        {activeTab === 'demografi' && <DemografiTab />}
        {activeTab === 'tokoh'     && <TokohTab />}
        {activeTab === 'binter'    && <BinterTab />}
        {activeTab === 'kerawanan' && <KerawananTab />}
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
      <table className="w-full text-[10px]">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,255,136,0.12)' }}>
            {['Kolom', 'Tipe', 'Contoh Isi', 'Keterangan'].map(h => (
              <th key={h} className="px-3 py-2 text-left hud-label">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cols.map((c, i) => (
            <tr key={c[0]} style={{
              borderBottom: '1px solid rgba(0,255,136,0.05)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(0,255,136,0.015)',
            }}>
              <td className="px-3 py-2 font-mono text-[rgba(0,255,136,0.8)] font-bold whitespace-nowrap">{c[0]}</td>
              <td className="px-3 py-2">
                <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold"
                  style={c[1] === 'TEXT'
                    ? { background: 'rgba(0,120,255,0.12)', color: 'rgba(100,180,255,0.8)', border: '1px solid rgba(0,120,255,0.2)' }
                    : c[1] === 'NUMBER'
                    ? { background: 'rgba(255,170,0,0.1)', color: 'rgba(255,200,80,0.8)', border: '1px solid rgba(255,170,0,0.2)' }
                    : c[1] === 'DATE'
                    ? { background: 'rgba(0,255,136,0.08)', color: 'rgba(0,255,136,0.7)', border: '1px solid rgba(0,255,136,0.2)' }
                    : { background: 'rgba(200,100,255,0.1)', color: 'rgba(200,150,255,0.8)', border: '1px solid rgba(200,100,255,0.2)' }
                  }>{c[1]}</span>
              </td>
              <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.6)]">{c[2]}</td>
              <td className="px-3 py-2 text-[rgba(200,214,229,0.45)] leading-relaxed">{c[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AlertBox({ type, children }) {
  const styles = {
    info:    { bg: 'rgba(0,120,255,0.06)',  border: 'rgba(0,120,255,0.25)',  color: 'rgba(100,180,255,0.9)', icon: 'ℹ' },
    warning: { bg: 'rgba(255,170,0,0.06)',  border: 'rgba(255,170,0,0.25)',  color: 'rgba(255,200,80,0.9)',  icon: '⚠' },
    success: { bg: 'rgba(0,255,136,0.05)',  border: 'rgba(0,255,136,0.2)',   color: 'rgba(0,255,136,0.85)',  icon: '✓' },
    danger:  { bg: 'rgba(220,38,38,0.06)',  border: 'rgba(220,38,38,0.25)',  color: 'rgba(255,100,100,0.9)', icon: '✕' },
  }
  const s = styles[type] || styles.info
  return (
    <div className="px-3 py-2.5 rounded-sm text-[10px] leading-relaxed flex gap-2"
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
        <li key={i} className="flex gap-3 text-[10px]">
          <span className="flex-shrink-0 w-5 h-5 rounded-sm flex items-center justify-center font-bold font-mono text-[9px]"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88' }}>
            {i + 1}
          </span>
          <span className="text-[rgba(200,214,229,0.65)] leading-relaxed pt-0.5">{s}</span>
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
            { tab: 'pos',       desc: 'Data pokok 18 pos satgas (koordinat, personel, kondisi)',  color: '#00ff88', icon: '📍' },
            { tab: 'demografi', desc: 'Data kependudukan, agama, tempat ibadah per pos',          color: '#4ade80', icon: '👥' },
            { tab: 'tokoh',     desc: 'Tokoh adat, masyarakat, agama di wilayah binaan',          color: '#ffd700', icon: '👤' },
            { tab: 'binter',    desc: 'Riwayat kegiatan pembinaan teritorial',                   color: '#00bfff', icon: '🤝' },
            { tab: 'kerawanan', desc: 'Laporan insiden dan ancaman per pos',                      color: '#ff5555', icon: '⚠' },
            { tab: 'summary',   desc: 'Agregat otomatis — JANGAN diedit manual',                  color: '#888',    icon: '📊' },
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
          ['pos_id',          'TEXT',   'POS-1',           'Wajib. Format: POS-1 s/d POS-17 atau KOTIS'],
          ['nama_pos',        'TEXT',   'Pos Pulau Sebatik','Nama resmi pos'],
          ['lokasi_desa',     'TEXT',   'Ds. Aji Kuning',  'Desa/kelurahan lokasi pos'],
          ['kecamatan',       'TEXT',   'Sebatik Barat',   'Kecamatan'],
          ['kabupaten',       'TEXT',   'Kab. Nunukan',    'Kabupaten'],
          ['provinsi',        'TEXT',   'Kalimantan Utara','Provinsi'],
          ['lat',             'NUMBER', '4.1234',          'Latitude (desimal, 4 angka di belakang koma)'],
          ['lng',             'NUMBER', '117.8765',        'Longitude (desimal)'],
          ['komandan_pos',    'TEXT',   'Lettu Kav Budi S','Nama dan pangkat Komandan Pos'],
          ['danssk',          'TEXT',   'Kapten Kav Andi', 'Dansat Setingkat Kompi'],
          ['dpp',             'TEXT',   'Kolonel Kav ...',  'Danpamtas Pos'],
          ['kuat_pers',       'NUMBER', '22',              'Jumlah personel di pos'],
          ['kondisi_bangunan','TEXT',   'Baik',            'Baik / Sedang / Rusak Ringan / Rusak Berat'],
          ['sumber_air',      'TEXT',   'PDAM',            'PDAM / Sumur / Sungai / Hujan'],
          ['sumber_listrik',  'TEXT',   'PLN',             'PLN / Genset / Solar Panel'],
          ['jaringan_gsm',    'TEXT',   'Telkomsel',       'Provider yang tersedia di lokasi'],
          ['jumlah_patok',    'NUMBER', '12',              'Jumlah patok perbatasan di AO pos'],
          ['kerawanan_utama', 'TEXT',   'Ilegal Logging',  'Potensi ancaman utama di wilayah pos'],
        ]} />
        <AlertBox type="info">
          Koordinat lat/lng bisa didapat dari Google Maps: klik titik lokasi pos → salin angka koordinat.
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
          Satu baris per pos. Diisi berdasarkan data dari pemerintah desa atau hasil pendataan langsung.
        </p>
        <ColTable cols={[
          ['pos_id',          'TEXT',   'POS-3',     'Wajib. Harus sesuai dengan tab pos'],
          ['total_penduduk',  'NUMBER', '1240',      'Total jiwa di wilayah binaan'],
          ['total_kk',        'NUMBER', '310',       'Total Kepala Keluarga'],
          ['islam',           'NUMBER', '980',       'Jumlah pemeluk agama Islam'],
          ['kristen',         'NUMBER', '180',       'Jumlah pemeluk agama Kristen'],
          ['katolik',         'NUMBER', '60',        'Jumlah pemeluk agama Katolik'],
          ['hindu',           'NUMBER', '10',        'Jumlah pemeluk agama Hindu'],
          ['buddha',          'NUMBER', '8',         'Jumlah pemeluk agama Buddha'],
          ['konghucu',        'NUMBER', '2',         'Jumlah pemeluk agama Konghucu'],
          ['lainnya',         'NUMBER', '0',         'Agama/kepercayaan lainnya'],
          ['masjid',          'NUMBER', '3',         'Jumlah masjid/mushola'],
          ['gereja',          'NUMBER', '2',         'Jumlah gereja'],
          ['pura',            'NUMBER', '0',         'Jumlah pura'],
          ['vihara',          'NUMBER', '0',         'Jumlah vihara'],
          ['geografi',        'TEXT',   'Perbukitan berhutan lebat, berbatasan langsung dengan Malaysia', 'Deskripsi kondisi geografis'],
          ['demografi_notes', 'TEXT',   'Mayoritas suku Tidung', 'Catatan demografi tambahan'],
          ['konsos_notes',    'TEXT',   'Masyarakat kooperatif', 'Kondisi sosial masyarakat'],
        ]} />
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
          ['id',        'TEXT',   'TOK-001',         'ID unik. Format: TOK-001, TOK-002, dst.'],
          ['pos_id',    'TEXT',   'POS-5',           'Wajib. Pos yang membina tokoh ini'],
          ['nama',      'TEXT',   'H. Ahmad Yani',   'Nama lengkap tokoh'],
          ['kategori',  'TEXT',   'Adat',            'Adat / Masyarakat / Agama'],
          ['jabatan',   'TEXT',   'Kepala Adat',     'Jabatan/peran tokoh'],
          ['alamat',    'TEXT',   'Jl. Perbatasan 5','Alamat tinggal'],
          ['no_telp',   'TEXT',   '081234567890',    'Nomor HP yang bisa dihubungi'],
          ['catatan',   'TEXT',   'Sangat kooperatif, aktif bantu patroli', 'Catatan penting dari pos'],
        ]} />
        <StepList steps={[
          'Buka tab tokoh di Google Sheets',
          'Tambah baris baru di bawah data terakhir',
          'Isi id dengan format TOK-XXX (lanjut dari nomor terakhir)',
          'Isi pos_id sesuai pos yang melaporkan',
          'Isi data tokoh lengkap',
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
          ['id',             'TEXT',   'BIN-001',           'ID unik. Format: BIN-001, BIN-002, dst.'],
          ['pos_id',         'TEXT',   'POS-2',             'Wajib. Pos pelaksana kegiatan'],
          ['tanggal',        'DATE',   '2026-03-20',        'Tanggal kegiatan (format YYYY-MM-DD)'],
          ['jenis_kegiatan', 'TEXT',   'Pengobatan Gratis', 'Pilih dari daftar jenis kegiatan'],
          ['lokasi',         'TEXT',   'Balai Desa Sekatak','Lokasi pelaksanaan'],
          ['sasaran',        'TEXT',   'Warga Desa Sekatak','Sasaran/peserta kegiatan'],
          ['jumlah_peserta', 'NUMBER', '85',                'Jumlah peserta yang hadir'],
          ['keterangan',     'TEXT',   'Bekerjasama dengan Puskesmas Kec. Sekatak', 'Keterangan tambahan'],
          ['foto_url',       'TEXT',   'https://drive.google.com/...', 'Link foto dari Google Drive (opsional)'],
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
          ['id',           'TEXT',   'KRW-001',           'ID unik. Format: KRW-001, KRW-002, dst.'],
          ['pos_id',       'TEXT',   'POS-7',             'Wajib. Pos yang melaporkan'],
          ['tanggal',      'DATE',   '2026-03-18',        'Tanggal kejadian (format YYYY-MM-DD)'],
          ['kategori',     'TEXT',   'Ilegal Logging',    'Kategori insiden (lihat daftar di bawah)'],
          ['deskripsi',    'TEXT',   'Ditemukan aktivitas penebangan liar...', 'Uraian singkat kejadian'],
          ['status',       'TEXT',   'aktif',             'aktif = belum selesai / selesai = sudah ditangani'],
          ['lat',          'NUMBER', '4.1122',            'Koordinat TKP (opsional, untuk marker di peta)'],
          ['lng',          'NUMBER', '117.7833',          'Koordinat TKP (opsional)'],
          ['pelaku',       'TEXT',   'Tidak dikenal, 3 orang', 'Identitas pelaku jika diketahui'],
          ['tindak_lanjut','TEXT',   'Dilaporkan ke Polsek Sebatik', 'Tindak lanjut yang sudah dilakukan'],
          ['foto_url',     'TEXT',   'https://drive.google.com/...', 'Link foto barang bukti (opsional)'],
        ]} />

        <div className="space-y-2">
          <p className="hud-label">Kategori Kerawanan yang Valid:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Kriminal',          color: '#dc2626' },
              { label: 'Ilegal Logging',    color: '#d97706' },
              { label: 'Illegal Mining',    color: '#7c3aed' },
              { label: 'Human Trafficking', color: '#db2777' },
              { label: 'Lintas Batas',      color: '#ea580c' },
              { label: 'Lainnya',           color: '#6b7280' },
            ].map(k => (
              <span key={k.label} className="px-2 py-0.5 rounded-sm text-[9px] font-bold"
                style={{ background: `${k.color}15`, border: `1px solid ${k.color}40`, color: k.color }}>
                {k.label}
              </span>
            ))}
          </div>
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
