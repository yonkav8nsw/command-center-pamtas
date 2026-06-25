import { supabase } from '../lib/supabase'

export const demografiService = {
  async getByPos(posId) {
    // Satu pos bisa punya banyak row (per kelurahan) — kembalikan array,
    // DemografiTable sudah handle aggregate Array.isArray()
    const { data, error } = await supabase
      .from('demografi')
      .select('*')
      .eq('pos_id', posId)
      .order('pos_id')
    if (error) throw error
    // Kembalikan array (kosong atau berisi) — BUKAN null — agar consumer konsisten
    return data || []
  },

  async getAll() {
    const { data, error } = await supabase
      .from('demografi')
      .select('*')
      .order('pos_id')
    if (error) throw error
    return data || []
  },

  async upsert(posId, payload) {
    const { data: { user } } = await supabase.auth.getUser()

    // Cek apakah sudah ada row untuk pos ini.
    // maybeSingle() mengembalikan null (bukan error) saat 0 baris — sesuai
    // kasus normal pos yang belum punya data demografi.
    const { data: existing, error: selectError } = await supabase
      .from('demografi')
      .select('id')
      .eq('pos_id', posId)
      .limit(1)
      .maybeSingle()
    if (selectError) throw selectError

    if (existing?.id) {
      // UPDATE row yang sudah ada
      const { data, error } = await supabase
        .from('demografi')
        .update({ ...payload, updated_by: user?.id })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      return data
    } else {
      // INSERT row baru
      const { data, error } = await supabase
        .from('demografi')
        .insert({ ...payload, pos_id: posId, created_by: user?.id })
        .select()
        .single()
      if (error) throw error
      return data
    }
  },
}
