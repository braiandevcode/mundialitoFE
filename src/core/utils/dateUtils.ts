import type { IMatch } from '../types'
import { EMatchStatus } from '../types'

// Ventana de 1 hora antes del partido: no se permite pronosticar después de este límite
const ONE_HOUR_MS: number = 60 * 60 * 1000

/*
  Determino si un usuario puede pronosticar un partido según su estado y fecha.
  - Partidos finalizados o en vivo: no se puede.
  - Sin fecha definida: se puede (es un placeholder).
  - Con fecha: solo hasta 1 hora antes del inicio.
*/
export function canPredict(match: IMatch): boolean {
  if (match.status === EMatchStatus.FINISHED) return false
  if (match.status === EMatchStatus.LIVE) return false
  if (!match.date) return true
  return Date.now() < new Date(match.date).getTime() - ONE_HOUR_MS
}

const DAYS_SHORT: readonly string[] = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS_SHORT: readonly string[] = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function formatMatchDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${DAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
