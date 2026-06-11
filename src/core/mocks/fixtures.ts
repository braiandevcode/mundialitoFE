import type { IMatch, ITeam, IGroup } from '../types'
import type { IGroupMatch } from './scenarios'
import { EMatchStatus, EKnockoutRound } from '../types'
import { teams } from './teams'
import { groups } from './groups'
import {
  getGroupResults,
  getMatchStatus,
  groupSchedule,
  r32Schedule,
  r16Schedule,
  qfSchedule,
  sfSchedule,
  finalSchedule,
  thirdSchedule,
} from './scenarios'

const groupOrder: readonly string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const pairings: number[][] = [
  [0, 1], [2, 3],
  [0, 2], [1, 3],
  [0, 3], [1, 2],
]

function buildGroupMatches(): IMatch[] {
  const matches: IMatch[] = []
  const results = getGroupResults()

  const scheduleByGroup = new Map<string, IGroupMatch[]>()
  for (const entry of groupSchedule) {
    const list = scheduleByGroup.get(entry.groupId) ?? []
    list.push(entry)
    scheduleByGroup.set(entry.groupId, list)
  }

  for (const groupId of groupOrder) {
    const groupTeams: ITeam[] = teams.filter((t: ITeam) => t.groupId === groupId)
    const groupEntries: IGroupMatch[] = scheduleByGroup.get(groupId) ?? []

    for (let i = 0; i < 6; i++) {
      const [h, a] = pairings[i]
      const sched: IGroupMatch | undefined = groupEntries[i]
      if (!sched) continue
      const result = results[sched.matchNumber]

      matches.push({
        id: `M${String(sched.matchNumber).padStart(3, '0')}`,
        groupId,
        round: null,
        matchNumber: sched.matchNumber,
        homeTeamId: groupTeams[h].id,
        awayTeamId: groupTeams[a].id,
        date: sched.date,
        stadium: sched.stadium,
        status: getMatchStatus(sched.matchNumber),
        homeScore: result?.homeScore,
        awayScore: result?.awayScore,
      })
    }
  }

  matches.sort((a, b) => a.matchNumber - b.matchNumber)
  return matches
}

// Parejas reales de 16avos según el fixture oficial FIFA
const r32Pairings: string[][] = [
  ['1E', '3ABCDF'],    // R32-1: Match 74 — 1E vs 3°ABCDEF
  ['1I', '3CDFGH'],    // R32-2: Match 77 — 1I vs 3°CDFGH
  ['2A', '2B'],         // R32-3: Match 73 — 2A vs 2B
  ['1F', '2C'],         // R32-4: Match 75 — 1F vs 2C
  ['2K', '2L'],         // R32-5: Match 83 — 2K vs 2L
  ['1H', '2J'],         // R32-6: Match 84 — 1H vs 2J
  ['1D', '3BEFIJ'],     // R32-7: Match 81 — 1D vs 3°BEFIJ
  ['1G', '3AEHIJ'],     // R32-8: Match 82 — 1G vs 3°AEHIJ
  ['1C', '2F'],         // R32-9: Match 76 — 1C vs 2F
  ['2E', '2I'],         // R32-10: Match 78 — 2E vs 2I
  ['1A', '3CEFHI'],     // R32-11: Match 79 — 1A vs 3°CEFHI
  ['1L', '3EHIJK'],     // R32-12: Match 80 — 1L vs 3°EHIJK
  ['1J', '2H'],         // R32-13: Match 86 — 1J vs 2H
  ['2D', '2G'],         // R32-14: Match 88 — 2D vs 2G
  ['1B', '3EFGIJ'],     // R32-15: Match 85 — 1B vs 3°EFGIJ
  ['1K', '3DEIJL'],     // R32-16: Match 87 — 1K vs 3°DEIJL
]

function buildR32Matches(): IMatch[] {
  return r32Pairings.map((pairing: string[], i: number) => {
    const sched = r32Schedule[i]
    return {
      id: `R32-${i + 1}`,
      groupId: null,
      round: EKnockoutRound.R32,
      matchNumber: 73 + i,
      homeTeamId: pairing[0],
      awayTeamId: pairing[1],
      date: sched.date,
      stadium: sched.stadium,
      status: EMatchStatus.SCHEDULED as const,
    }
  })
}

function buildKoMatches(
  round: EKnockoutRound,
  schedule: { id: string; date: string; stadium: string }[],
  startMatchNum: number,
): IMatch[] {
  return schedule.map((sched, i: number) => ({
    id: sched.id,
    groupId: null,
    round,
    matchNumber: startMatchNum + i,
    homeTeamId: `TBD-${sched.id}-H`,
    awayTeamId: `TBD-${sched.id}-A`,
    date: sched.date,
    stadium: sched.stadium,
    status: EMatchStatus.SCHEDULED as const,
  }))
}

export const fixtures: IMatch[] = [
  ...buildGroupMatches(),
  ...buildR32Matches(),
  ...buildKoMatches(EKnockoutRound.R16, r16Schedule, 89),
  ...buildKoMatches(EKnockoutRound.QF, qfSchedule, 97),
  ...buildKoMatches(EKnockoutRound.SF, sfSchedule, 101),
  {
    id: 'FINAL',
    groupId: null,
    round: EKnockoutRound.FINAL,
    matchNumber: 104,
    homeTeamId: 'TBD-FINAL-H',
    awayTeamId: 'TBD-FINAL-A',
    date: finalSchedule.date,
    stadium: finalSchedule.stadium,
    status: EMatchStatus.SCHEDULED as const,
  },
  {
    id: 'THIRD',
    groupId: null,
    round: EKnockoutRound.THIRD_PLACE,
    matchNumber: 103,
    homeTeamId: 'TBD-3RD-H',
    awayTeamId: 'TBD-3RD-A',
    date: thirdSchedule.date,
    stadium: thirdSchedule.stadium,
    status: EMatchStatus.SCHEDULED as const,
  },
]

export const fixturesByGroup: Map<string, IMatch[]> = new Map(
  groups.map((g: IGroup) => [g.id, fixtures.filter((m: IMatch) => m.groupId === g.id)]),
)
