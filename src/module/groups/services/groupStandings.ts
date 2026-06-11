import type { ITeam, IMatch } from '@/core/types'
import { EMatchStatus } from '@/core/types'

export interface IStandingEntry {
  teamId: string
  teamName: string
  countryCode: string
  pts: number
  gf: number
  gc: number
  df: number
}

export function computeGroupStandings(teams: ITeam[], matches: IMatch[]): IStandingEntry[] {
  const stats = new Map<string, { pts: number; gf: number; gc: number }>()

  for (const team of teams) {
    stats.set(team.id, { pts: 0, gf: 0, gc: 0 })
  }

  for (const match of matches) {
    if (match.status !== EMatchStatus.FINISHED) continue
    if (match.homeScore === null || match.awayScore === null) continue

    const home = stats.get(match.homeTeamId)
    const away = stats.get(match.awayTeamId)
    if (!home || !away) continue

    home.gf += match.homeScore
    home.gc += match.awayScore
    away.gf += match.awayScore
    away.gc += match.homeScore

    if (match.homeScore > match.awayScore) {
      home.pts += 3
    } else if (match.homeScore < match.awayScore) {
      away.pts += 3
    } else {
      home.pts += 1
      away.pts += 1
    }
  }

  const entries: IStandingEntry[] = teams.map((team) => {
    const s = stats.get(team.id)!
    return {
      teamId: team.id,
      teamName: team.name,
      countryCode: team.countryCode,
      pts: s.pts,
      gf: s.gf,
      gc: s.gc,
      df: s.gf - s.gc,
    }
  })

  entries.sort((a, b) => {
    if (a.pts !== b.pts) return b.pts - a.pts
    if (a.df !== b.df) return b.df - a.df
    return b.gf - a.gf
  })

  return entries
}
