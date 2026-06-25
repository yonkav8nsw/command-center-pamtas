import { describe, it, expect } from 'vitest'
import { aggregateDemografi } from './demografi'

describe('aggregateDemografi', () => {
  it('mengembalikan null untuk array kosong', () => {
    expect(aggregateDemografi([])).toBeNull()
  })

  it('mengembalikan null untuk null/undefined', () => {
    expect(aggregateDemografi(null)).toBeNull()
    expect(aggregateDemografi(undefined)).toBeNull()
  })

  it('menjumlahkan field numerik dari banyak row', () => {
    const rows = [
      { pos_id: 'AJ', total_penduduk: 100, total_kk: 25, islam: 80, kristen: 20 },
      { pos_id: 'AJ', total_penduduk: 50, total_kk: 15, islam: 40, kristen: 10 },
    ]
    const result = aggregateDemografi(rows)
    expect(result.total_penduduk).toBe(150)
    expect(result.total_kk).toBe(40)
    expect(result.islam).toBe(120)
    expect(result.kristen).toBe(30)
  })

  it('menangani objek tunggal (bukan array)', () => {
    const result = aggregateDemografi({ pos_id: 'KT', total_penduduk: 8420, total_kk: 2105 })
    expect(result.total_penduduk).toBe(8420)
    expect(result.total_kk).toBe(2105)
  })

  it('memperlakukan field non-numerik / hilang sebagai 0', () => {
    const rows = [
      { pos_id: 'BB', total_penduduk: null, total_kk: undefined },
      { pos_id: 'BB', total_penduduk: 'bukan-angka', total_kk: 10 },
    ]
    const result = aggregateDemografi(rows)
    expect(result.total_penduduk).toBe(0)
    expect(result.total_kk).toBe(10)
  })

  it('mempertahankan field non-numerik dari row pertama', () => {
    const rows = [
      { pos_id: 'TA', total_penduduk: 100, geografi: 'Pegunungan' },
    ]
    const result = aggregateDemografi(rows)
    expect(result.pos_id).toBe('TA')
    expect(result.geografi).toBe('Pegunungan')
  })
})
