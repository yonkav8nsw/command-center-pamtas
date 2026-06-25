import { supabase } from '../lib/supabase'

export const binterService = {
  async getByPos(posId, bulan) {
    let query = supabase
      .from('binter')
      .select('*')
      .eq('pos_id', posId)
      .order('tanggal', { ascending: false })

    if (bulan) {
      // bulan format: 'YYYY-MM' — filter range awal dan akhir bulan
      // Gunakan akhir bulan yang tepat dengan gte/lt untuk menghindari masalah tanggal 31
      const start = `${bulan}-01`
      const [yr, mo] = bulan.split('-').map(Number)
      const nextMonth = mo === 12
        ? `${yr + 1}-01-01`
        : `${yr}-${String(mo + 1).padStart(2, '0')}-01`
      query = query.gte('tanggal', start).lt('tanggal', nextMonth)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getAll() {
    const { data, error } = await supabase
      .from('binter')
      .select('*')
      .order('tanggal', { ascending: false })
    if (error) throw error
    return data || []
  },

  async add(payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('binter')
      .insert({ ...payload, created_by: user?.id })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('binter')
      .update({ ...payload, updated_by: user?.id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('binter')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
