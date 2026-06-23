import { supabase } from '../lib/supabase'

export const tokohService = {
  async getByPos(posId) {
    const { data, error } = await supabase
      .from('tokoh')
      .select('*')
      .eq('pos_id', posId)
      .order('nama')
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('tokoh')
      .select('*')
      .order('pos_id, nama')
    if (error) throw error
    return data
  },

  async add(payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('tokoh')
      .insert({ ...payload, created_by: user?.id })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('tokoh')
      .update({ ...payload, updated_by: user?.id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('tokoh')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
