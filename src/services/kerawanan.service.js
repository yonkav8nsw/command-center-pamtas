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
    // Sanitize numeric fields - convert empty strings to null
    const sanitized = {
      ...payload,
      lat: payload.lat === '' || payload.lat == null ? null : Number(payload.lat),
      lng: payload.lng === '' || payload.lng == null ? null : Number(payload.lng),
      jumlah_pelaku: payload.jumlah_pelaku === '' || payload.jumlah_pelaku == null ? null : Number(payload.jumlah_pelaku),
      created_by: user?.id,
    }
    const { data, error } = await supabase
      .from('kerawanan')
      .insert(sanitized)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    // Sanitize numeric fields - convert empty strings to null
    const sanitized = {
      ...payload,
      lat: payload.lat === '' || payload.lat == null ? null : Number(payload.lat),
      lng: payload.lng === '' || payload.lng == null ? null : Number(payload.lng),
      jumlah_pelaku: payload.jumlah_pelaku === '' || payload.jumlah_pelaku == null ? null : Number(payload.jumlah_pelaku),
      updated_by: user?.id,
    }
    const { data, error } = await supabase
      .from('kerawanan')
      .update(sanitized)
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
