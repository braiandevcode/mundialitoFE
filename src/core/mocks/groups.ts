import type { IGroup, TGroupId, ITeam } from '../types'
import { teams } from './teams'

// Lista de todos los identificadores de grupo disponibles (A a L) para el mundial 2026
const groupIds: TGroupId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

// Construyo el arreglo de grupos mapeando cada ID a su estructura completa con equipos filtrados
export const groups: IGroup[] = groupIds.map((id: TGroupId) => ({
  id,
  name: `Group ${id}`,
  teams: teams.filter((t: ITeam) => t.groupId === id),
  matches: [],
}))
