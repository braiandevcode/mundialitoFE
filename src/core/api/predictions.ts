import { get, post } from './httpClient'
import type { IPrediction } from '@/core/types'

export function fetchPredictions(userId: string, token: string): Promise<IPrediction[]> {
  return get<IPrediction[]>(`/predictions?userId=${userId}`, token)
}

export function fetchPrediction(userId: string, matchId: string, token: string): Promise<IPrediction | null> {
  return get<IPrediction | null>(`/predictions/${userId}/${matchId}`, token)
}

export function submitPrediction(prediction: IPrediction, token: string): Promise<IPrediction> {
  return post<IPrediction>('/predictions', prediction, token)
}
