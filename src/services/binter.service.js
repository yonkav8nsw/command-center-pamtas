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
      const start = `${bulan}-01`
      const end   = `${bulan}-31`
      query = query.gte('tanggal', start).lte('tanggal', end)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('binter')
      .select('*')
      .order('tanggal', { ascending: false })
    if (error) throw error
    return data
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
