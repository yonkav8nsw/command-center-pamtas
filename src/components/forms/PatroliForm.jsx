import { useState } from 'react'
import { FormField, FormError, FormActions } from './TokohForm'
import { JENIS_PATROLI } from '../../constants/config'

export function PatroliForm({ initialData, posId, onSave, onCancel }) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    tanggal:          initialData?.tanggal          || today,
    jenis_patroli:    initialData?.jenis_patroli    || 'Patroli Rutin',
    rute:             initialData?.rute             || '',
    jumlah_personel:  initialData?.jumlah_personel  || '',
    hasil_patroli:    initialData?.hasil_patroli    || '',
    catatan:          initialData?.catatan          || '',
    foto_url:         initialData?.foto_url         || '',
  })
  const [saving, setSaving]     = useState(false)
  const [fieldError, setFieldError] = useState('')

  const set = (key) => (e) => {
    setFieldError('')
    setForm(f => ({ ...f, [key]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.hasil_patroli.trim()) {
      setFieldError('Hasil patroli wajib diisi — tulis "Nihil, kondisi aman" jika tidak ada temuan')
      return
    }
    if (form.jumlah_personel && isNaN(Number(form.jumlah_personel))) {
      setFieldError('Jumlah personel harus angka')
      return
    }
    setSaving(true)
    setFieldError('')
    try {
      await onSave({
        ...form,
        jumlah_personel: form.jumlah_personel ? Number(form.jumlah_personel) : null,
      })
    } catch (err) {
      setFieldError(err.message || 'Gagal menyimpan data')
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

        <FormField label="Jenis Patroli *">
          <select className="hud-select" value={form.jenis_patroli} onChange={set('jenis_patroli')}>
            {JENIS_PATROLI.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Jumlah Personel">
          <input
            type="number"
            min="1"
            max="100"
            className="hud-input"
            value={form.jumlah_personel}
            onChange={set('jumlah_personel')}
            placeholder="Jumlah personel"
          />
        </FormField>

        <FormField label="Foto (Google Drive)" >
          <input
            type="url"
            className="hud-input"
            value={form.foto_url}
            onChange={set('foto_url')}
            placeholder="https://drive.google.com/..."
          />
        </FormField>

        <FormField label="Rute Patroli" colSpan={2}>
          <input
            className="hud-input"
            value={form.rute}
            onChange={set('rute')}
            placeholder="Pos → Patok A → Patok B → Kembali Pos"
          />
        </FormField>

        <FormField label="Hasil Patroli *" colSpan={2}>
          <textarea
            className="hud-input resize-none"
            rows={3}
            value={form.hasil_patroli}
            onChange={set('hasil_patroli')}
            placeholder='Temuan selama patroli. Tulis "Nihil, kondisi aman" jika tidak ada temuan.'
            required
          />
        </FormField>

        <FormField label="Catatan" colSpan={2}>
          <textarea
            className="hud-input resize-none"
            rows={2}
            value={form.catatan}
            onChange={set('catatan')}
            placeholder="Catatan tambahan (cuaca, kondisi jalur, dll)"
          />
        </FormField>
      </div>

      {fieldError && <FormError message={fieldError} />}
      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  )
}
