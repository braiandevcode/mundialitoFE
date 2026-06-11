import { EScoringRule, type IMatch, type IPrediction } from '@/core/types'

/*
  Calculo los puntos que obtiene un usuario por su pronóstico en un partido.
  - Si el resultado real no está disponible, devuelvo WRONG (0).
  - Si el pronóstico no es exacto (mismo resultado), devuelvo WRONG (0).
  - Si es exacto y nadie más acertó, devuelvo UNIQUE_EXACT (3).
  - Si es exacto pero otros también acertaron, devuelvo SHARED_EXACT (1).
*/
export function calculateScore(
  prediction: IPrediction,
  match: IMatch,
  allPredictionsForMatch?: IPrediction[],
): number {
  if (match.homeScore === null || match.awayScore === null) return EScoringRule.WRONG

  // Verifico si el resultado del pronóstico coincide exactamente con el real
  const isExact: boolean =
    prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore
  if (!isExact) return EScoringRule.WRONG

  // Si el partido real se decidió por penales, el usuario debe acertar el ganador
  if (match.penaltyHomeScore !== null && match.penaltyAwayScore !== null) {
    const actualPenaltyWinner: 'home' | 'away' =
      match.penaltyHomeScore > match.penaltyAwayScore ? 'home' : 'away'
    if (prediction.penaltyWinner !== actualPenaltyWinner) return EScoringRule.WRONG
  }

  // Si no tengo el listado completo de pronósticos, asumo que es único
  if (!allPredictionsForMatch) return EScoringRule.UNIQUE_EXACT

  // Cuento cuántos otros usuarios también acertaron exactamente este mismo resultado
  const othersExact: IPrediction[] = allPredictionsForMatch.filter(
    (p: IPrediction) =>
      p.id !== prediction.id &&
      p.homeScore === match.homeScore &&
      p.awayScore === match.awayScore,
  )

  return othersExact.length === 0 ? EScoringRule.UNIQUE_EXACT : EScoringRule.SHARED_EXACT
}
