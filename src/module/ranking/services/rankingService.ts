import type { IRankingRound } from '@/core/types'
import { fetchRanking } from '@/core/api/ranking'

export async function getRankingRounds(): Promise<IRankingRound[]> {
  return fetchRanking()
}
