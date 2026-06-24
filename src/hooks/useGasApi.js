import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api'
import { APP_CONFIG } from '../constants/config'

const CACHE_TTL       = APP_CONFIG.CACHE_TTL_MS
const CACHE_MAX       = APP_CONFIG.CACHE_MAX_ENTRIES

/**
 * In-memory LRU cache.
 * Map preserves insertion order — oldest key is Map.keys().next().
 * Max entries bounded to CACHE_MAX to prevent unbounded growth on long sessions.
 */
const cache = new Map()

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null }
  // LRU: move to end on access
  cache.delete(key)
  cache.set(key, entry)
  return entry.data
}

function setCached(key, data) {
  // Jangan cache null/undefined — biarkan re-fetch terjadi berikutnya
  if (data === null || data === undefined) return
  // Evict oldest entry jika sudah penuh
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value
    cache.delete(oldest)
  }
  cache.set(key, { data, ts: Date.now() })
}

export function clearCache() {
  cache.clear()
}

/**
 * Generic hook untuk fetch data dari GAS
 * @param {Function} fetcher - fungsi async yang return data
 * @param {string} cacheKey - key untuk cache
 * @param {Array} deps - dependency array
 */
export function useGasData(fetcher, cacheKey, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const mountedRef            = useRef(true)
  const prevKeyRef            = useRef(cacheKey)

  // Reset state saat cacheKey berubah (pindah pos) agar tidak tampil data stale
  if (prevKeyRef.current !== cacheKey) {
    prevKeyRef.current = cacheKey
  }

  const fetch = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCached(cacheKey)
      if (cached !== null) { setData(cached); setLoading(false); return }
    }

    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      if (mountedRef.current) {
        setCached(cacheKey, result)
        setData(result)
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [cacheKey, ...deps]) // eslint-disable-line

  useEffect(() => {
    mountedRef.current = true
    // Reset data saat key berubah sebelum fetch baru
    setData(null)
    setError(null)
    fetch()
    return () => { mountedRef.current = false }
  }, [fetch])

  const refetch = useCallback(() => fetch(true), [fetch])

  // alias: refresh === refetch (kompatibel dengan pemanggil lama)
  return { data, loading, error, refetch, refresh: refetch }
}

/**
 * Hook: semua pos
 */
export function usePos() {
  return useGasData(
    () => api.getAllPos(),
    'all-pos',
    []
  )
}

/**
 * Hook: summary statistik
 */
export function useSummary() {
  return useGasData(
    () => api.getSummary(),
    'summary',
    []
  )
}

/**
 * Hook: semua kerawanan (untuk overlay peta)
 */
export function useAllKerawanan() {
  return useGasData(
    () => api.getAllKerawanan(),
    'all-kerawanan',
    []
  )
}

/**
 * Hook: semua binter
 */
export function useAllBinter() {
  return useGasData(
    () => api.getAllBinter(),
    'all-binter',
    []
  )
}

/**
 * Hook: semua demografi (untuk halaman laporan)
 */
export function useAllDemografi() {
  return useGasData(
    () => api.getAllDemografi(),
    'all-demografi',
    []
  )
}

/**
 * Hook: demografi per pos
 */
export function useDemografi(posId) {
  return useGasData(
    () => api.getDemografi(posId),
    `demografi-${posId}`,
    [posId]
  )
}

/**
 * Hook: semua tokoh (untuk halaman laporan)
 */
export function useAllTokoh() {
  return useGasData(
    () => api.getAllTokoh(),
    'all-tokoh',
    []
  )
}

/**
 * Hook: tokoh per pos
 */
export function useTokoh(posId) {
  return useGasData(
    () => api.getTokoh(posId),
    `tokoh-${posId}`,
    [posId]
  )
}

/**
 * Hook: binter per pos
 */
export function useBinter(posId, bulan) {
  return useGasData(
    () => api.getBinter(posId, bulan),
    `binter-${posId}-${bulan || 'all'}`,
    [posId, bulan]
  )
}

/**
 * Hook: kerawanan per pos
 */
export function useKerawanan(posId, status) {
  return useGasData(
    () => api.getKerawanan(posId, status),
    `kerawanan-${posId}-${status || 'all'}`,
    [posId, status]
  )
}

/**
 * Hook: patroli per pos
 * GAS belum punya endpoint patroli — return array kosong agar LaporanPosPage
 * tidak crash. Ketika GAS sudah support getPatroli, ganti implementasi ini.
 */
export function usePatroli(/* posId */) {
  return { data: [], loading: false, error: null, refetch: () => {}, refresh: () => {} }
}

/**
 * Hook: auto-refresh data setiap interval
 */
export function useAutoRefresh(refetchFns, intervalMs = 5 * 60 * 1000) {
  // refetchFns diabaikan dari dependency karena referensinya selalu baru
  // setiap render tapi fungsinya stabil — aman digunakan via closure
  const refetchRef = useRef(refetchFns)
  useEffect(() => { refetchRef.current = refetchFns })

  useEffect(() => {
    const id = setInterval(() => {
      clearCache()
      refetchRef.current.forEach(fn => fn())
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
}
