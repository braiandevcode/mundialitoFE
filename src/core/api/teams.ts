import { get } from './httpClient'
import type { ITeam } from '@/core/types'

export function fetchTeams(): Promise<ITeam[]> {
  return get<ITeam[]>('/teams')
}
