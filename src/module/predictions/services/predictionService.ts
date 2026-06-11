import type { IPrediction } from '@/core/types'
import { EScoringRule } from '@/core/types'
import { fetchPredictions, fetchPrediction, submitPrediction } from '@/core/api/predictions'

export async function getPredictions(userId: string, token: string): Promise<IPrediction[]> {
  return fetchPredictions(userId, token)
}

export async function getPredictionByMatch(userId: string, matchId: string, token: string): Promise<IPrediction | null> {
  return fetchPrediction(userId, matchId, token)
}

export async function savePrediction(prediction: IPrediction, token: string): Promise<IPrediction> {
  return submitPrediction(prediction, token)
}

export function getPredictionPointsColor(points: number | null): string {
  if (points === null) return 'text-slate-400 dark:text-slate-500'
  if (points >= EScoringRule.UNIQUE_EXACT) return 'text-green-600 dark:text-green-400'
  if (points >= EScoringRule.SHARED_EXACT) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
}
