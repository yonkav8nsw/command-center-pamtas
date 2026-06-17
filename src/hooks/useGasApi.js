import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api'

// Simple in-memory cache
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 menit

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null }
  return entry.data
}

function setCached(key, data) {
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

  const fetch = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCached(cacheKey)
      if (cached) { setData(cached); setLoading(false); return }
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
 * Hook: auto-refresh data setiap interval
 */
export function useAutoRefresh(refetchFns, intervalMs = 5 * 60 * 1000) {
  useEffect(() => {
    const id = setInterval(() => {
      clearCache()
      refetchFns.forEach(fn => fn())
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs]) // eslint-disable-line
}
