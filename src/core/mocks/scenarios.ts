import { EMatchStatus } from '../types'

export type TMockScenario = 'real' | 'live' | 'completed' | 'r32_mid'

export const MOCK_SCENARIO: TMockScenario = 'r32_mid'

export interface IMatchResult {
  homeScore: number
  awayScore: number
}

type TResultMap = Record<number, IMatchResult>

// Escenario 'real': sin resultados, todo por jugar
const emptyResults: TResultMap = {}

// Escenario 'live': resultados parciales con matchNumbers reales
const liveResults: TResultMap = {
  1: { homeScore: 3, awayScore: 0 },
  2: { homeScore: 1, awayScore: 1 },
  3: { homeScore: 2, awayScore: 1 },
  4: { homeScore: 1, awayScore: 0 },
  5: { homeScore: 3, awayScore: 1 },
  6: { homeScore: 2, awayScore: 1 },
  7: { homeScore: 2, awayScore: 2 },
  8: { homeScore: 0, awayScore: 0 },
}

// Escenario 'completed': resultados asignados a los matchNumbers reales
const completedResults: TResultMap = {
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

export function getGroupResults(): TResultMap {
  switch (MOCK_SCENARIO) {
    case 'real': return emptyResults
    case 'live': return liveResults
    case 'completed':
    case 'r32_mid': return completedResults
  }
}

export function getMatchStatus(matchNumber: number): 'scheduled' | 'live' | 'finished' {
  const results: TResultMap = getGroupResults()
  if (results[matchNumber]) {
    if (MOCK_SCENARIO === 'live' && matchNumber >= 13 && matchNumber <= 14) {
      return 'live' as EMatchStatus.LIVE
    }
    return 'finished' as EMatchStatus.FINISHED
  }
  return 'scheduled' as EMatchStatus.SCHEDULED
}



// ─── Calendario real de fase de grupos ─────────────────────────────────
export interface IGroupMatch {
  id: string
  matchNumber: number
  date: string
  stadium: string
  groupId: string
}

export const groupSchedule: IGroupMatch[] = [
  // Grupo A
  { id: 'M001', matchNumber: 1, date: '2026-06-11T13:00:00-06:00', stadium: 'Estadio Azteca, Mexico City', groupId: 'A' },
  { id: 'M002', matchNumber: 2, date: '2026-06-11T20:00:00-06:00', stadium: 'Estadio Akron, Zapopan', groupId: 'A' },
  { id: 'M025', matchNumber: 25, date: '2026-06-18T12:00:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', groupId: 'A' },
  { id: 'M028', matchNumber: 28, date: '2026-06-18T19:00:00-06:00', stadium: 'Estadio Akron, Zapopan', groupId: 'A' },
  { id: 'M053', matchNumber: 53, date: '2026-06-24T19:00:00-06:00', stadium: 'Estadio Azteca, Mexico City', groupId: 'A' },
  { id: 'M054', matchNumber: 54, date: '2026-06-24T19:00:00-06:00', stadium: 'Estadio BBVA, Guadalupe', groupId: 'A' },
  // Grupo B
  { id: 'M003', matchNumber: 3, date: '2026-06-12T15:00:00-04:00', stadium: 'BMO Field, Toronto', groupId: 'B' },
  { id: 'M008', matchNumber: 8, date: '2026-06-13T12:00:00-07:00', stadium: "Levi's Stadium, Santa Clara", groupId: 'B' },
  { id: 'M026', matchNumber: 26, date: '2026-06-18T12:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', groupId: 'B' },
  { id: 'M027', matchNumber: 27, date: '2026-06-18T15:00:00-07:00', stadium: 'BC Place, Vancouver', groupId: 'B' },
  { id: 'M051', matchNumber: 51, date: '2026-06-24T12:00:00-07:00', stadium: 'BC Place, Vancouver', groupId: 'B' },
  { id: 'M052', matchNumber: 52, date: '2026-06-24T12:00:00-07:00', stadium: 'Lumen Field, Seattle', groupId: 'B' },
  // Grupo C
  { id: 'M007', matchNumber: 7, date: '2026-06-13T18:00:00-04:00', stadium: 'MetLife Stadium, East Rutherford', groupId: 'C' },
  { id: 'M005', matchNumber: 5, date: '2026-06-13T21:00:00-04:00', stadium: 'Gillette Stadium, Foxborough', groupId: 'C' },
  { id: 'M030', matchNumber: 30, date: '2026-06-19T18:00:00-04:00', stadium: 'Gillette Stadium, Foxborough', groupId: 'C' },
  { id: 'M029', matchNumber: 29, date: '2026-06-19T20:30:00-04:00', stadium: 'Lincoln Financial Field, Philadelphia', groupId: 'C' },
  { id: 'M049', matchNumber: 49, date: '2026-06-24T18:00:00-04:00', stadium: 'Hard Rock Stadium, Miami Gardens', groupId: 'C' },
  { id: 'M050', matchNumber: 50, date: '2026-06-24T18:00:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', groupId: 'C' },
  // Grupo D
  { id: 'M004', matchNumber: 4, date: '2026-06-12T18:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', groupId: 'D' },
  { id: 'M006', matchNumber: 6, date: '2026-06-13T21:00:00-07:00', stadium: 'BC Place, Vancouver', groupId: 'D' },
  { id: 'M032', matchNumber: 32, date: '2026-06-19T12:00:00-07:00', stadium: 'Lumen Field, Seattle', groupId: 'D' },
  { id: 'M031', matchNumber: 31, date: '2026-06-19T20:00:00-07:00', stadium: "Levi's Stadium, Santa Clara", groupId: 'D' },
  { id: 'M059', matchNumber: 59, date: '2026-06-25T19:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', groupId: 'D' },
  { id: 'M060', matchNumber: 60, date: '2026-06-25T19:00:00-07:00', stadium: "Levi's Stadium, Santa Clara", groupId: 'D' },
  // Grupo E
  { id: 'M010', matchNumber: 10, date: '2026-06-14T12:00:00-05:00', stadium: 'NRG Stadium, Houston', groupId: 'E' },
  { id: 'M009', matchNumber: 9, date: '2026-06-14T19:00:00-04:00', stadium: 'Lincoln Financial Field, Philadelphia', groupId: 'E' },
  { id: 'M033', matchNumber: 33, date: '2026-06-20T16:00:00-04:00', stadium: 'BMO Field, Toronto', groupId: 'E' },
  { id: 'M034', matchNumber: 34, date: '2026-06-20T19:00:00-05:00', stadium: 'Arrowhead Stadium, Kansas City', groupId: 'E' },
  { id: 'M055', matchNumber: 55, date: '2026-06-25T16:00:00-04:00', stadium: 'Lincoln Financial Field, Philadelphia', groupId: 'E' },
  { id: 'M056', matchNumber: 56, date: '2026-06-25T16:00:00-04:00', stadium: 'MetLife Stadium, East Rutherford', groupId: 'E' },
  // Grupo F
  { id: 'M011', matchNumber: 11, date: '2026-06-14T15:00:00-05:00', stadium: 'AT&T Stadium, Arlington', groupId: 'F' },
  { id: 'M012', matchNumber: 12, date: '2026-06-14T20:00:00-06:00', stadium: 'Estadio BBVA, Guadalupe', groupId: 'F' },
  { id: 'M035', matchNumber: 35, date: '2026-06-20T12:00:00-05:00', stadium: 'NRG Stadium, Houston', groupId: 'F' },
  { id: 'M036', matchNumber: 36, date: '2026-06-20T22:00:00-06:00', stadium: 'Estadio BBVA, Guadalupe', groupId: 'F' },
  { id: 'M057', matchNumber: 57, date: '2026-06-25T18:00:00-05:00', stadium: 'AT&T Stadium, Arlington', groupId: 'F' },
  { id: 'M058', matchNumber: 58, date: '2026-06-25T18:00:00-05:00', stadium: 'Arrowhead Stadium, Kansas City', groupId: 'F' },
  // Grupo G
  { id: 'M016', matchNumber: 16, date: '2026-06-15T12:00:00-07:00', stadium: 'Lumen Field, Seattle', groupId: 'G' },
  { id: 'M015', matchNumber: 15, date: '2026-06-15T18:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', groupId: 'G' },
  { id: 'M039', matchNumber: 39, date: '2026-06-21T12:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', groupId: 'G' },
  { id: 'M040', matchNumber: 40, date: '2026-06-21T18:00:00-07:00', stadium: 'BC Place, Vancouver', groupId: 'G' },
  { id: 'M063', matchNumber: 63, date: '2026-06-26T20:00:00-07:00', stadium: 'Lumen Field, Seattle', groupId: 'G' },
  { id: 'M064', matchNumber: 64, date: '2026-06-26T20:00:00-07:00', stadium: 'BC Place, Vancouver', groupId: 'G' },
  // Grupo H
  { id: 'M014', matchNumber: 14, date: '2026-06-15T12:00:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', groupId: 'H' },
  { id: 'M013', matchNumber: 13, date: '2026-06-15T18:00:00-04:00', stadium: 'Hard Rock Stadium, Miami Gardens', groupId: 'H' },
  { id: 'M038', matchNumber: 38, date: '2026-06-21T12:00:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', groupId: 'H' },
  { id: 'M037', matchNumber: 37, date: '2026-06-21T18:00:00-04:00', stadium: 'Hard Rock Stadium, Miami Gardens', groupId: 'H' },
  { id: 'M065', matchNumber: 65, date: '2026-06-26T19:00:00-05:00', stadium: 'NRG Stadium, Houston', groupId: 'H' },
  { id: 'M066', matchNumber: 66, date: '2026-06-26T18:00:00-06:00', stadium: 'Estadio Akron, Zapopan', groupId: 'H' },
  // Grupo I
  { id: 'M017', matchNumber: 17, date: '2026-06-16T15:00:00-04:00', stadium: 'MetLife Stadium, East Rutherford', groupId: 'I' },
  { id: 'M018', matchNumber: 18, date: '2026-06-16T18:00:00-04:00', stadium: 'Gillette Stadium, Foxborough', groupId: 'I' },
  { id: 'M042', matchNumber: 42, date: '2026-06-22T17:00:00-04:00', stadium: 'Lincoln Financial Field, Philadelphia', groupId: 'I' },
  { id: 'M041', matchNumber: 41, date: '2026-06-22T20:00:00-04:00', stadium: 'MetLife Stadium, East Rutherford', groupId: 'I' },
  { id: 'M061', matchNumber: 61, date: '2026-06-26T15:00:00-04:00', stadium: 'Gillette Stadium, Foxborough', groupId: 'I' },
  { id: 'M062', matchNumber: 62, date: '2026-06-26T15:00:00-04:00', stadium: 'BMO Field, Toronto', groupId: 'I' },
  // Grupo J
  { id: 'M019', matchNumber: 19, date: '2026-06-16T20:00:00-05:00', stadium: 'Arrowhead Stadium, Kansas City', groupId: 'J' },
  { id: 'M020', matchNumber: 20, date: '2026-06-16T21:00:00-07:00', stadium: "Levi's Stadium, Santa Clara", groupId: 'J' },
  { id: 'M043', matchNumber: 43, date: '2026-06-22T12:00:00-05:00', stadium: 'AT&T Stadium, Arlington', groupId: 'J' },
  { id: 'M044', matchNumber: 44, date: '2026-06-22T20:00:00-07:00', stadium: "Levi's Stadium, Santa Clara", groupId: 'J' },
  { id: 'M069', matchNumber: 69, date: '2026-06-27T21:00:00-05:00', stadium: 'Arrowhead Stadium, Kansas City', groupId: 'J' },
  { id: 'M070', matchNumber: 70, date: '2026-06-27T21:00:00-05:00', stadium: 'AT&T Stadium, Arlington', groupId: 'J' },
  // Grupo K
  { id: 'M023', matchNumber: 23, date: '2026-06-17T12:00:00-05:00', stadium: 'NRG Stadium, Houston', groupId: 'K' },
  { id: 'M024', matchNumber: 24, date: '2026-06-17T20:00:00-06:00', stadium: 'Estadio Azteca, Mexico City', groupId: 'K' },
  { id: 'M047', matchNumber: 47, date: '2026-06-23T12:00:00-05:00', stadium: 'NRG Stadium, Houston', groupId: 'K' },
  { id: 'M048', matchNumber: 48, date: '2026-06-23T20:00:00-06:00', stadium: 'Estadio Akron, Zapopan', groupId: 'K' },
  { id: 'M071', matchNumber: 71, date: '2026-06-27T19:30:00-04:00', stadium: 'Hard Rock Stadium, Miami Gardens', groupId: 'K' },
  { id: 'M072', matchNumber: 72, date: '2026-06-27T19:30:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', groupId: 'K' },
  // Grupo L
  { id: 'M022', matchNumber: 22, date: '2026-06-17T15:00:00-05:00', stadium: 'AT&T Stadium, Arlington', groupId: 'L' },
  { id: 'M021', matchNumber: 21, date: '2026-06-17T19:00:00-04:00', stadium: 'BMO Field, Toronto', groupId: 'L' },
  { id: 'M045', matchNumber: 45, date: '2026-06-23T16:00:00-04:00', stadium: 'Gillette Stadium, Foxborough', groupId: 'L' },
  { id: 'M046', matchNumber: 46, date: '2026-06-23T19:00:00-04:00', stadium: 'BMO Field, Toronto', groupId: 'L' },
  { id: 'M067', matchNumber: 67, date: '2026-06-27T17:00:00-04:00', stadium: 'MetLife Stadium, East Rutherford', groupId: 'L' },
  { id: 'M068', matchNumber: 68, date: '2026-06-27T17:00:00-04:00', stadium: 'Lincoln Financial Field, Philadelphia', groupId: 'L' },
]

// ─── Calendario real de llaves ──────────────────────────────────────────
export interface IKODates {
  id: string
  date: string
  stadium: string
  label: string
}

// Dieciseisavos de final — Ronda de 32 (Matches 73-88)
export const r32Schedule: IKODates[] = [
  { id: 'R32-1', date: '2026-06-29T16:30:00-04:00', stadium: 'Gillette Stadium, Foxborough', label: '1E vs 3°ABCDEF' },
  { id: 'R32-2', date: '2026-06-30T17:00:00-04:00', stadium: 'MetLife Stadium, East Rutherford', label: '1I vs 3°CDFGH' },
  { id: 'R32-3', date: '2026-06-28T12:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', label: '2A vs 2B' },
  { id: 'R32-4', date: '2026-06-29T19:00:00-06:00', stadium: 'Estadio BBVA, Guadalupe', label: '1F vs 2C' },
  { id: 'R32-5', date: '2026-07-02T19:00:00-04:00', stadium: 'BMO Field, Toronto', label: '2K vs 2L' },
  { id: 'R32-6', date: '2026-07-02T12:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', label: '1H vs 2J' },
  { id: 'R32-7', date: '2026-07-01T17:00:00-07:00', stadium: "Levi's Stadium, Santa Clara", label: '1D vs 3°BEFIJ' },
  { id: 'R32-8', date: '2026-07-01T13:00:00-07:00', stadium: 'Lumen Field, Seattle', label: '1G vs 3°AEHIJ' },
  { id: 'R32-9', date: '2026-06-29T12:00:00-05:00', stadium: 'NRG Stadium, Houston', label: '1C vs 2F' },
  { id: 'R32-10', date: '2026-06-30T12:00:00-05:00', stadium: 'AT&T Stadium, Arlington', label: '2E vs 2I' },
  { id: 'R32-11', date: '2026-06-30T19:00:00-06:00', stadium: 'Estadio Azteca, Mexico City', label: '1A vs 3°CEFHI' },
  { id: 'R32-12', date: '2026-07-01T12:00:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', label: '1L vs 3°EHIJK' },
  { id: 'R32-13', date: '2026-07-03T18:00:00-04:00', stadium: 'Hard Rock Stadium, Miami Gardens', label: '1J vs 2H' },
  { id: 'R32-14', date: '2026-07-03T13:00:00-05:00', stadium: 'AT&T Stadium, Arlington', label: '2D vs 2G' },
  { id: 'R32-15', date: '2026-07-02T20:00:00-07:00', stadium: 'BC Place, Vancouver', label: '1B vs 3°EFGIJ' },
  { id: 'R32-16', date: '2026-07-03T20:30:00-05:00', stadium: 'Arrowhead Stadium, Kansas City', label: '1K vs 3°DEIJL' },
]

// Octavos de final — Ronda de 16 (Matches 89-96)
export const r16Schedule: IKODates[] = [
  { id: 'R16-1', date: '2026-07-04T17:00:00-04:00', stadium: 'Lincoln Financial Field, Philadelphia', label: 'Ganador R32-3 vs Ganador R32-4' },
  { id: 'R16-2', date: '2026-07-04T12:00:00-05:00', stadium: 'NRG Stadium, Houston', label: 'Ganador R32-1 vs Ganador R32-2' },
  { id: 'R16-3', date: '2026-07-05T16:00:00-04:00', stadium: 'MetLife Stadium, East Rutherford', label: 'Ganador R32-9 vs Ganador R32-10' },
  { id: 'R16-4', date: '2026-07-05T18:00:00-06:00', stadium: 'Estadio Azteca, Mexico City', label: 'Ganador R32-11 vs Ganador R32-12' },
  { id: 'R16-5', date: '2026-07-06T14:00:00-05:00', stadium: 'AT&T Stadium, Arlington', label: 'Ganador R32-6 vs Ganador R32-5' },
  { id: 'R16-6', date: '2026-07-06T17:00:00-07:00', stadium: 'Lumen Field, Seattle', label: 'Ganador R32-8 vs Ganador R32-7' },
  { id: 'R16-7', date: '2026-07-07T12:00:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', label: 'Ganador R32-14 vs Ganador R32-16' },
  { id: 'R16-8', date: '2026-07-07T13:00:00-07:00', stadium: 'BC Place, Vancouver', label: 'Ganador R32-15 vs Ganador R32-13' },
]

// Cuartos de final (Matches 97-100)
export const qfSchedule: IKODates[] = [
  { id: 'QF-1', date: '2026-07-09T16:00:00-04:00', stadium: 'Gillette Stadium, Foxborough', label: 'Ganador R16-1 vs Ganador R16-2' },
  { id: 'QF-2', date: '2026-07-11T17:00:00-04:00', stadium: 'Hard Rock Stadium, Miami Gardens', label: 'Ganador R16-3 vs Ganador R16-4' },
  { id: 'QF-3', date: '2026-07-10T12:00:00-07:00', stadium: 'SoFi Stadium, Inglewood', label: 'Ganador R16-5 vs Ganador R16-6' },
  { id: 'QF-4', date: '2026-07-11T20:00:00-05:00', stadium: 'Arrowhead Stadium, Kansas City', label: 'Ganador R16-7 vs Ganador R16-8' },
]

// Semifinales (Matches 101-102)
export const sfSchedule: IKODates[] = [
  { id: 'SF-1', date: '2026-07-14T14:00:00-05:00', stadium: 'AT&T Stadium, Arlington', label: 'Ganador QF-1 vs Ganador QF-2' },
  { id: 'SF-2', date: '2026-07-15T15:00:00-04:00', stadium: 'Mercedes-Benz Stadium, Atlanta', label: 'Ganador QF-3 vs Ganador QF-4' },
]

// Tercer puesto (Match 103)
export const thirdSchedule: IKODates = {
  id: '3rd',
  date: '2026-07-18T17:00:00-04:00',
  stadium: 'Hard Rock Stadium, Miami Gardens',
  label: 'Perdedor SF-1 vs Perdedor SF-2',
}

// Final (Match 104)
export const finalSchedule: IKODates = {
  id: 'Final',
  date: '2026-07-19T15:00:00-04:00',
  stadium: 'MetLife Stadium, East Rutherford',
  label: 'Ganador SF-1 vs Ganador SF-2',
}

// Estadios asignados a cada grupo
export const groupStadiums: Record<string, string> = {
  A: 'Estadio Azteca, Mexico City / Estadio Akron, Zapopan / Mercedes-Benz Stadium, Atlanta',
  B: 'BMO Field, Toronto / Levi\'s Stadium, Santa Clara / SoFi Stadium, Inglewood / BC Place, Vancouver',
  C: 'MetLife Stadium, East Rutherford / Gillette Stadium, Foxborough / Lincoln Financial Field, Philadelphia / Hard Rock Stadium, Miami Gardens / Mercedes-Benz Stadium, Atlanta',
  D: 'SoFi Stadium, Inglewood / BC Place, Vancouver / Lumen Field, Seattle / Levi\'s Stadium, Santa Clara',
  E: 'NRG Stadium, Houston / Lincoln Financial Field, Philadelphia / BMO Field, Toronto / Arrowhead Stadium, Kansas City / MetLife Stadium, East Rutherford',
  F: 'AT&T Stadium, Arlington / Estadio BBVA, Guadalupe / NRG Stadium, Houston / Arrowhead Stadium, Kansas City',
  G: 'Lumen Field, Seattle / SoFi Stadium, Inglewood / BC Place, Vancouver',
  H: 'Mercedes-Benz Stadium, Atlanta / Hard Rock Stadium, Miami Gardens / NRG Stadium, Houston / Estadio Akron, Zapopan',
  I: 'MetLife Stadium, East Rutherford / Gillette Stadium, Foxborough / Lincoln Financial Field, Philadelphia / BMO Field, Toronto',
  J: 'Arrowhead Stadium, Kansas City / Levi\'s Stadium, Santa Clara / AT&T Stadium, Arlington',
  K: 'NRG Stadium, Houston / Estadio Azteca, Mexico City / Estadio Akron, Zapopan / Hard Rock Stadium, Miami Gardens / Mercedes-Benz Stadium, Atlanta',
  L: 'AT&T Stadium, Arlington / BMO Field, Toronto / Gillette Stadium, Foxborough / MetLife Stadium, East Rutherford / Lincoln Financial Field, Philadelphia',
}
