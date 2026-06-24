import { useState, useEffect, useCallback, useRef } from 'react'
import { posService }       from '../services/pos.service'
import { demografiService } from '../services/demografi.service'
import { tokohService }     from '../services/tokoh.service'
import { binterService }    from '../services/binter.service'
import { kerawananService } from '../services/kerawanan.service'
import { patroliService }   from '../services/patroli.service'

// ---------------------------------------------------------------------------
// clearCache — no-op di Supabase (tidak ada client-side cache).
// Dipertahankan untuk kompatibilitas dengan TokohList, BinterList, KerawananList
// yang memanggil clearCache() setelah mutasi.
// ---------------------------------------------------------------------------
export function clearCache() {
  // intentional no-op
}

// ---------------------------------------------------------------------------
// useSupabaseData — generic hook, mirip useGasData tapi fetch via Supabase.
// Return shape identik: { data, loading, error, refetch, refresh }
// ---------------------------------------------------------------------------
export function useSupabaseData(fetcher, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const mountedRef            = useRef(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      if (mountedRef.current) setData(result)
    } catch (err) {
      if (mountedRef.current) setError(err.message ?? 'Terjadi kesalahan')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  // fetcher referensi baru setiap render tapi kontennya stabil via deps —
  // exclude fetcher, gunakan deps eksplisit (sama dengan pola useGasData)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    setData(null)
    setError(null)
    fetch()
    return () => { mountedRef.current = false }
  }, [fetch])

  const refetch = useCallback(() => fetch(), [fetch])

  return { data, loading, error, refetch, refresh: refetch }
}

// ---------------------------------------------------------------------------
// Hook: semua pos
// ---------------------------------------------------------------------------
export function usePos() {
  return useSupabaseData(
    () => posService.getAll(),
    []
  )
}

// ---------------------------------------------------------------------------
// Hook: summary statistik (dihitung dari data demografi + pos)
// Pada GAS ini disediakan endpoint tersendiri. Di Supabase kita hitung
// client-side dari getAllDemografi agar tidak perlu stored procedure tambahan.
// Shape output disamakan dengan yang dipakai OverviewPage:
//   { total_pos, total_penduduk, total_kk, total_laki, total_perempuan }
// ---------------------------------------------------------------------------
export function useSummary() {
  return useSupabaseData(
    async () => {
      const [posList, demografi] = await Promise.all([
        posService.getAll(),
        demografiService.getAll(),
      ])
      const totals = demografi.reduce(
        (acc, d) => {
          acc.total_penduduk += (d.total_penduduk ?? d.jumlah_penduduk ?? 0)
          acc.total_kk       += (d.total_kk       ?? d.jumlah_kk       ?? 0)
          acc.total_laki     += (d.laki_laki       ?? 0)
          acc.total_perempuan+= (d.perempuan       ?? 0)
          return acc
        },
        { total_penduduk: 0, total_kk: 0, total_laki: 0, total_perempuan: 0 }
      )
      return { total_pos: posList.length, ...totals }
    },
    []
  )
}

// ---------------------------------------------------------------------------
// Hook: semua kerawanan
// ---------------------------------------------------------------------------
export function useAllKerawanan() {
  return useSupabaseData(
    () => kerawananService.getAll(),
    []
  )
}

// ---------------------------------------------------------------------------
// Hook: semua binter
// ---------------------------------------------------------------------------
export function useAllBinter() {
  return useSupabaseData(
    () => binterService.getAll(),
    []
  )
}

// ---------------------------------------------------------------------------
// Hook: semua demografi
// ---------------------------------------------------------------------------
export function useAllDemografi() {
  return useSupabaseData(
    () => demografiService.getAll(),
    []
  )
}

// ---------------------------------------------------------------------------
// Hook: demografi per pos
// ---------------------------------------------------------------------------
export function useDemografi(posId) {
  return useSupabaseData(
    () => demografiService.getByPos(posId),
    [posId]
  )
}

// ---------------------------------------------------------------------------
// Hook: semua tokoh
// ---------------------------------------------------------------------------
export function useAllTokoh() {
  return useSupabaseData(
    () => tokohService.getAll(),
    []
  )
}

// ---------------------------------------------------------------------------
// Hook: tokoh per pos
// ---------------------------------------------------------------------------
export function useTokoh(posId) {
  return useSupabaseData(
    () => tokohService.getByPos(posId),
    [posId]
  )
}

// ---------------------------------------------------------------------------
// Hook: binter per pos (bulan opsional)
// ---------------------------------------------------------------------------
export function useBinter(posId, bulan) {
  return useSupabaseData(
    () => binterService.getByPos(posId, bulan),
    [posId, bulan]
  )
}

// ---------------------------------------------------------------------------
// Hook: kerawanan per pos (status opsional)
// ---------------------------------------------------------------------------
export function useKerawanan(posId, status) {
  return useSupabaseData(
    () => kerawananService.getByPos(posId, status),
    [posId, status]
  )
}

// ---------------------------------------------------------------------------
// Hook: patroli per pos
// ---------------------------------------------------------------------------
export function usePatroli(posId) {
  return useSupabaseData(
    () => patroliService.getByPos(posId),
    [posId]
  )
}

// ---------------------------------------------------------------------------
// Hook: auto-refresh (kompatibilitas).
// Di Supabase Realtime bisa menggantikan polling, tapi untuk sekarang
// hook ini tetap berfungsi sebagai interval-based refetch tanpa clearCache.
// ---------------------------------------------------------------------------
export function useAutoRefresh(refetchFns, intervalMs = 5 * 60 * 1000) {
  const refetchRef = useRef(refetchFns)
  useEffect(() => { refetchRef.current = refetchFns })

  useEffect(() => {
    const id = setInterval(() => {
      refetchRef.current.forEach(fn => fn())
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
}
