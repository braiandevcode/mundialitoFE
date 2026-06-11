import { EKnockoutRound, type TKnockoutRound, type IMatch, type ITeam } from '@/core/types'

export interface IBracketSlot {
  id: string
  label: string
  round: TKnockoutRound
}

export interface IBracketSlotWithTeams {
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
  extraHomeScore: number | null
  extraAwayScore: number | null
  penaltyHomeScore: number | null
  penaltyAwayScore: number | null
  date: string
  stadium: string
  label: string
}

function getRoundLabel(round: string): string {
  const labels: Record<string, string> = {
    R32: '16avos de final',
    R16: 'Octavos de final',
    QF: 'Cuartos de final',
    SF: 'Semifinal',
    Final: 'Final',
    '3rd': 'Tercer puesto',
  }
  return labels[round] ?? round
}

export function getBracketSlotsFromMatches(
  matches: IMatch[],
  teamsMap: Map<string, ITeam>,
): IBracketSlotWithTeams[] {
  return matches.map((m: IMatch) => {
    const home: ITeam | undefined = teamsMap.get(m.homeTeamId)
    const away: ITeam | undefined = teamsMap.get(m.awayTeamId)
    return {
      id: m.id,
      round: m.round ?? '',
      homeTeamId: m.homeTeamId,
      homeTeamName: home?.name ?? m.homeTeamId,
      homeCountryCode: home?.countryCode ?? '',
      awayTeamId: m.awayTeamId,
      awayTeamName: away?.name ?? m.awayTeamId,
      awayCountryCode: away?.countryCode ?? '',
      homeScore: m.homeScore ?? null,
      awayScore: m.awayScore ?? null,
      extraHomeScore: m.extraHomeScore ?? null,
      extraAwayScore: m.extraAwayScore ?? null,
      penaltyHomeScore: m.penaltyHomeScore ?? null,
      penaltyAwayScore: m.penaltyAwayScore ?? null,
      date: m.date,
      stadium: m.stadium,
      label: getRoundLabel(m.round ?? ''),
    }
  })
}

const POSITION_LABELS: Record<string, string> = {
  'R32-1': '2° A vs 2° B',
  'R32-2': '1° E vs 3° *',
  'R32-3': '1° F vs 2° C',
  'R32-4': '1° C vs 2° F',
  'R32-5': '1° I vs 3° *',
  'R32-6': '2° E vs 2° I',
  'R32-7': '1° A vs 3° *',
  'R32-8': '1° L vs 3° *',
  'R32-9': '1° D vs 3° *',
  'R32-10': '1° G vs 3° *',
  'R32-11': '2° K vs 2° L',
  'R32-12': '1° H vs 2° J',
  'R32-13': '1° B vs 3° *',
  'R32-14': '1° J vs 2° H',
  'R32-15': '1° K vs 3° *',
  'R32-16': '2° D vs 2° G',
  'R16-1': 'Gan R32-2 vs Gan R32-5',
  'R16-2': 'Gan R32-1 vs Gan R32-3',
  'R16-3': 'Gan R32-4 vs Gan R32-6',
  'R16-4': 'Gan R32-7 vs Gan R32-8',
  'R16-5': 'Gan R32-11 vs Gan R32-12',
  'R16-6': 'Gan R32-9 vs Gan R32-10',
  'R16-7': 'Gan R32-14 vs Gan R32-16',
  'R16-8': 'Gan R32-13 vs Gan R32-15',
  'QF-1': 'Gan R16-1 vs Gan R16-2',
  'QF-2': 'Gan R16-5 vs Gan R16-6',
  'QF-3': 'Gan R16-3 vs Gan R16-4',
  'QF-4': 'Gan R16-7 vs Gan R16-8',
  'SF-1': 'Gan QF-1 vs Gan QF-2',
  'SF-2': 'Gan QF-3 vs Gan QF-4',
  'Final': 'Gan SF-1 vs Gan SF-2',
  '3rd': 'Perd SF-1 vs Perd SF-2',
}

export function getPositionLabel(id: string): string {
  return POSITION_LABELS[id] ?? id
}

const TREE_ROUNDS: { id: string; label: string; round: EKnockoutRound }[] = [
  ...Array.from({ length: 16 }, (_, i) => ({ id: `R32-${i + 1}`, label: POSITION_LABELS[`R32-${i + 1}`] ?? `R32-${i + 1}`, round: EKnockoutRound.R32 })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `R16-${i + 1}`, label: POSITION_LABELS[`R16-${i + 1}`] ?? `R16-${i + 1}`, round: EKnockoutRound.R16 })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: `QF-${i + 1}`, label: POSITION_LABELS[`QF-${i + 1}`] ?? `QF-${i + 1}`, round: EKnockoutRound.QF })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `SF-${i + 1}`, label: POSITION_LABELS[`SF-${i + 1}`] ?? `SF-${i + 1}`, round: EKnockoutRound.SF })),
  { id: 'Final', label: POSITION_LABELS['Final'] ?? 'Final', round: EKnockoutRound.FINAL },
  { id: '3rd', label: POSITION_LABELS['3rd'] ?? 'Tercer puesto', round: EKnockoutRound.THIRD_PLACE },
]

export function getBracketTree(): IBracketSlot[] {
  return TREE_ROUNDS
}

export function getBracketSlotsByRound(): Record<string, IBracketSlot[]> {
  const all: IBracketSlot[] = getBracketTree()
  return {
    [EKnockoutRound.R32]: all.filter((s: IBracketSlot) => s.round === EKnockoutRound.R32),
    [EKnockoutRound.R16]: all.filter((s: IBracketSlot) => s.round === EKnockoutRound.R16),
    [EKnockoutRound.QF]: all.filter((s: IBracketSlot) => s.round === EKnockoutRound.QF),
    [EKnockoutRound.SF]: all.filter((s: IBracketSlot) => s.round === EKnockoutRound.SF),
    [EKnockoutRound.FINAL]: all.filter((s: IBracketSlot) => s.round === EKnockoutRound.FINAL),
    [EKnockoutRound.THIRD_PLACE]: all.filter((s: IBracketSlot) => s.round === EKnockoutRound.THIRD_PLACE),
  }
}
