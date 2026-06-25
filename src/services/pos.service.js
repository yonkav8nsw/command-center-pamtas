import { supabase } from '../lib/supabase'

export const posService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pos')
      .select('*')
      .order('pos_id')
    if (error) throw error
    return data || []
  },

  async getById(posId) {
    const { data, error } = await supabase
      .from('pos')
      .select('*')
      .eq('pos_id', posId)
      .single()
    if (error) throw error
    return data
  },

  async update(posId, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('pos')
      .update({ ...payload, updated_by: user?.id })
      .eq('pos_id', posId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
