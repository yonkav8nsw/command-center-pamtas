# E2E Tests - Command Center PAMTAS

## Setup

1. Pastikan dev server bisa running:
   ```bash
   npm run dev
   ```

2. Set credential di terminal:
   ```bash
   # Windows PowerShell
   $env:E2E_ADMIN_EMAIL="admin@pamtas.mil.id"
   $env:E2E_ADMIN_PASSWORD="passwordANDA"
   ```

3. Jalankan test:
   ```bash
   npx playwright test --project=chromium
   ```

## Struktur Test

```
e2e/tests/
├── login.spec.js     # Halaman login
├── home.spec.js     # Homepage & navigasi sidebar
├── overview.spec.js # Peta tactical & metric cards
├── insiden.spec.js  # List insiden, filter, search
├── binter.spec.js   # List binter, filter, search
├── pos.spec.js      # Detail POS, tab navigation
├── admin.spec.js    # User management
├── panduan.spec.js  # Panduan input
└── laporan.spec.js  # Halaman laporan
```

## Debugging

Jika test gagal, cek:
1. Dev server running di `http://localhost:5173/command-center-pamtas`
2. Credential sudah di-set dengan benar
3. Screenshot akan otomatis dibuat saat test gagal
