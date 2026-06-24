import { supabase } from '../lib/supabase'

export const demografiService = {
  async getByPos(posId) {
    // Satu pos bisa punya banyak row (per kelurahan) — kembalikan array,
    // DemografiTable sudah handle aggregate Array.isArray()
    const { data, error } = await supabase
      .from('demografi')
      .select('*')
      .eq('pos_id', posId)
      .order('nama_kelurahan')
    if (error) throw error
    return data?.length ? data : null
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
