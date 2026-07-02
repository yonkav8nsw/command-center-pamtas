# DASHBOARD BUTTON INVENTORY
Generated: 2026-07-02
Updated: 2026-07-02 (v3 - Detailed POS Detail)

---

## LOGIN PAGE (`/login`)
```
[LoginPage]
├── [Branding]
│   ├── text "NARASINGA OPERATION CENTER"
│   └── text "── OPERATOR ID" / "── ACCESS KEY"
│
└── [Form]
    ├── input[type="email"]
    ├── input[type="password"]
    └── button[type="submit"] "MASUK SISTEM"
```

---

## HOME PAGE (`/`)
```
[HomePage]
├── [Hero Banner]
│   ├── text "NARASINGA SIAGA"
│   ├── text "PERBATASAN TERJAGA"
│   ├── text "SATGAS PAMTAS RI-MLY YONKAV 8/NSW TA 2026"
│   └── img "Logo" (logo-satgas.png)
│
├── [HUD Stats] - 3x2 Grid Layout
│   ├── StatPanel "PERSONEL" (value)
│   ├── StatPanel "POS AKTIF" (value)
│   ├── StatPanel "INSIDEN" (value)
│   ├── ActionButton "OVERVIEW" (→ /overview)
│   ├── ActionButton "INSIDEN" (→ /insiden)
│   └── ActionButton "LAPORAN" (→ /laporan/kerawanan)
│
└── [Sidebar Navigation] - Collapsible (180px width)

    ├── NAVIGASI
    │   ├── a[href="/"] "Home"
    │   ├── a[href="/overview"] "Overview"
    │   ├── a[href="/insiden"] "Data Insiden" (badge: count)
    │   └── a[href="/binter"] "Program Binter"
    │
    ├── LAPORAN
    │   ├── a[href="/laporan/kerawanan"] "Grafik Insiden"
    │   ├── a[href="/laporan/binter"] "Timeline Binter"
    │   ├── a[href="/laporan/demografi"] "Data Demografi"
    │   └── a[href="/laporan/tokoh"] "Tokoh Wilayah"
    │
    ├── 17 POS SATGAS
    │   └── (POS list - expandable)
    │
    ├── PANDUAN INPUT
    │   └── a[href="/panduan"] "Panduan Input"
    │
    └── PENGATURAN
        └── a[href="/admin"] "Pengaturan" (admin only)
```

---

## POS DETAIL PAGE (`/pos/:posId`)

### Header Section
```
[PosDetailPage]
├── [Header]
│   ├── [Breadcrumb]
│   │   ├── button "← Kembali"
│   │   ├── text "/"
│   │   └── text "{posId}"
│   │
│   ├── [Title Block]
│   │   ├── h2 "{Nama Pos}"
│   │   └── p "{Desa} · {Kabupaten}"
│   │
│   ├── [Info Pills]
│   │   ├── InfoPill label="Komandan" value="{nama}"
│   │   ├── InfoPill label="Personel" value="{jumlah} org"
│   │   ├── InfoPill label="Penduduk" value="{number}"
│   │   ├── InfoPill label="Insiden" value="{count} aktif" (pulse if > 0)
│   │   └── InfoPill label="Klasifikasi" value="{level} ({poin} poin)" (pulse if SIAGA)
│   │
│   └── button "📄 Laporan" (→ /laporan/pos/{posId})
```

### Tab Navigation (8 tabs - Left to Right)
```
├── [Tab Navigation]
│   ├── button[role="tab"] "◆ INFO POS" (active indicator)
│   ├── button[role="tab"] "◈ DEMOGRAFI"
│   ├── button[role="tab"] "◬ GEO-DEMO-KONSOS"
│   ├── button[role="tab"] "◉ TOKOH"
│   ├── button[role="tab"] "◫ BINTER"
│   ├── button[role="tab"] "⚠ DATA INSIDEN" (badge dot if count > 0)
│   ├── button[role="tab"] "◎ PATROLI"
│   └── button[role="tab"] "▣ DOKUMENTASI"
```

---

### TAB 1: INFO POS

```
[INFO POS Tab Content]
├── [Toolbar]
│   └── button "✎ Edit Data Pos" (→ PosForm modal)
│
├── [Section: IDENTITAS POS]
│   ├── row label="ID Pos" value="{pos_id}"
│   ├── row label="Nama Pos" value="{nama_pos}"
│   ├── row label="Lokasi Desa" value="{lokasi_desa}"
│   ├── row label="Kecamatan" value="{kecamatan}"
│   ├── row label="Kabupaten" value="{kabupaten}"
│   ├── row label="Provinsi" value="{provinsi}"
│   ├── row label="Koordinat" value="{lat}, {lng}"
│   └── row label="Jumlah Patok" value="{jumlah} patok"
│
├── [Section: KOMANDAN & PERSONEL] (varies by POS type)
│   │   (For KOTIS/KT:)
│   │   ├── row label="Komandan Situs" value="{nama}"
│   │   ├── row label="Pasi Intel" value="{nama}"
│   │   ├── row label="Pasi Ops" value="{nama}"
│   │   ├── row label="Pasi Minlog" value="{nama}"
│   │   ├── row label="Pasi Ter" value="{nama}"
│   │   ├── row label="Pabintal" value="{nama}"
│   │   ├── row label="Pa Analis" value="{nama}"
│   │   └── row label="Kekuatan Personel" value="{jumlah} orang"
│   │   (For other POS:)
│   │   ├── row label="Komandan Pos" value="{nama}"
│   │   ├── row label="Danssk" value="{nama}"
│   │   ├── row label="DPP" value="{nama}"
│   │   └── row label="Kekuatan Personel" value="{jumlah} orang"
│
├── [Section: FASILITAS & INFRASTRUKTUR]
│   ├── row label="Kondisi Bangunan" value="{kondisi}"
│   ├── row label="Sumber Air" value="{sumber}"
│   ├── row label="Sumber Listrik" value="{sumber}"
│   └── row label="Jaringan GSM" value="{status}"
│
└── [Section: KERAWANAN UTAMA]
    └── row label="Potensi Ancaman" value="{kerawanan}" (highlighted)
```

#### PosForm Modal (from Edit button)
```
[PosForm Modal]
├── header "Edit Data Pos"
├── button "✕" (close)
├── [Form Fields]
│   ├── input "ID Pos" (readonly)
│   ├── input "Nama Pos"
│   ├── input "Lokasi Desa"
│   ├── input "Kecamatan"
│   ├── input "Kabupaten"
│   ├── input "Provinsi"
│   ├── input "Latitude"
│   ├── input "Longitude"
│   ├── input "Komandan Pos"
│   ├── input "Jumlah Patok"
│   ├── input "Jumlah Personel"
│   ├── select "Kondisi Bangunan"
│   ├── select "Sumber Air"
│   ├── select "Sumber Listrik"
│   ├── select "Jaringan GSM"
│   ├── textarea "Kerawanan Utama"
│   └── (KOTIS/KT extra fields...)
│       ├── input "Danssk"
│       ├── input "DPP"
│       ├── input "Komandan Situs"
│       ├── input "Pasi Intel"
│       ├── input "Pasi Ops"
│       ├── input "Pasi Minlog"
│       ├── input "Pasi Ter"
│       ├── input "Pabintal"
│       └── input "Pa Analis"
└── [Footer]
    ├── button "Batal"
    └── button "Simpan"
```

---

### TAB 2: DEMOGRAFI

```
[DEMOGRAFI Tab Content]
├── [Toolbar]
│   └── button "+ Tambah Data"
│
├── [Summary Cards] (if data exists)
│   ├── card "Total Penduduk" value="{number}"
│   ├── card "Total KK" value="{number}"
│   └── card "Persentase" charts
│
├── [Religi Stats]
│   ├── stat "Islam" value="{number}" percentage="{percent}%"
│   ├── stat "Kristen" value="{number}" percentage="{percent}%"
│   ├── stat "Katolik" value="{number}" percentage="{percent}%"
│   ├── stat "Hindu" value="{number}" percentage="{percent}%"
│   ├── stat "Buddha" value="{number}" percentage="{percent}%"
│   ├── stat "Konghucu" value="{number}" percentage="{percent}%"
│   └── stat "Lainnya" value="{number}" percentage="{percent}%"
│
├── [Fasilitas Ibadah]
│   ├── stat "Masjid" value="{number}"
│   ├── stat "Gereja" value="{number}"
│   ├── stat "Pura" value="{number}"
│   ├── stat "Vihara" value="{number}"
│   └── stat "Konghucu" value="{number}"
│
├── [Data Table] (if data exists)
│   ├── table header row
│   ├── table data row(s)
│   │   ├── column "{kategori}"
│   │   ├── column "{jumlah}"
│   │   └── button[Edit] button[Delete]
│   └── pagination (if many rows)
│
└── [Empty State] (if no data)
    └── text "Data demografi belum tersedia"
        └── button "+ Isi Data Demografi"
```

#### DemografiEditForm Modal
```
[DemografiEditForm Modal]
├── header "Edit Data Demografi"
├── button "✕" (close)
├── [Form Fields]
│   ├── input "Total Penduduk"
│   ├── input "Total KK"
│   ├── input "Islam"
│   ├── input "Kristen"
│   ├── input "Katolik"
│   ├── input "Hindu"
│   ├── input "Buddha"
│   ├── input "Konghucu"
│   ├── input "Lainnya"
│   ├── input "Masjid"
│   ├── input "Gereja"
│   ├── input "Pura"
│   └── input "Vihara"
└── [Footer]
    ├── button "Batal"
    └── button "Simpan"
```

---

### TAB 3: GEO-DEMO-KONSOS

```
[GEO-DEMO-KONSOS Tab Content]
├── [Map Container]
│   ├── [Leaflet Map]
│   │   ├── GeoJSON polygons overlay
│   │   └── [Marker] at POS coordinate
│   ├── button[zoom in]
│   ├── button[zoom out]
│   └── [Layer Controls]
│
├── [Konsos Data Visualization]
│   ├── text "DATA KONSOS"
│   ├── table/list of konsos entries
│   └── stat summaries
│
└── [Legend/Info Panel]
    └── color indicators for geo zones
```

---

### TAB 4: TOKOH

```
[TOKOH Tab Content]
├── [Toolbar]
│   └── button "+ Tambah Tokoh"
│
├── [Tokoh List] (cards layout)
│   ├── [TokohCard] (per item)
│   │   ├── img "{foto}"
│   │   ├── text "{nama}"
│   │   ├── text "{jabatan}"
│   │   ├── text "{alamat}"
│   │   ├── text "{no_hp}"
│   │   └── [Actions]
│   │       ├── button[Edit]
│   │       └── button[Hapus]
│   │
│   └── ... (more cards)
│
└── [Empty State] (if no data)
    └── text "Belum ada tokoh"
```

#### TokohForm Modal
```
[TokohForm Modal]
├── header "{isEdit ? 'Edit' : 'Tambah'} Tokoh"
├── button "✕" (close)
├── [Form Fields]
│   ├── input "Nama Lengkap" *
│   ├── input "NIK"
│   ├── input "Jabatan"
│   ├── textarea "Alamat"
│   ├── input "No. HP"
│   ├── input "Foto URL"
│   ├── input "Keterangan"
│   └── select "Status" (Aktif/Nonaktif)
└── [Footer]
    ├── button "Batal"
    └── button "Simpan"
```

---

### TAB 5: BINTER

```
[BINTER Tab Content]
├── [Filter Bar]
│   ├── input[search] "Cari..."
│   ├── select "Jenis Binter"
│   │   └── options: [All, Gotong Royong, Peresmian,军民迎春,...]
│   ├── select "Tahun"
│   └── button "Reset"
│
├── [Binter Timeline] (grouped by date)
│   ├── [DateGroup] "Juli 2026"
│   │   ├── [BinterCard]
│   │   │   ├── img "{foto}"
│   │   │   ├── text "{jenis}"
│   │   │   ├── text "{tanggal}"
│   │   │   ├── text "{lokasi}"
│   │   │   ├── text "{keterangan}"
│   │   │   └── [Actions]
│   │   │       ├── button[Edit]
│   │   │       └── button[Hapus]
│   │   └── ... (more cards)
│   └── ... (more date groups)
│
└── [Empty State] (if no data)
    └── text "Belum ada program Binter"
```

#### BinterForm Modal
```
[BinterForm Modal]
├── header "{isEdit ? 'Edit' : 'Tambah'} Program Binter"
├── button "✕" (close)
├── [Form Fields]
│   ├── select "Jenis Binter" *
│   ├── input "Tanggal" *
│   ├── textarea "Lokasi"
│   ├── textarea "Keterangan"
│   └── input "Foto URL"
└── [Footer]
    ├── button "Batal"
    └── button "Simpan"
```

---

### TAB 6: DATA INSIDEN (Kerawanan)

```
[DATA INSIDEN Tab Content]
├── [Summary Bar]
│   ├── text "Total Poin: {poin}"
│   ├── badge "{level}" (AMAN/SIAGA/WASPADA)
│   └── button "+ Tambah Insiden"
│
├── [Kerawanan List]
│   ├── [KerawananCard] (per item)
│   │   ├── icon "{kategori_icon}"
│   │   ├── text "{kategori}"
│   │   ├── text "{deskripsi}"
│   │   ├── text "{tanggal}"
│   │   ├── badge "{status}" (AKTIF/SELESAI)
│   │   │   └── (pulse animation if AKTIF)
│   │   ├── button[Toggle Status] (AKTIF↔SELESAI)
│   │   ├── button[Edit]
│   │   └── button[Hapus]
│   │
│   └── ... (more cards)
│
└── [Empty State] (if no data)
    └── text "Belum ada laporan kerawanan"
```

#### KerawananForm Modal
```
[KerawananForm Modal]
├── header "{isEdit ? 'Edit' : 'Tambah'} Laporan Kerawanan"
├── button "✕" (close)
├── [Form Fields]
│   ├── select "Kategori" *
│   │   └── options: [Bentrok Antar Suku, Perampokan, Penyusupan,...]
│   ├── textarea "Deskripsi" *
│   ├── input "Tanggal" *
│   ├── input "Korban"
│   ├── select "Status" (Aktif/Selesai)
│   └── textarea "Keterangan"
└── [Footer]
    ├── button "Batal"
    └── button "Simpan"
```

---

### TAB 7: PATROLI

```
[PATROLI Tab Content]
├── [Filter Bar]
│   ├── input[search] "Cari..."
│   ├── select "Jenis Patroli"
│   │   └── options: [All, Patroli Patok, Patroli Rutin, Patroli Malam,...]
│   ├── select "Bulan"
│   └── button "Reset"
│
├── [Patroli Timeline] (grouped by date)
│   ├── [DateGroup] "Juli 2026"
│   │   ├── [PatroliCard]
│   │   │   ├── text "{jenis}"
│   │   │   ├── text "{tanggal}"
│   │   │   ├── text "{personel}"
│   │   │   ├── text "{lokasi}"
│   │   │   ├── img "{foto}" (thumbnail)
│   │   │   └── [Actions]
│   │   │       ├── button[View Full]
│   │   │       ├── button[Edit]
│   │   │       └── button[Hapus]
│   │   └── ... (more cards)
│   └── ... (more date groups)
│
└── [Empty State] (if no data)
    └── text "Belum ada data patroli"
```

#### PatroliForm Modal
```
[PatroliForm Modal]
├── header "{isEdit ? 'Edit' : 'Tambah'} Patroli"
├── button "✕" (close)
├── [Form Fields]
│   ├── select "Jenis Patroli" *
│   ├── input "Tanggal" *
│   ├── input "Personel"
│   ├── textarea "Lokasi"
│   ├── textarea "Keterangan"
│   └── input "Foto URL"
└── [Footer]
    ├── button "Batal"
    └── button "Simpan"
```

---

### TAB 8: DOKUMENTASI

```
[DOKUMENTASI Tab Content]
├── [Upload Section]
│   ├── input "Google Drive URL"
│   ├── button "Tambah"
│   └── [Error/Status message]
│
├── [Photo Gallery Grid]
│   ├── img "{thumbnail}"
│   ├── img "{thumbnail}"
│   └── ... (more images)
│
└── [Empty State] (if no URLs)
    └── text "Belum ada dokumentasi"
```

---

## OVERVIEW PAGE (`/overview`)
```
[OverviewPage]
├── [Sidebar] (same as Home)
│
├── [MapContainer]
│   ├── [Leaflet Map]
│   │   ├── map markers (POS locations)
│   │   └── popup on marker click
│   ├── button[zoom in]
│   └── button[zoom out]
│
├── [MapLayerBar]
│   ├── button[toggle layers]
│   └── dropdown layer options
│
└── [Panel Container]
    ├── [KerawananPanel]
    │   └── button[expand/collapse]
    │
    └── [BinterPanel]
        └── button[expand/collapse]
```

---

## INSIDEN PAGE (`/insiden`)
```
[InsidenPage]
├── [Header]
│   └── button[Download PDF]
│
├── [Filter Controls]
│   ├── select[Status] (All/Aktif/Selesai)
│   ├── select[Timeline] (Bulan/Tahun)
│   ├── input[search] "Cari..."
│   └── button[Reset Filter]
│
├── [Insiden List]
│   ├── [InsidenCard] (per item)
│   │   ├── badge "{kategori}"
│   │   ├── text "{deskripsi}"
│   │   ├── text "{tanggal}"
│   │   ├── text "{pos}"
│   │   ├── badge "{status}"
│   │   └── [Actions]
│   │       ├── button[View Detail]
│   │       ├── button[Edit]
│   │       └── button[Delete]
│   └── ... (more cards)
│
└── [Add Button]
    └── button "+ Tambah Insiden"
```

---

## BINTER PAGE (`/binter`)
```
[BinterPage]
├── [Header]
│   ├── select[Timeline Filter] (Bulan/Tahun)
│   ├── select[Jenis Binter]
│   ├── input[search]
│   └── button[Download PDF]
│
├── [Binter Timeline/Grid]
│   ├── [BinterCard] (per item)
│   │   ├── img "{foto}"
│   │   ├── text "{jenis}"
│   │   ├── text "{tanggal}"
│   │   ├── text "{lokasi}"
│   │   └── [Actions]
│   │       ├── button[View Detail]
│   │       └── button[Edit]
│   └── ... (more cards)
│
└── [Add Button]
    └── button "+ Tambah Binter"
```

---

## ADMIN PAGE (`/admin`)
```
[AdminPage]
├── [Header]
│   └── button "+ Tambah User"
│
├── [User Management]
│   ├── [User List Table]
│   │   ├── column "Nama"
│   │   ├── column "Email"
│   │   ├── column "Role"
│   │   ├── column "Aksi"
│   │   └── row (per user)
│   │       ├── text "{nama}"
│   │       ├── text "{email}"
│   │       ├── badge "{role}"
│   │       └── [Actions]
│   │           ├── button[Edit]
│   │           └── button[Hapus]
│   │
│   └── pagination
│
└── [Role Filter Tabs]
    ├── button "All"
    ├── button "Admin"
    ├── button "Operator"
    └── button "Viewer"
```

#### UserForm Modal
```
[UserForm Modal]
├── header "{isEdit ? 'Edit' : 'Tambah'} User"
├── button "✕" (close)
├── [Form Fields]
│   ├── input "Nama Lengkap"
│   ├── input "Email"
│   ├── select "Role" (Admin/Operator/Viewer)
│   └── input[password] "Password" (new user only)
└── [Footer]
    ├── button "Batal"
    └── button "Simpan"
```

---

## PANDUAN PAGE (`/panduan`)
```
[PanduanPage]
├── [Tab Navigation]
│   ├── button "Data Pos"
│   ├── button "Demografi"
│   ├── button "Tokoh"
│   ├── button "Binter"
│   ├── button "Kerawanan"
│   └── button "Patroli"
│
└── [Content Area]
    └── SOP sections (read-only)
```

---

## LAPORAN KERAWANAN (`/laporan/kerawanan`)
```
[GrafikKerawananPage]
├── [Header]
│   ├── select[Filter by POS]
│   └── button "📄 Download PDF"
│
├── [Chart Area]
│   ├── [Kerawanan Trend Chart]
│   ├── [Kerawanan by Category]
│   └── [Kerawanan Map]
```

---

## LAPORAN TOKOH (`/laporan/tokoh`)
```
[TokohWilayahPage]
├── [Header]
│   ├── button "📄 Download PDF"
│   └── button "🔍 Filter"
│
├── [Filter Panel]
│   └── select[Filter by Pos]
│
└── [Tokoh List Table]
    ├── column "Nama"
    ├── column "Jabatan"
    ├── column "Alamat"
    ├── column "No. HP"
    └── row (per tokoh)
```

---

## MODAL COMPONENTS

### Modal
```
[Modal]
├── backdrop (click to close)
├── header (title)
├── button[X] "✕" (close)
└── content slot
```

### ConfirmDialog
```
[ConfirmDialog]
├── backdrop
├── button[X] "✕"
├── [Icon] (danger/warning/info)
├── title "{type}"
├── message "{question}"
├── button "Batal"
└── button "{confirmLabel}"
```

### Toast
```
[Toast Container] (fixed position bottom-right)
├── [Toast] (per notification)
│   ├── [Icon] (success/error/warning/info)
│   ├── title "{optional}"
│   ├── message "{text}"
│   └── button[X] (dismiss)
```

---

## TOPBAR (All Pages)
```
[TopBar]
├── button[Buka Sidebar] (mobile only)
├── text "NARASINGA"
├── [DateTime]
│   ├── text "HH.MM.SS" (live clock)
│   └── text "HARI, DD MONTH YYYY"
├── button[presentation mode]
├── button[fullscreen]
├── button[print/export PDF]
└── button[logout]
```

---

## BUG REPORTING TEMPLATE

Untuk report bug, sebutkan:
1. Halaman (page URL)
2. Tab yang aktif
3. Lokasi tombol (dari tree di atas)
4. Deskripsi masalah
5. Expected behavior
6. Actual behavior

---

*Generated: 2026-07-02*
*Updated: 2026-07-02 (v3 - Complete POS Detail tree with all tabs, modals, forms)*
