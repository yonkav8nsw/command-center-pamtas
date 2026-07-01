# DASHBOARD BUTTON INVENTORY
Generated: 2026-07-02

---

## LOGIN PAGE (`/login`)
```
[LoginPage]
├── form
│   ├── input[type="email"]
│   ├── input[type="password"]
│   └── button[type="submit"] "MASUK SISTEM"
```

---

## HOME PAGE (`/`)
```
[HomePage]
├── NARASINGA SIAGA (text)
├── PERBATASAN TERJAGA (text)
├── SATGAS PAMTAS tagline
├── Logo
│
├── [Sidebar Navigation]
│   ├── a[href="/"] "Home"
│   ├── a[href="/overview"] "Overview"
│   ├── a[href="/insiden"] "Insiden"
│   ├── a[href="/binter"] "Binter"
│   ├── a[href="/admin"] "Admin" (admin only)
│   ├── a[href="/panduan"] "Panduan"
│   ├── a[href="/laporan/kerawanan"] "Grafik Kerawanan"
│   ├── a[href="/laporan/tokoh"] "Tokoh Wilayah"
│   ├── a[href="/laporan/demografi"] "Data Demografi"
│   └── [POS List in sidebar]
│       ├── a[href="/pos/KOTIS"]
│       ├── a[href="/pos/KT"]
│       ├── a[href="/pos/A1"]
│       ├── a[href="/pos/A2"]
│       └── ... (all POS)
│
└── [HUD Stats]
    ├── StatPanel "PERSONEL" (value)
    ├── StatPanel "POS AKTIF" (value)
    └── StatPanel "INSIDEN" (value)
```

---

## OVERVIEW PAGE (`/overview`)
```
[OverviewPage]
├── [TopBar]
│   ├── button[presentation mode]
│   ├── button[fullscreen]
│   ├── button[print]
│   └── button[logout]
│
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

## POS DETAIL PAGE (`/pos/:posId`)
```
[PosDetailPage]
├── [Header]
│   ├── button[Kembali] "← Kembali"
│   └── button[Cetak Laporan] "📄 Cetak / Simpan PDF"
│
├── [Info Pills]
│   ├── InfoPill "Komandan"
│   ├── InfoPill "Personel"
│   ├── InfoPill "Penduduk"
│   ├── InfoPill "Insiden"
│   └── InfoPill "Klasifikasi"
│
├── [Tab Navigation]
│   ├── button[role="tab"] "Info"
│   ├── button[role="tab"] "Demografi"
│   ├── button[role="tab"] "Tokoh"
│   ├── button[role="tab"] "Binter"
│   ├── button[role="tab"] "Insiden"
│   └── button[role="tab"] "Patroli"
│
├── [INFO TAB]
│   ├── button[Edit Pos] "✎ Edit"
│   └── map placeholder
│
├── [DEMOGRAFI TAB]
│   ├── [DemografiTable]
│   │   ├── button[Tambah Data]
│   │   ├── button[Edit Row] (per row)
│   │   └── button[Delete Row] (per row)
│   └── [EditDemografiForm] (modal)
│       ├── input fields
│       ├── button[Batal]
│       └── button[Simpan]
│
├── [TOKOH TAB]
│   ├── [TokohList]
│   │   ├── button[Tambah Tokoh]
│   │   ├── button[Edit Tokoh] (per card)
│   │   └── button[Hapus Tokoh] (per card)
│   └── [TokohForm] (modal)
│       ├── input fields
│       ├── button[Batal]
│       └── button[Simpan]
│
├── [BINTER TAB]
│   ├── [BinterList]
│   │   ├── button[Tambah Binter]
│   │   ├── button[Edit Binter] (per row)
│   │   └── button[Hapus Binter] (per row)
│   └── [BinterForm] (modal)
│       ├── input fields
│       ├── button[Batal]
│       └── button[Simpan]
│
├── [INSIDEN TAB]
│   ├── [KerawananList]
│   │   ├── button[Tambah Insiden]
│   │   ├── button[Edit Insiden] (per card)
│   │   └── button[Hapus Insiden] (per card)
│   └── [KerawananForm] (modal)
│       ├── input fields
│       ├── button[Batal]
│       └── button[Simpan]
│
└── [PATROLI TAB]
    ├── [PatroliList]
    │   ├── button[Tambah Patroli]
    │   ├── button[Edit Patroli] (per row)
    │   └── button[Hapus Patroli] (per row)
    └── [PatroliForm] (modal)
        ├── input fields
        ├── button[Batal]
        └── button[Simpan]
```

---

## INSIDEN PAGE (`/insiden`)
```
[InsidenPage]
├── [Header]
│   └── button[Download PDF]
│
├── [Filter Controls]
│   ├── select[Status]
│   ├── select[Timeline]
│   ├── input[search]
│   └── button[Reset Filter]
│
├── [Insiden List]
│   ├── [InsidenCard] (per item)
│   │   ├── button[View Detail]
│   │   ├── button[Edit]
│   │   └── button[Delete]
│   └── ... (more cards)
│
└── [Add Insiden Button]
    └── button[Tambah Insiden]
```

---

## BINTER PAGE (`/binter`)
```
[BinterPage]
├── [Header]
│   ├── select[Timeline Filter]
│   ├── select[Jenis Binter]
│   ├── input[search]
│   └── button[Download PDF]
│
├── [Binter Timeline/Grid]
│   ├── [BinterCard] (per item)
│   │   ├── button[View Detail]
│   │   └── button[Edit]
│   └── ... (more cards)
│
└── [Add Binter Button]
    └── button[Tambah Binter]
```

---

## ADMIN PAGE (`/admin`)
```
[AdminPage]
├── [Header]
│   └── button[Tambah User]
│
├── [User Management]
│   ├── [User List]
│   │   ├── button[Edit User] (per row)
│   │   └── button[Delete User] (per row)
│   └── [User Form] (modal)
│       ├── input fields
│       ├── select[Role]
│       ├── button[Batal]
│       └── button[Simpan]
│
└── [Role Filter]
    ├── button[All]
    ├── button[Admin]
    ├── button[Operator]
    └── button[Viewer]
```

---

## PANDUAN PAGE (`/panduan`)
```
[PanduanPage]
├── [Tab Navigation]
│   ├── button[Data Pos]
│   ├── button[Demografi]
│   ├── button[Tokoh]
│   ├── button[Binter]
│   ├── button[Kerawanan]
│   └── button[Patroli]
│
└── [Content Area]
    └── SOP sections (read-only)
```

---

## LAPORAN KERAWANAN (`/laporan/kerawanan`)
```
[GrafikKerawananPage]
├── [Header]
│   └── button[Download PDF]
│
└── [Chart Area]
    └── Interactive charts (filterable)
```

---

## LAPORAN TOKOH (`/laporan/tokoh`)
```
[TokohWilayahPage]
├── [Header]
│   └── button[Download PDF]
│
├── [Filter]
│   └── select[Filter by Pos]
│
└── [Tokoh List Table]
    └── Read-only table
```

---

## LAPORAN DEMOGRAFI (`/laporan/demografi`)
```
[DataDemografiPage]
├── [Header]
│   └── button[Download PDF]
│
└── [Demografi Data]
    └── Read-only data tables
```

---

## LAPORAN POS (`/laporan/pos/:posId`)
```
[LaporanPosPage]
├── [Header]
│   ├── button[← Kembali ke Pos]
│   └── button[Cetak / Simpan PDF]
│
└── [Report Content]
    └── Print-ready report (read-only)
```

---

## MODAL COMPONENTS

### [Modal]
```
[Modal]
├── backdrop (click to close)
├── button[X] "✕" (close)
├── header
└── content slot
```

### [ConfirmDialog]
```
[ConfirmDialog]
├── backdrop
├── button[X] "✕"
├── title
├── message
├── button[Batal]
└── button[Konfirmasi]
```

### [Toast]
```
[Toast]
├── Toast container (fixed position)
└── Toast messages (auto-dismiss)
```

---

## TOPBAR (All Pages)
```
[TopBar]
├── button[sidebar toggle] (mobile)
├── span[NARASINGA]
├── span[date/time]
├── button[presentation mode]
├── button[fullscreen]
├── button[print]
└── button[logout]
```

---

## BUG REPORTING TEMPLATE

Untuk report bug, sebutkan:
1. Halaman (page URL)
2. Lokasi tombol (dari tree di atas)
3. Deskripsi masalah
4. Expected behavior
5. Actual behavior

---

*Generated: 2026-07-02*
