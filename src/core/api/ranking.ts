import { get } from './httpClient'
import type { IRankingRound } from '@/core/types'

export function fetchRanking(): Promise<IRankingRound[]> {
  return get<IRankingRound[]>('/ranking')
}
