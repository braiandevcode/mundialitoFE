import { get, patch, post } from './httpClient'
import type { IMatch } from '@/core/types'

export interface IUpdateMatchBody {
  homeScore?: number | null
  awayScore?: number | null
  extraHomeScore?: number | null
  extraAwayScore?: number | null
  penaltyHomeScore?: number | null
  penaltyAwayScore?: number | null
  status?: 'scheduled' | 'live' | 'finished'
}

export function fetchMatches(): Promise<IMatch[]> {
  return get<IMatch[]>('/matches')
}

export function fetchGroupMatches(groupId: string): Promise<IMatch[]> {
  return get<IMatch[]>(`/matches/groups/${groupId}`)
}

export function fetchBracketMatches(): Promise<IMatch[]> {
  return get<IMatch[]>('/matches/bracket')
}

export function updateMatch(matchId: string, body: IUpdateMatchBody, token: string): Promise<IMatch> {
  return patch<IMatch>(`/matches/${matchId}`, body, token)
}

export function generateNextRound(token: string): Promise<{ matches: IMatch[]; round: string; message?: string }> {
  return post<{ matches: IMatch[]; round: string; message?: string }>('/matches/generate-next-round', {}, token)
}
