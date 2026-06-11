import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPredictions, getPredictionByMatch, savePrediction } from './predictionService'
import type { IPrediction } from '@/core/types'

const mockPrediction: IPrediction = {
  id: 'pred-user1-match1',
  userId: 'user1',
  matchId: 'match1',
  homeScore: 2,
  awayScore: 1,
  points: null,
  // createdAt: '2026-06-08T12:00:00.000Z',
}

function mockFetch(data: unknown): void {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true, data }),
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('predictionService', () => {
  it('returns empty array when no predictions exist', async () => {
    mockFetch([])
    const result = await getPredictions('user1', 'token')
    expect(result).toEqual([])
  })

  it('fetches predictions by userId', async () => {
    mockFetch([mockPrediction])
    const result = await getPredictions('user1', 'token')
    expect(result).toHaveLength(1)
    expect(result[0].matchId).toBe('match1')
  })

  it('saves a prediction via API', async () => {
    mockFetch(mockPrediction)
    const result = await savePrediction(mockPrediction, 'token')
    expect(result.id).toBe('pred-user1-match1')
    expect(result.homeScore).toBe(2)
  })

  it('returns prediction by match', async () => {
    mockFetch(mockPrediction)
    const result = await getPredictionByMatch('user1', 'match1', 'token')
    expect(result).not.toBeNull()
    expect(result?.matchId).toBe('match1')
  })

  it('returns null for non-existent match', async () => {
    mockFetch(null)
    const result = await getPredictionByMatch('user1', 'nonexistent', 'token')
    expect(result).toBeNull()
  })
})
