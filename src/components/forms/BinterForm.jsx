import { useState } from 'react'
import { BINTER_TYPES } from '../../constants/kerawananCategories'
import { FormField, FormActions, FormError } from './TokohForm'

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
  const [fieldError, setFieldError] = useState('')

  const set = (key) => (e) => {
    setFieldError('')
    setForm(f => ({ ...f, [key]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.jenis_kegiatan.trim()) {
      setFieldError('Jenis kegiatan tidak boleh kosong')
      return
    }
    if (!form.tanggal) {
      setFieldError('Tanggal tidak boleh kosong')
      return
    }
    setSaving(true)
    setFieldError('')
    try {
      await onSave(form)
    } catch (err) {
      setFieldError(err.message || 'Gagal menyimpan kegiatan')
    } finally {
      setSaving(false)
    }
  }

  // Fallback jika BINTER_TYPES tidak tersedia di constants
  const jenisList = (BINTER_TYPES && BINTER_TYPES.length > 0)
    ? BINTER_TYPES
    : ['Penyuluhan', 'Baksos', 'Olahraga Bersama', 'Karya Bhakti', 'Kunjungan', 'Lainnya']

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
            {jenisList.map(t => (
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

      {fieldError && <FormError message={fieldError} />}

      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  )
}

