import { useState } from 'react'
import { FormField, FormError, FormActions } from './TokohForm'

/**
 * PosForm — form untuk mengedit data operasional pos.
 * Field yang bisa diedit: komandan, personel, kondisi, infrastruktur, kerawanan utama.
 * Field identitas (pos_id, nama_pos, koordinat) tidak diedit di sini — itu data master.
 */
export function PosForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState({
    komandan_pos:      initialData?.komandan_pos      || '',
    danssk:            initialData?.danssk            || '',
    dpp:               initialData?.dpp               || '',
    jumlah_personel:   initialData?.jumlah_personel   || '',
    kondisi_bangunan:  initialData?.kondisi_bangunan  || '',
    sumber_air:        initialData?.sumber_air        || '',
    sumber_listrik:    initialData?.sumber_listrik    || '',
    jaringan_gsm:      initialData?.jaringan_gsm      || '',
    kerawanan_utama:   initialData?.kerawanan_utama   || '',
    foto_satelit_url:  initialData?.foto_satelit_url  || '',
  })
  const [saving, setSaving]         = useState(false)
  const [fieldError, setFieldError] = useState('')

  const set = (key) => (e) => {
    setFieldError('')
    setForm(f => ({ ...f, [key]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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

  const KONDISI_OPTIONS = ['Baik', 'Cukup', 'Rusak Ringan', 'Rusak Sedang', 'Rusak Berat']
  const GSM_OPTIONS = ['Ada', 'Terbatas', 'Tidak Ada']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Identitas pos (read-only, untuk referensi) */}
      {initialData && (
        <div className="px-3 py-2 rounded-sm text-[10px]"
          style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <span className="hud-label mr-2">Pos</span>
          <span className="font-mono text-[rgba(0,255,136,0.7)]">{initialData.pos_id}</span>
          {initialData.nama_pos && (
            <span className="text-[rgba(200,214,229,0.4)] ml-2">— {initialData.nama_pos}</span>
          )}
        </div>
      )}

      {/* Komandan & Personel */}
      <div>
        <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-[rgba(0,255,136,0.5)] mb-2">
          Komandan &amp; Personel
        </p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Komandan Pos" colSpan={2}>
            <input
              className="hud-input"
              value={form.komandan_pos}
              onChange={set('komandan_pos')}
              placeholder="Nama Komandan Pos"
            />
          </FormField>

          <FormField label="Danssk">
            <input
              className="hud-input"
              value={form.danssk}
              onChange={set('danssk')}
              placeholder="Nama Danssk"
            />
          </FormField>

          <FormField label="DPP">
            <input
              className="hud-input"
              value={form.dpp}
              onChange={set('dpp')}
              placeholder="Nama DPP"
            />
          </FormField>

          <FormField label="Jumlah Personel">
            <input
              type="number"
              min="1"
              max="200"
              className="hud-input"
              value={form.jumlah_personel}
              onChange={set('jumlah_personel')}
              placeholder="Jumlah orang"
            />
          </FormField>
        </div>
      </div>

      {/* Fasilitas */}
      <div>
        <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-[rgba(0,255,136,0.5)] mb-2">
          Fasilitas &amp; Infrastruktur
        </p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Kondisi Bangunan">
            <select className="hud-select" value={form.kondisi_bangunan} onChange={set('kondisi_bangunan')}>
              <option value="">— Pilih —</option>
              {KONDISI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>

          <FormField label="Jaringan GSM">
            <select className="hud-select" value={form.jaringan_gsm} onChange={set('jaringan_gsm')}>
              <option value="">— Pilih —</option>
              {GSM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>

          <FormField label="Sumber Air">
            <input
              className="hud-input"
              value={form.sumber_air}
              onChange={set('sumber_air')}
              placeholder="PDAM, Sumur, Sungai, dll"
            />
          </FormField>

          <FormField label="Sumber Listrik">
            <input
              className="hud-input"
              value={form.sumber_listrik}
              onChange={set('sumber_listrik')}
              placeholder="PLN, Genset, Solar, dll"
            />
          </FormField>
        </div>
      </div>

      {/* Kerawanan & Dokumentasi */}
      <div>
        <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-[rgba(0,255,136,0.5)] mb-2">
          Kerawanan &amp; Dokumentasi
        </p>
        <div className="grid grid-cols-1 gap-3">
          <FormField label="Kerawanan Utama / Potensi Ancaman">
            <textarea
              className="hud-input resize-none"
              rows={2}
              value={form.kerawanan_utama}
              onChange={set('kerawanan_utama')}
              placeholder="Deskripsi potensi ancaman utama di wilayah pos ini"
            />
          </FormField>

          <FormField label="URL Foto/Dokumentasi">
            <input
              type="url"
              className="hud-input"
              value={form.foto_satelit_url}
              onChange={set('foto_satelit_url')}
              placeholder="https://drive.google.com/... (pisah koma untuk banyak foto)"
            />
          </FormField>
        </div>
      </div>

      {fieldError && <FormError message={fieldError} />}
      <FormActions onCancel={onCancel} saving={saving} submitLabel="Simpan Perubahan" />
    </form>
  )
}
