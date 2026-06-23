import { supabase } from '../lib/supabase'

export const patroliService = {
  async getByPos(posId) {
    const { data, error } = await supabase
      .from('patroli')
      .select('*')
      .eq('pos_id', posId)
      .order('tanggal', { ascending: false })
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('patroli')
      .select('*')
      .order('tanggal', { ascending: false })
    if (error) throw error
    return data
  },

  async add(payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('patroli')
      .insert({ ...payload, created_by: user?.id })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('patroli')
      .update({ ...payload, updated_by: user?.id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('patroli')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
