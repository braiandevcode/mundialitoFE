import type { ITeam } from '../types'
import type { IGroupMatch } from './scenarios'
import { teams, teamsMap } from './teams'
import {
  MOCK_SCENARIO,
  groupSchedule,
  r32Schedule,
  r16Schedule,
  qfSchedule,
  sfSchedule,
  finalSchedule,
  thirdSchedule,
} from './scenarios'

interface IGroupStanding {
  teamId: string
  teamName: string
  countryCode: string
  groupId: string
  pts: number
  gd: number
  gf: number
  rank: number
}

interface IKnockoutResult {
  matchId: string
  homeTeamId: string
  homeTeamName: string
  homeCountryCode: string
  awayTeamId: string
  awayTeamName: string
  awayCountryCode: string
  homeScore: number
  awayScore: number
  extraHomeScore?: number
  extraAwayScore?: number
  penaltyHomeScore?: number
  penaltyAwayScore?: number
  winnerTeamId: string
  loserTeamId: string
  date: string
  stadium: string
  label: string
}

interface IBracketSlotWithTeams {
  id: string
  round: string
  homeTeamId: string
  homeTeamName: string
  homeCountryCode: string
  awayTeamId: string
  awayTeamName: string
  awayCountryCode: string
  homeScore: number | null
  awayScore: number | null
  extraHomeScore?: number | null
  extraAwayScore?: number | null
  penaltyHomeScore?: number | null
  penaltyAwayScore?: number | null
  date: string
  stadium: string
  label: string
}

type TResultMap = Record<number, { homeScore: number; awayScore: number }>

const groupOrder: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const groupResults: TResultMap = {
  1: { homeScore: 3, awayScore: 0 },
  2: { homeScore: 1, awayScore: 1 },
  3: { homeScore: 2, awayScore: 1 },
  4: { homeScore: 1, awayScore: 0 },
  5: { homeScore: 3, awayScore: 1 },
  6: { homeScore: 2, awayScore: 1 },
  7: { homeScore: 2, awayScore: 2 },
  8: { homeScore: 0, awayScore: 0 },
  9: { homeScore: 0, awayScore: 0 },
  10: { homeScore: 4, awayScore: 1 },
  11: { homeScore: 0, awayScore: 1 },
  12: { homeScore: 3, awayScore: 1 },
  13: { homeScore: 2, awayScore: 3 },
  14: { homeScore: 1, awayScore: 0 },
  15: { homeScore: 3, awayScore: 0 },
  16: { homeScore: 2, awayScore: 1 },
  17: { homeScore: 1, awayScore: 1 },
  18: { homeScore: 0, awayScore: 1 },
  19: { homeScore: 3, awayScore: 2 },
  20: { homeScore: 0, awayScore: 0 },
  21: { homeScore: 1, awayScore: 1 },
  22: { homeScore: 2, awayScore: 0 },
  23: { homeScore: 1, awayScore: 2 },
  24: { homeScore: 3, awayScore: 0 },
  25: { homeScore: 2, awayScore: 1 },
  26: { homeScore: 3, awayScore: 0 },
  27: { homeScore: 1, awayScore: 2 },
  28: { homeScore: 0, awayScore: 2 },
  29: { homeScore: 2, awayScore: 0 },
  30: { homeScore: 0, awayScore: 1 },
  31: { homeScore: 2, awayScore: 2 },
  32: { homeScore: 0, awayScore: 3 },
  33: { homeScore: 1, awayScore: 2 },
  34: { homeScore: 2, awayScore: 0 },
  35: { homeScore: 1, awayScore: 0 },
  36: { homeScore: 2, awayScore: 2 },
  37: { homeScore: 0, awayScore: 2 },
  38: { homeScore: 1, awayScore: 1 },
  39: { homeScore: 0, awayScore: 0 },
  40: { homeScore: 1, awayScore: 2 },
  41: { homeScore: 2, awayScore: 0 },
  42: { homeScore: 4, awayScore: 0 },
  43: { homeScore: 1, awayScore: 0 },
  44: { homeScore: 2, awayScore: 1 },
  45: { homeScore: 3, awayScore: 1 },
  46: { homeScore: 0, awayScore: 2 },
  47: { homeScore: 1, awayScore: 1 },
  48: { homeScore: 2, awayScore: 3 },
  49: { homeScore: 1, awayScore: 1 },
  50: { homeScore: 3, awayScore: 2 },
  51: { homeScore: 2, awayScore: 0 },
  52: { homeScore: 1, awayScore: 1 },
  53: { homeScore: 1, awayScore: 0 },
  54: { homeScore: 2, awayScore: 2 },
  55: { homeScore: 1, awayScore: 3 },
  56: { homeScore: 2, awayScore: 1 },
  57: { homeScore: 0, awayScore: 4 },
  58: { homeScore: 1, awayScore: 1 },
  59: { homeScore: 1, awayScore: 1 },
  60: { homeScore: 3, awayScore: 0 },
  61: { homeScore: 1, awayScore: 3 },
  62: { homeScore: 2, awayScore: 0 },
  63: { homeScore: 3, awayScore: 1 },
  64: { homeScore: 2, awayScore: 1 },
  65: { homeScore: 3, awayScore: 0 },
  66: { homeScore: 2, awayScore: 2 },
  67: { homeScore: 2, awayScore: 2 },
  68: { homeScore: 1, awayScore: 0 },
  69: { homeScore: 0, awayScore: 3 },
  70: { homeScore: 2, awayScore: 2 },
  71: { homeScore: 4, awayScore: 1 },
  72: { homeScore: 0, awayScore: 1 },
}

function getTeamInGroup(groupId: string, pos: number): ITeam {
  return teams.filter((t: ITeam) => t.groupId === groupId)[pos]
}

function getTeamName(teamId: string): string {
  return teamsMap.get(teamId)?.name ?? teamId
}

function getCountryCode(teamId: string): string {
  return teamsMap.get(teamId)?.countryCode ?? '??'
}

function buildStandings(): IGroupStanding[] {
  const allStandings: IGroupStanding[] = []
  const pairings: number[][] = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]]

  const scheduleByGroup = new Map<string, IGroupMatch[]>()
  for (const entry of groupSchedule) {
    const list = scheduleByGroup.get(entry.groupId) ?? []
    list.push(entry)
    scheduleByGroup.set(entry.groupId, list)
  }

  for (const groupId of groupOrder) {
    const groupTeams: ITeam[] = teams.filter((t: ITeam) => t.groupId === groupId)
    const groupEntries: IGroupMatch[] = scheduleByGroup.get(groupId) ?? []
    const stats: Record<string, { pts: number; gf: number; ga: number }> = {}

    for (const t of groupTeams) {
      stats[t.id] = { pts: 0, gf: 0, ga: 0 }
    }

    for (let i = 0; i < 6; i++) {
      const [h, a] = pairings[i]
      const sched = groupEntries[i]
      if (!sched) continue
      const result = groupResults[sched.matchNumber]
      if (!result) continue

      const homeId: string = groupTeams[h].id
      const awayId: string = groupTeams[a].id

      stats[homeId].gf += result.homeScore
      stats[homeId].ga += result.awayScore
      stats[awayId].gf += result.awayScore
      stats[awayId].ga += result.homeScore

      if (result.homeScore > result.awayScore) {
        stats[homeId].pts += 3
      } else if (result.awayScore > result.homeScore) {
        stats[awayId].pts += 3
      } else {
        stats[homeId].pts += 1
        stats[awayId].pts += 1
      }
    }

    const sorted: string[] = Object.entries(stats)
      .sort(([, a], [, b]) => {
        if (b.pts !== a.pts) return b.pts - a.pts
        const gdA: number = a.gf - a.ga
        const gdB: number = b.gf - b.ga
        if (gdB !== gdA) return gdB - gdA
        return b.gf - a.gf
      })
      .map(([id]) => id)

    sorted.forEach((teamId: string, i: number) => {
      const s = stats[teamId]
      allStandings.push({
        teamId,
        teamName: getTeamName(teamId),
        countryCode: getCountryCode(teamId),
        groupId,
        pts: s.pts,
        gd: s.gf - s.ga,
        gf: s.gf,
        rank: i + 1,
      })
    })
  }

  return allStandings
}

function getThirdPlaceRanking(standings: IGroupStanding[]): IGroupStanding[] {
  return standings
    .filter((s: IGroupStanding) => s.rank === 3)
    .sort((a: IGroupStanding, b: IGroupStanding) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      if (b.gd !== a.gd) return b.gd - a.gd
      return b.gf - a.gf
    })
}

function assignThirdPlaceTeams(
  thirdRanking: IGroupStanding[],
  slots: { groups: string[] }[],
): string[] {
  const remaining = [...thirdRanking]
  return slots.map(slot => {
    const idx = remaining.findIndex(t => slot.groups.includes(t.groupId))
    if (idx === -1) return 'TBD'
    const teamId = remaining[idx].teamId
    remaining.splice(idx, 1)
    return teamId
  })
}

const KO_SCHEDULE: Record<string, { date: string; stadium: string }> = {}
for (const s of r32Schedule) KO_SCHEDULE[s.id] = { date: s.date, stadium: s.stadium }
for (const s of r16Schedule) KO_SCHEDULE[s.id] = { date: s.date, stadium: s.stadium }
for (const s of qfSchedule) KO_SCHEDULE[s.id] = { date: s.date, stadium: s.stadium }
for (const s of sfSchedule) KO_SCHEDULE[s.id] = { date: s.date, stadium: s.stadium }
KO_SCHEDULE['Final'] = { date: finalSchedule.date, stadium: finalSchedule.stadium }
KO_SCHEDULE['3RD'] = { date: thirdSchedule.date, stadium: thirdSchedule.stadium }

const KO_LABELS: Record<string, string> = {}
for (const s of r32Schedule) KO_LABELS[s.id] = s.label
for (const s of r16Schedule) KO_LABELS[s.id] = s.label
for (const s of qfSchedule) KO_LABELS[s.id] = s.label
for (const s of sfSchedule) KO_LABELS[s.id] = s.label
KO_LABELS['Final'] = finalSchedule.label
KO_LABELS['3RD'] = thirdSchedule.label

function attachSchedule(r: IKnockoutResult): IKnockoutResult {
  const sched = KO_SCHEDULE[r.matchId] ?? { date: '', stadium: '' }
  return { ...r, date: sched.date, stadium: sched.stadium, label: KO_LABELS[r.matchId] ?? '' }
}

function buildKnockoutResults(standings: IGroupStanding[]): IKnockoutResult[] {
  const first: Record<string, IGroupStanding> = {}
  const second: Record<string, IGroupStanding> = {}
  for (const s of standings) {
    if (s.rank === 1) first[s.groupId] = s
    if (s.rank === 2) second[s.groupId] = s
  }

  const thirdRanking: IGroupStanding[] = getThirdPlaceRanking(standings)

  const thirdGroupSets: { groups: string[] }[] = [
    { groups: ['A', 'B', 'C', 'D', 'F'] },
    { groups: ['C', 'D', 'F', 'G', 'H'] },
    { groups: ['B', 'E', 'F', 'I', 'J'] },
    { groups: ['A', 'E', 'H', 'I', 'J'] },
    { groups: ['C', 'E', 'F', 'H', 'I'] },
    { groups: ['E', 'H', 'I', 'J', 'K'] },
    { groups: ['E', 'F', 'G', 'I', 'J'] },
    { groups: ['D', 'E', 'I', 'J', 'L'] },
  ]
  const thirdTeamIds: string[] = assignThirdPlaceTeams(thirdRanking, thirdGroupSets)

  function tId(s: IGroupStanding | undefined): string { return s?.teamId ?? 'TBD' }

  const r32Pairs: { home: string; away: string }[] = [
    { home: tId(first.E), away: thirdTeamIds[0] },
    { home: tId(first.I), away: thirdTeamIds[1] },
    { home: tId(second.A), away: tId(second.B) },
    { home: tId(first.F), away: tId(second.C) },
    { home: tId(second.K), away: tId(second.L) },
    { home: tId(first.H), away: tId(second.J) },
    { home: tId(first.D), away: thirdTeamIds[2] },
    { home: tId(first.G), away: thirdTeamIds[3] },
    { home: tId(first.C), away: tId(second.F) },
    { home: tId(second.E), away: tId(second.I) },
    { home: tId(first.A), away: thirdTeamIds[4] },
    { home: tId(first.L), away: thirdTeamIds[5] },
    { home: tId(first.J), away: tId(second.H) },
    { home: tId(second.D), away: tId(second.G) },
    { home: tId(first.B), away: thirdTeamIds[6] },
    { home: tId(first.K), away: thirdTeamIds[7] },
  ]

  const r32scores: number[][] = [
    [2, 0], [1, 0], [1, 1, 0, 0, 4, 2], [3, 1], [2, 0], [0, 0, 0, 0, 5, 4], [2, 1], [1, 1, 0, 0, 3, 1],
    [2, 0], [1, 2], [3, 0], [1, 1, 0, 0, 4, 5], [0, 2], [2, 1], [1, 0], [2, 2, 0, 0, 5, 3],
  ]

  function resolveWinner(home: string, away: string, scores: number[]): {
    homeS: number; awayS: number; winner: string;
    extraHome?: number; extraAway?: number;
    penaltyHome?: number; penaltyAway?: number;
  } {
    const extraHome = scores.length >= 6 ? scores[2] : 0
    const extraAway = scores.length >= 6 ? scores[3] : 0
    const homeS: number = scores[0] + extraHome
    const awayS: number = scores[1] + extraAway
    const penaltyHome = scores.length >= 6 ? scores[4] : undefined
    const penaltyAway = scores.length >= 6 ? scores[5] : undefined
    let winner: string
    if (scores.length >= 6) {
      winner = penaltyHome! > penaltyAway! ? home : away
    } else {
      winner = homeS > awayS ? home : away
    }
    return {
      homeS, awayS, winner,
      extraHome: scores.length >= 6 ? scores[2] : undefined,
      extraAway: scores.length >= 6 ? scores[3] : undefined,
      penaltyHome: scores.length >= 6 ? scores[4] : undefined,
      penaltyAway: scores.length >= 6 ? scores[5] : undefined,
    }
  }

  const results: IKnockoutResult[] = []

  const r32results: IKnockoutResult[] = r32Pairs.map((pair, i) => {
    const scores: number[] = r32scores[i]
    const resolved = resolveWinner(pair.home, pair.away, scores)
    return attachSchedule({
      matchId: `R32-${i + 1}`,
      homeTeamId: pair.home,
      homeTeamName: getTeamName(pair.home),
      homeCountryCode: getCountryCode(pair.home),
      awayTeamId: pair.away,
      awayTeamName: getTeamName(pair.away),
      awayCountryCode: getCountryCode(pair.away),
      homeScore: resolved.homeS,
      awayScore: resolved.awayS,
      extraHomeScore: resolved.extraHome,
      extraAwayScore: resolved.extraAway,
      penaltyHomeScore: resolved.penaltyHome,
      penaltyAwayScore: resolved.penaltyAway,
      winnerTeamId: resolved.winner,
      loserTeamId: resolved.winner === pair.home ? pair.away : pair.home,
    })
  })
  results.push(...r32results)

  function buildNextRound(
    prevResults: IKnockoutResult[],
    roundPrefix: string,
    pairings: number[][],
    scores: number[][],
  ): IKnockoutResult[] {
    return pairings.map(([a, b], i) => {
      const homeTeam: string = prevResults[a].winnerTeamId
      const awayTeam: string = prevResults[b].winnerTeamId
      const sc: number[] = scores[i] ?? [0, 0]
      const resolved = resolveWinner(homeTeam, awayTeam, sc)
      return attachSchedule({
        matchId: `${roundPrefix}-${i + 1}`,
        homeTeamId: homeTeam,
        homeTeamName: getTeamName(homeTeam),
        homeCountryCode: getCountryCode(homeTeam),
        awayTeamId: awayTeam,
        awayTeamName: getTeamName(awayTeam),
        awayCountryCode: getCountryCode(awayTeam),
        homeScore: resolved.homeS,
        awayScore: resolved.awayS,
        extraHomeScore: resolved.extraHome,
        extraAwayScore: resolved.extraAway,
        penaltyHomeScore: resolved.penaltyHome,
        penaltyAwayScore: resolved.penaltyAway,
        winnerTeamId: resolved.winner,
        loserTeamId: resolved.winner === homeTeam ? awayTeam : homeTeam,
      })
    })
  }

  const r16Pairs: number[][] = [[2, 3], [0, 1], [8, 9], [10, 11], [5, 4], [7, 6], [13, 15], [14, 12]]
  const r16scores: number[][] = [[2, 0], [1, 0], [2, 2, 0, 0, 4, 3], [1, 0], [2, 1], [0, 0, 0, 0, 3, 2], [2, 0], [1, 1, 0, 0, 5, 4]]
  const r16results = buildNextRound(r32results, 'R16', r16Pairs, r16scores)
  results.push(...r16results)

  const qfPairs: number[][] = [[0, 1], [2, 3], [4, 5], [6, 7]]
  const qfscores: number[][] = [[1, 0], [2, 2, 0, 0, 4, 2], [1, 1, 0, 0, 3, 4], [2, 0]]
  const qfresults = buildNextRound(r16results, 'QF', qfPairs, qfscores)
  results.push(...qfresults)

  const sfPairs: number[][] = [[0, 1], [2, 3]]
  const sfscores: number[][] = [[2, 1], [0, 0, 0, 0, 5, 4]]
  const sfresults = buildNextRound(qfresults, 'SF', sfPairs, sfscores)
  results.push(...sfresults)

  const finalScores: number[] = [1, 0]
  const finalWinner = resolveWinner(sfresults[0].winnerTeamId, sfresults[1].winnerTeamId, finalScores)
  results.push(attachSchedule({
    matchId: 'FINAL',
    homeTeamId: sfresults[0].winnerTeamId,
    homeTeamName: getTeamName(sfresults[0].winnerTeamId),
    homeCountryCode: getCountryCode(sfresults[0].winnerTeamId),
    awayTeamId: sfresults[1].winnerTeamId,
    awayTeamName: getTeamName(sfresults[1].winnerTeamId),
    awayCountryCode: getCountryCode(sfresults[1].winnerTeamId),
    homeScore: finalWinner.homeS,
    awayScore: finalWinner.awayS,
    extraHomeScore: finalWinner.extraHome,
    extraAwayScore: finalWinner.extraAway,
    penaltyHomeScore: finalWinner.penaltyHome,
    penaltyAwayScore: finalWinner.penaltyAway,
    winnerTeamId: finalWinner.winner,
    loserTeamId: finalWinner.winner === sfresults[0].winnerTeamId ? sfresults[1].winnerTeamId : sfresults[0].winnerTeamId,
  }))

  const thirdScores: number[] = [2, 1]
  const thirdWinner = resolveWinner(sfresults[0].loserTeamId, sfresults[1].loserTeamId, thirdScores)
  results.push(attachSchedule({
    matchId: '3RD',
    homeTeamId: sfresults[0].loserTeamId,
    homeTeamName: getTeamName(sfresults[0].loserTeamId),
    homeCountryCode: getCountryCode(sfresults[0].loserTeamId),
    awayTeamId: sfresults[1].loserTeamId,
    awayTeamName: getTeamName(sfresults[1].loserTeamId),
    awayCountryCode: getCountryCode(sfresults[1].loserTeamId),
    homeScore: thirdWinner.homeS,
    awayScore: thirdWinner.awayS,
    extraHomeScore: thirdWinner.extraHome,
    extraAwayScore: thirdWinner.extraAway,
    penaltyHomeScore: thirdWinner.penaltyHome,
    penaltyAwayScore: thirdWinner.penaltyAway,
    winnerTeamId: thirdWinner.winner,
    loserTeamId: thirdWinner.winner === sfresults[0].loserTeamId ? sfresults[1].loserTeamId : sfresults[0].loserTeamId,
  }))

  return results
}

const R32_LABELS: string[] = r32Schedule.map(s => s.label)
const R16_LABELS: string[] = r16Schedule.map(s => s.label)
const QF_LABELS: string[] = qfSchedule.map(s => s.label)
const SF_LABELS: string[] = sfSchedule.map(s => s.label)

function buildPlaceholderRound(prefix: string, labels: string[], schedule: { id: string; date: string; stadium: string }[], roundKey: string): IBracketSlotWithTeams[] {
  return labels.map((label: string, i: number) => ({
    id: `${prefix}-${i + 1}`,
    round: roundKey,
    homeTeamId: label.split(' vs ')[0] ?? '',
    homeTeamName: label.split(' vs ')[0] ?? '',
    homeCountryCode: '??',
    awayTeamId: label.split(' vs ')[1] ?? '',
    awayTeamName: label.split(' vs ')[1] ?? '',
    awayCountryCode: '??',
    homeScore: null,
    awayScore: null,
    date: schedule[i]?.date ?? '',
    stadium: schedule[i]?.stadium ?? '',
    label,
  }))
}

export function getBracketSlotsWithTeams(): Record<string, IBracketSlotWithTeams[]> {
  if (MOCK_SCENARIO === 'real') {
    return {
      R32: buildPlaceholderRound('R32', R32_LABELS, r32Schedule, 'R32'),
      R16: buildPlaceholderRound('R16', R16_LABELS, r16Schedule, 'R16'),
      QF: buildPlaceholderRound('QF', QF_LABELS, qfSchedule, 'QF'),
      SF: buildPlaceholderRound('SF', SF_LABELS, sfSchedule, 'SF'),
      FINAL: [{
        id: 'Final',
        round: 'FINAL',
        homeTeamId: 'Ganador SF-1',
        homeTeamName: 'Ganador SF-1',
        homeCountryCode: '??',
        awayTeamId: 'Ganador SF-2',
        awayTeamName: 'Ganador SF-2',
        awayCountryCode: '??',
        homeScore: null,
        awayScore: null,
        date: finalSchedule.date,
        stadium: finalSchedule.stadium,
        label: finalSchedule.label,
      }],
      '3RD': [{
        id: '3rd',
        round: '3RD',
        homeTeamId: 'Perdedor SF-1',
        homeTeamName: 'Perdedor SF-1',
        homeCountryCode: '??',
        awayTeamId: 'Perdedor SF-2',
        awayTeamName: 'Perdedor SF-2',
        awayCountryCode: '??',
        homeScore: null,
        awayScore: null,
        date: thirdSchedule.date,
        stadium: thirdSchedule.stadium,
        label: thirdSchedule.label,
      }],
    }
  }

  if (MOCK_SCENARIO === 'r32_mid') {
    const standings: IGroupStanding[] = buildStandings()
    const knockoutResults: IKnockoutResult[] = buildKnockoutResults(standings)
    const allR32: IKnockoutResult[] = knockoutResults.filter((r: IKnockoutResult) => r.matchId.startsWith('R32'))

    const r32Slots: IBracketSlotWithTeams[] = allR32.map((r: IKnockoutResult, i: number) => {
      const hasScore: boolean = i < 8
      return {
        id: r.matchId,
        round: 'R32',
        homeTeamId: r.homeTeamId,
        homeTeamName: r.homeTeamName,
        homeCountryCode: r.homeCountryCode,
        awayTeamId: r.awayTeamId,
        awayTeamName: r.awayTeamName,
        awayCountryCode: r.awayCountryCode,
        homeScore: hasScore ? r.homeScore : null,
        awayScore: hasScore ? r.awayScore : null,
        extraHomeScore: hasScore ? r.extraHomeScore : null,
        extraAwayScore: hasScore ? r.extraAwayScore : null,
        penaltyHomeScore: hasScore ? r.penaltyHomeScore : null,
        penaltyAwayScore: hasScore ? r.penaltyAwayScore : null,
        date: r.date,
        stadium: r.stadium,
        label: r.label,
      }
    })

    // Prueba: forzar R32-9 (últimos 8, sin score) a fecha pasada → form deshabilitado
    if (r32Slots.length > 8) {
      r32Slots[8].date = '2026-06-09T19:00:00Z'
    }

    return {
      R32: r32Slots,
      R16: buildPlaceholderRound('R16', R16_LABELS, r16Schedule, 'R16'),
      QF: buildPlaceholderRound('QF', QF_LABELS, qfSchedule, 'QF'),
      SF: buildPlaceholderRound('SF', SF_LABELS, sfSchedule, 'SF'),
      FINAL: [{
        id: 'Final',
        round: 'FINAL',
        homeTeamId: 'Ganador SF-1',
        homeTeamName: 'Ganador SF-1',
        homeCountryCode: '??',
        awayTeamId: 'Ganador SF-2',
        awayTeamName: 'Ganador SF-2',
        awayCountryCode: '??',
        homeScore: null,
        awayScore: null,
        date: finalSchedule.date,
        stadium: finalSchedule.stadium,
        label: finalSchedule.label,
      }],
      '3RD': [{
        id: '3rd',
        round: '3RD',
        homeTeamId: 'Perdedor SF-1',
        homeTeamName: 'Perdedor SF-1',
        homeCountryCode: '??',
        awayTeamId: 'Perdedor SF-2',
        awayTeamName: 'Perdedor SF-2',
        awayCountryCode: '??',
        homeScore: null,
        awayScore: null,
        date: thirdSchedule.date,
        stadium: thirdSchedule.stadium,
        label: thirdSchedule.label,
      }],
    }
  }

  const standings: IGroupStanding[] = buildStandings()
  const knockoutResults: IKnockoutResult[] = buildKnockoutResults(standings)

  const rounds: string[] = ['R32', 'R16', 'QF', 'SF', 'FINAL', '3RD']

  function makeSlots(results: IKnockoutResult[]): IBracketSlotWithTeams[] {
    return results.map((r: IKnockoutResult) => ({
      id: r.matchId,
      round: r.matchId.startsWith('3RD') ? '3RD' : r.matchId.startsWith('FINAL') ? 'FINAL' : r.matchId.split('-')[0],
      homeTeamId: r.homeTeamId,
      homeTeamName: r.homeTeamName,
      homeCountryCode: r.homeCountryCode,
      awayTeamId: r.awayTeamId,
      awayTeamName: r.awayTeamName,
      awayCountryCode: r.awayCountryCode,
      homeScore: r.homeScore,
      awayScore: r.awayScore,
      extraHomeScore: r.extraHomeScore,
      extraAwayScore: r.extraAwayScore,
      penaltyHomeScore: r.penaltyHomeScore,
      penaltyAwayScore: r.penaltyAwayScore,
      date: r.date,
      stadium: r.stadium,
      label: r.label,
    }))
  }

  const result: Record<string, IBracketSlotWithTeams[]> = {}
  for (const round of rounds) {
    result[round] = makeSlots(knockoutResults.filter((r: IKnockoutResult) => {
      if (round === '3RD') return r.matchId === '3RD'
      if (round === 'FINAL') return r.matchId === 'FINAL'
      return r.matchId.startsWith(round)
    }))
  }

  // Prueba: forzar R32-1 como fecha pasada sin resultado (form deshabilitado)
  const r32Test = result['R32']
  if (r32Test && r32Test.length > 0) {
    r32Test[0].date = '2026-06-09T19:00:00Z'
    r32Test[0].homeScore = null
    r32Test[0].awayScore = null
  }

  return result
}

export function getBracketSummary(): {
  champion: string
  runnerUp: string
  thirdPlace: string
  championCode: string
} {
  const slots: Record<string, IBracketSlotWithTeams[]> = getBracketSlotsWithTeams()
  const finalMatch: IBracketSlotWithTeams | undefined = slots['FINAL']?.[0]
  const thirdMatch: IBracketSlotWithTeams | undefined = slots['3RD']?.[0]

  return {
    champion: finalMatch?.homeTeamName ?? '—',
    runnerUp: finalMatch?.awayTeamName ?? '—',
    thirdPlace: thirdMatch?.winner ?? thirdMatch?.homeTeamName ?? '—',
    championCode: finalMatch?.homeCountryCode ?? '—',
  }
}

export type { IBracketSlotWithTeams, IKnockoutResult, IGroupStanding }
