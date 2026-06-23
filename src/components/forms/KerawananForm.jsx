import { useState } from 'react'
import { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'
import { FormField, FormActions, FormError } from './TokohForm'

export function KerawananForm({ posId, onSave, onCancel }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    tanggal:       today,
    kategori:      '',
    deskripsi:     '',
    pelaku:        '',
    tindak_lanjut: '',
    status:        'aktif',
    lat:           '',
    lng:           '',
    foto_url:      '',
  })
  const [saving, setSaving] = useState(false)
  const [fieldError, setFieldError] = useState('')

  const set = (key) => (e) => {
    setFieldError('')
    setForm(f => ({ ...f, [key]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.kategori) {
      setFieldError('Kategori wajib dipilih')
      return
    }
    if (!form.deskripsi.trim()) {
      setFieldError('Deskripsi tidak boleh kosong')
      return
    }
    setSaving(true)
    setFieldError('')
    try {
      await onSave(form)
    } catch (err) {
      setFieldError(err.message || 'Gagal menyimpan laporan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">

        <FormField label="Tanggal *">
          <input
            type="date"
            className="hud-input"
            value={form.tanggal}
            onChange={set('tanggal')}
            required
          />
        </FormField>

        <FormField label="Kategori *">
          <select
            className="hud-select"
            value={form.kategori}
            onChange={set('kategori')}
            required
          >
            <option value="">-- Pilih --</option>
            {KERAWANAN_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Deskripsi Kejadian *" colSpan={2}>
          <textarea
            className="hud-input resize-none"
            rows={3}
            value={form.deskripsi}
            onChange={set('deskripsi')}
            placeholder="Uraian singkat kejadian"
            required
          />
        </FormField>

        <FormField label="Pelaku / Pihak Terlibat" colSpan={2}>
          <input
            className="hud-input"
            value={form.pelaku}
            onChange={set('pelaku')}
            placeholder="Identitas pelaku (jika diketahui)"
          />
        </FormField>

        <FormField label="Tindak Lanjut" colSpan={2}>
          <textarea
            className="hud-input resize-none"
            rows={2}
            value={form.tindak_lanjut}
            onChange={set('tindak_lanjut')}
            placeholder="Tindakan yang telah / akan dilakukan"
          />
        </FormField>

        <FormField label="Status">
          <select className="hud-select" value={form.status} onChange={set('status')}>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </FormField>

        <FormField label="URL Foto (opsional)">
          <input
            className="hud-input"
            value={form.foto_url}
            onChange={set('foto_url')}
            placeholder="https://drive.google.com/..."
          />
        </FormField>

        {/* Koordinat */}
        <FormField label="Latitude">
          <input
            type="number"
            step="any"
            className="hud-input font-mono"
            value={form.lat}
            onChange={set('lat')}
            placeholder="3.xxxxx"
          />
        </FormField>

        <FormField label="Longitude">
          <input
            type="number"
            step="any"
            className="hud-input font-mono"
            value={form.lng}
            onChange={set('lng')}
            placeholder="116.xxxxx"
          />
        </FormField>

      </div>

      {/* Warning jika koordinat kosong */}
      {(!form.lat || !form.lng) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm"
          style={{ background: 'rgba(255,170,0,0.06)', border: '1px solid rgba(255,170,0,0.2)' }}>
          <span className="text-[#ffaa00] text-xs flex-shrink-0">⚠</span>
          <span className="text-[10px] text-[rgba(255,170,0,0.7)]">
            Tanpa koordinat, marker tidak muncul di peta.
          </span>
        </div>
      )}

      {fieldError && <FormError message={fieldError} />}

      <FormActions onCancel={onCancel} saving={saving} submitLabel="Laporkan" />
    </form>
  )
}

