import { describe, it, expect } from 'vitest'
import { getBracketTree, getBracketSlotsByRound, getBracketSlotsFromMatches } from './bracketService'
import { EKnockoutRound, type IMatch, type ITeam } from '@/core/types'
import type { IBracketSlot, IBracketSlotWithTeams } from './bracketService'

const mockMatches: IMatch[] = [
  {
    id: 'R32-1',
    groupId: null,
    round: 'R32',
    matchNumber: 73,
    homeTeamId: 'T01',
    awayTeamId: 'T02',
    date: '2026-06-13T13:00:00-06:00',
    stadium: 'Estadio Azteca',
    status: 'scheduled',
  },
  {
    id: 'R16-1',
    groupId: null,
    round: 'R16',
    matchNumber: 89,
    homeTeamId: 'T01',
    awayTeamId: 'T09',
    date: '2026-06-20T13:00:00-06:00',
    stadium: 'Estadio Azteca',
    status: 'scheduled',
  },
  {
    id: 'Final',
    groupId: null,
    round: 'Final',
    matchNumber: 104,
    homeTeamId: 'T01',
    awayTeamId: 'T05',
    date: '2026-07-19T12:00:00-06:00',
    stadium: 'MetLife Stadium',
    status: 'scheduled',
  },
]

const mockTeamsMap: Map<string, ITeam> = new Map([
  ['T01', { id: 'T01', name: 'Mexico', countryCode: 'MX', groupId: 'A' }],
  ['T02', { id: 'T02', name: 'Canada', countryCode: 'CA', groupId: 'A' }],
  ['T05', { id: 'T05', name: 'Argentina', countryCode: 'AR', groupId: 'C' }],
  ['T09', { id: 'T09', name: 'Brazil', countryCode: 'BR', groupId: 'E' }],
])

describe('bracketService', () => {
  describe('getBracketTree', () => {
    it('returns all 32 slots (16 R32 + 8 R16 + 4 QF + 2 SF + 1 Final + 1 3rd)', () => {
      const slots: IBracketSlot[] = getBracketTree()
      expect(slots).toHaveLength(32)
    })

    it('has correct distribution by round', () => {
      const slots: IBracketSlot[] = getBracketTree()
      const r32: IBracketSlot[] = slots.filter((s: IBracketSlot) => s.round === EKnockoutRound.R32)
      const r16: IBracketSlot[] = slots.filter((s: IBracketSlot) => s.round === EKnockoutRound.R16)
      const qf: IBracketSlot[] = slots.filter((s: IBracketSlot) => s.round === EKnockoutRound.QF)
      const sf: IBracketSlot[] = slots.filter((s: IBracketSlot) => s.round === EKnockoutRound.SF)
      const final: IBracketSlot[] = slots.filter((s: IBracketSlot) => s.round === EKnockoutRound.FINAL)
      const third: IBracketSlot[] = slots.filter((s: IBracketSlot) => s.round === EKnockoutRound.THIRD_PLACE)
      expect(r32).toHaveLength(16)
      expect(r16).toHaveLength(8)
      expect(qf).toHaveLength(4)
      expect(sf).toHaveLength(2)
      expect(final).toHaveLength(1)
      expect(third).toHaveLength(1)
    })

    it('all slots have required fields', () => {
      const slots: IBracketSlot[] = getBracketTree()
      for (const slot of slots) {
        expect(slot.id).toBeTruthy()
        expect(slot.label).toBeTruthy()
        expect(slot.round).toBeTruthy()
      }
    })
  })

  describe('getBracketSlotsByRound', () => {
    it('groups slots by round', () => {
      const grouped: Record<string, IBracketSlot[]> = getBracketSlotsByRound()
      expect(grouped[EKnockoutRound.R32]).toHaveLength(16)
      expect(grouped[EKnockoutRound.R16]).toHaveLength(8)
      expect(grouped[EKnockoutRound.QF]).toHaveLength(4)
      expect(grouped[EKnockoutRound.SF]).toHaveLength(2)
      expect(grouped[EKnockoutRound.FINAL]).toHaveLength(1)
      expect(grouped[EKnockoutRound.THIRD_PLACE]).toHaveLength(1)
    })
  })

  describe('getBracketSlotsFromMatches', () => {
    it('enriches matches with team info', () => {
      const slots: IBracketSlotWithTeams[] = getBracketSlotsFromMatches(mockMatches, mockTeamsMap)
      const r32: IBracketSlotWithTeams | undefined = slots.find(s => s.id === 'R32-1')
      expect(r32).toBeDefined()
      expect(r32?.homeTeamName).toBe('Mexico')
      expect(r32?.homeCountryCode).toBe('MX')
      expect(r32?.awayTeamName).toBe('Canada')
    })

    it('returns empty array for empty matches', () => {
      const slots: IBracketSlotWithTeams[] = getBracketSlotsFromMatches([], mockTeamsMap)
      expect(slots).toHaveLength(0)
    })

    it('handles unknown teams gracefully', () => {
      const slots: IBracketSlotWithTeams[] = getBracketSlotsFromMatches(mockMatches, new Map())
      const r16: IBracketSlotWithTeams | undefined = slots.find(s => s.id === 'R16-1')
      expect(r16?.homeTeamName).toBe('T01')
      expect(r16?.homeCountryCode).toBe('')
    })
  })
})
