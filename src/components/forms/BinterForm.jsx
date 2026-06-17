import { useState } from 'react'
import { BINTER_TYPES } from '../../constants/kerawananCategories'
import { FormField, FormActions } from './TokohForm'

export function BinterForm({ posId, onSave, onCancel }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    tanggal:         today,
    jenis_kegiatan:  '',
    lokasi:          '',
    sasaran:         '',
    jumlah_peserta:  '',
    keterangan:      '',
    foto_url:        '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.jenis_kegiatan.trim()) return alert('Jenis kegiatan tidak boleh kosong')
    if (!form.tanggal) return alert('Tanggal tidak boleh kosong')
    setSaving(true)
    try {
      await onSave(form)
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

        <FormField label="Jenis Kegiatan *">
          <select className="hud-select" value={form.jenis_kegiatan} onChange={set('jenis_kegiatan')} required>
            <option value="">-- Pilih --</option>
            {(BINTER_TYPES || [
              'Penyuluhan', 'Baksos', 'Olahraga Bersama', 'Karya Bhakti', 'Kunjungan', 'Lainnya'
            ]).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Lokasi" colSpan={2}>
          <input
            className="hud-input"
            value={form.lokasi}
            onChange={set('lokasi')}
            placeholder="Desa / tempat pelaksanaan"
          />
        </FormField>

        <FormField label="Sasaran">
          <input
            className="hud-input"
            value={form.sasaran}
            onChange={set('sasaran')}
            placeholder="Sasaran kegiatan"
          />
        </FormField>

        <FormField label="Jumlah Peserta">
          <input
            type="number"
            className="hud-input"
            value={form.jumlah_peserta}
            onChange={set('jumlah_peserta')}
            placeholder="0"
            min={0}
          />
        </FormField>

        <FormField label="Keterangan" colSpan={2}>
          <textarea
            className="hud-input resize-none"
            rows={3}
            value={form.keterangan}
            onChange={set('keterangan')}
            placeholder="Deskripsi singkat kegiatan"
          />
        </FormField>

        <FormField label="URL Foto (Google Drive)" colSpan={2}>
          <input
            className="hud-input"
            value={form.foto_url}
            onChange={set('foto_url')}
            placeholder="https://drive.google.com/..."
          />
        </FormField>

      </div>
      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  )
}
