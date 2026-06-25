import { supabase } from '../lib/supabase'

export const kerawananService = {
  async getByPos(posId, status) {
    let query = supabase
      .from('kerawanan')
      .select('*')
      .eq('pos_id', posId)
      .order('tanggal', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getAll(status) {
    let query = supabase
      .from('kerawanan')
      .select('*')
      .order('tanggal', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async add(payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('kerawanan')
      .insert({ ...payload, created_by: user?.id })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('kerawanan')
      .update({ ...payload, updated_by: user?.id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('kerawanan')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
