import { describe, it, expect } from 'vitest'
import { calculateScore } from './scoringService'
import { EScoringRule } from '@/core/types'
import type { IMatch, IPrediction } from '@/core/types'

const finishedMatch: IMatch = {
  id: 'M001',
  groupId: 'A',
  round: null,
  matchNumber: 1,
  homeTeamId: 'T01',
  awayTeamId: 'T02',
  date: '2026-06-11',
  stadium: 'Test',
  status: 'finished',
  homeScore: 2,
  awayScore: 1,
  extraHomeScore: null,
  extraAwayScore: null,
  penaltyHomeScore: null,
  penaltyAwayScore: null,
}

const scheduledMatch: IMatch = {
  ...finishedMatch,
  status: 'scheduled',
  homeScore: null,
  awayScore: null,
  extraHomeScore: null,
  extraAwayScore: null,
  penaltyHomeScore: null,
  penaltyAwayScore: null,
}

function pred(homeScore: number, awayScore: number, id: string = 'test'): IPrediction {
  return {
    id,
    userId: 'u1',
    matchId: 'M001',
    homeScore,
    awayScore,
    points: null,
    createdAt: '2026-01-01',
  }
}

describe('calculateScore', () => {
  it('awards 3 points for exact score (unique)', () => {
    expect(calculateScore(pred(2, 1), finishedMatch)).toBe(EScoringRule.UNIQUE_EXACT)
  })

  it('awards 0 points for correct outcome but wrong score', () => {
    expect(calculateScore(pred(3, 1), finishedMatch)).toBe(EScoringRule.WRONG)
  })

  it('awards 0 points for wrong outcome', () => {
    expect(calculateScore(pred(0, 2), finishedMatch)).toBe(EScoringRule.WRONG)
  })

  it('awards 0 points for wrong outcome (draw vs win)', () => {
    expect(calculateScore(pred(1, 1), finishedMatch)).toBe(EScoringRule.WRONG)
  })

  it('awards 3 points for exact draw (unique)', () => {
    const drawMatch: IMatch = { ...finishedMatch, homeScore: 1, awayScore: 1 }
    expect(calculateScore(pred(1, 1), drawMatch)).toBe(EScoringRule.UNIQUE_EXACT)
  })

  it('awards 0 points for predicted draw when actual draw (wrong score)', () => {
    const drawMatch: IMatch = { ...finishedMatch, homeScore: 2, awayScore: 2 }
    expect(calculateScore(pred(1, 1), drawMatch)).toBe(EScoringRule.WRONG)
  })

  it('awards 0 points for match without result', () => {
    expect(calculateScore(pred(2, 1), scheduledMatch)).toBe(EScoringRule.WRONG)
  })

  it('awards 0 points for correct outcome but not exact', () => {
    expect(calculateScore(pred(4, 2), finishedMatch)).toBe(EScoringRule.WRONG)
  })

  it('awards 1 point for exact score shared with another user', () => {
    const otherPred: IPrediction = pred(2, 1, 'other')
    const allPredictions: IPrediction[] = [pred(2, 1), otherPred]
    expect(calculateScore(pred(2, 1), finishedMatch, allPredictions)).toBe(EScoringRule.SHARED_EXACT)
  })

  it('awards 3 points for exact score when others predicted differently', () => {
    const otherPred: IPrediction = pred(3, 0, 'other')
    const allPredictions: IPrediction[] = [pred(2, 1), otherPred]
    expect(calculateScore(pred(2, 1), finishedMatch, allPredictions)).toBe(EScoringRule.UNIQUE_EXACT)
  })
})
