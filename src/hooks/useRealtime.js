import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook untuk subscribe Supabase Realtime pada sebuah tabel.
 *
 * @param {string}   table    - nama tabel PostgreSQL (e.g. 'kerawanan')
 * @param {Function} onChange - callback dipanggil setiap ada INSERT/UPDATE/DELETE
 * @param {string}   [filter] - filter opsional, e.g. 'pos_id=eq.AJ'
 *
 * Contoh pemakaian:
 *   useRealtime('kerawanan', (payload) => refetch(), `pos_id=eq.${posId}`)
 */
export function useRealtime(table, onChange, filter) {
  // Simpan onChange di ref agar tidak perlu masuk ke dependency array effect
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange })

  useEffect(() => {
    if (!table) return

    const channelName = filter
      ? `realtime:${table}:${filter}`
      : `realtime:${table}`

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',           // INSERT, UPDATE, DELETE
          schema: 'public',
          table,
          ...(filter && { filter }),
        },
        (payload) => onChangeRef.current(payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Berhasil connect ke realtime channel
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`[useRealtime] Channel error: ${channelName}`)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter]) // eslint-disable-line react-hooks/exhaustive-deps
}
