import { supabase } from '../lib/supabase'

export const demografiService = {
  async getByPos(posId) {
    const { data, error } = await supabase
      .from('demografi')
      .select('*')
      .eq('pos_id', posId)
      .single()
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data ?? null
  },

  async getAll() {
    const { data, error } = await supabase
      .from('demografi')
      .select('*')
      .order('pos_id')
    if (error) throw error
    return data
  },

  async upsert(posId, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('demografi')
      .upsert(
        { ...payload, pos_id: posId, updated_by: user?.id },
        { onConflict: 'pos_id' }
      )
      .select()
      .single()
    if (error) throw error
    return data
  },
}
