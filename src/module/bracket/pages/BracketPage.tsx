import { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EKnockoutRound, type ITeam } from '@/core/types'
import { fetchTeams } from '@/core/api/teams'
import { fetchBracketMatches } from '@/core/api/matches'
import { getErrorMessage } from '@/core/lib/errorMessages'
import { getBracketTree, getBracketSlotsFromMatches, getPositionLabel } from '@/module/bracket/services/bracketService'
import { usePredictions } from '@/module/predictions/hooks/usePredictions'
import { getPredictionPointsColor } from '@/module/predictions/services/predictionService'
import { TeamFlag } from '@/shared/components'
import PredictionForm from '@/module/predictions/components/PredictionForm'
import SEOHead from '@/shared/seo/SEOHead'
import Card from '@/shared/components/Card'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import ErrorState from '@/shared/components/ErrorState'
import Button from '@/shared/components/Button'
import { cn } from '@/core/utils'
import { formatMatchDateTime } from '@/core/utils/dateUtils'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { useToast } from '@/shared/providers'
import type { IBracketSlotWithTeams } from '@/module/bracket/services/bracketService'
import type { IPrediction, IMatch } from '@/core/types'

const roundLabels: Record<string, string> = {
  [EKnockoutRound.R32]: '16avos',
  [EKnockoutRound.R16]: '8vos',
  [EKnockoutRound.QF]: '4tos',
  [EKnockoutRound.SF]: 'Semis',
  [EKnockoutRound.FINAL]: 'Final',
  [EKnockoutRound.THIRD_PLACE]: '3er Puesto',
}

const rounds: EKnockoutRound[] = [
  EKnockoutRound.R32,
  EKnockoutRound.R16,
  EKnockoutRound.QF,
  EKnockoutRound.SF,
  EKnockoutRound.FINAL,
  EKnockoutRound.THIRD_PLACE,
]

export default function BracketPage() {
  const ONE_HOUR_MS: number = 60 * 60 * 1000

  function isSlotPredictable(slot: IBracketSlotWithTeams): boolean {
    if (slot.homeScore !== null && slot.awayScore !== null) return false
    if (!slot.date) return true
    return Date.now() < new Date(slot.date).getTime() - ONE_HOUR_MS
  }

  const { predictions, isLoading: isLoadingPredictions, error: predictionsError, submitPrediction } = usePredictions()
  const { showToast } = useToast()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [teams, setTeams] = useState<ITeam[]>([])
  const [bracketMatches, setBracketMatches] = useState<IMatch[]>([])
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)
  const [dataError, setDataError] = useState<string | null>(null)

  const loadData = useCallback(() => {
    setIsLoadingData(true)
    setDataError(null)
    Promise.all([fetchTeams(), fetchBracketMatches()])
      .then(([t, m]) => {
        setTeams(t)
        setBracketMatches(m)
        setIsLoadingData(false)
      })
      .catch((err: unknown) => {
        setDataError(getErrorMessage(err))
        setIsLoadingData(false)
      })
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const currentRound: EKnockoutRound = rounds[currentIndex]

  const teamsMap: Map<string, ITeam> = useMemo(() => {
    const map: Map<string, ITeam> = new Map()
    for (const t of teams) {
      map.set(t.id, t)
    }
    return map
  }, [teams])

  const teamShortNames: Map<string, string> = useMemo(() => {
    const map: Map<string, string> = new Map()
    for (const t of teams) {
      map.set(t.id, t.name.length > 12 ? t.countryCode : t.name)
    }
    return map
  }, [teams])

  const allSlots: IBracketSlotWithTeams[] = useMemo(
    () => getBracketSlotsFromMatches(bracketMatches, teamsMap),
    [bracketMatches, teamsMap],
  )

  const sortedSlotsByRound: Record<string, IBracketSlotWithTeams[]> = useMemo(() => {
    if (bracketMatches.length === 0) {
      const tree = getBracketTree()
      const grouped: Record<string, IBracketSlotWithTeams[]> = {}
      for (const round of rounds) {
        grouped[round] = tree
          .filter((s) => s.round === round)
          .map((s) => ({
            id: s.id,
            round: s.round,
            homeTeamId: '',
            homeTeamName: '',
            homeCountryCode: '',
            awayTeamId: '',
            awayTeamName: '',
            awayCountryCode: '',
            homeScore: null,
            awayScore: null,
            extraHomeScore: null,
            extraAwayScore: null,
            penaltyHomeScore: null,
            penaltyAwayScore: null,
            date: '',
            stadium: '',
            label: getPositionLabel(s.id),
          }))
      }
      return grouped
    }
    const grouped: Record<string, IBracketSlotWithTeams[]> = {}
    for (const round of rounds) {
      grouped[round] = allSlots
        .filter((s: IBracketSlotWithTeams) => s.round === round)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
    return grouped
  }, [allSlots, bracketMatches.length])

  const goPrev: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.max(0, i - 1))
  }, [])

  const goNext: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.min(rounds.length - 1, i + 1))
  }, [])

  const swipeHandlers = useSwipe(goNext, goPrev)

  const handleSave: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    extraHomeScore?: number,
    extraAwayScore?: number,
    penaltyWinner?: 'home' | 'away',
  ) => Promise<void> = useCallback(
    async (matchId, homeScore, awayScore, extraHomeScore?, extraAwayScore?, penaltyWinner?) => {
      try {
        await submitPrediction(matchId, homeScore, awayScore, extraHomeScore, extraAwayScore, penaltyWinner)
      } catch (err) {
        showToast({ type: 'error', message: getErrorMessage(err) })
      }
    },
    [submitPrediction, showToast],
  )

  if (isLoadingData || isLoadingPredictions) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )

  const error: string | null = dataError ?? predictionsError

  if (error) return (
    <ErrorState
      title="Algo salió mal"
      message={error}
      action={
        <Button variant="secondary" onClick={loadData}>
          Reintentar
        </Button>
      }
    />
  )

  return (
    <>
      <SEOHead title={`${roundLabels[currentRound]} | Eliminatorias | MundialitoApp`} description="Pronosticá las eliminatorias del Mundial 2026: 16avos, 8vos, cuartos, semifinales y final. Resultados con tiempo extra y penales." />
      <section>
        <h1 className="text-xl sm:text-2xl font-display text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-wider">
          Eliminatorias
        </h1>

        {bracketMatches.length === 0 ? (
          <div className="mb-4 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300">
            Los cruces se definirán al finalizar la fase de grupos. Esta vista muestra la estructura del cuadro.
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
            Pronosticá el resultado de cada eliminatoria. Si marcás empate, se habilitan tiempo extra y penales.
          </div>
        )}

        {/* Round tabs */}
        <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
          {rounds.map((r: EKnockoutRound, i: number) => (
            <button
              key={r}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'px-2.5 h-7 rounded-full text-xs font-bold font-mono transition-all duration-200 shrink-0',
                i === currentIndex
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700',
              )}
            >
              {roundLabels[r]}
            </button>
          ))}
        </div>

        {/* Slider container */}
        <div className="relative">
          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 sm:-ml-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-200/50 hover:scale-105 transition-all"
              aria-label="Ronda anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < rounds.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 sm:-mr-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-200/50 hover:scale-105 transition-all"
              aria-label="Siguiente ronda"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div key={currentRound} className="animate-fade-in" {...swipeHandlers}>
            <Card padding="none" className="overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-neutral-700">
                {(sortedSlotsByRound[currentRound] ?? []).map((slot: IBracketSlotWithTeams) => {
                  const pred: IPrediction | undefined = predictions.find(
                    (p: IPrediction) => p.matchId === slot.id,
                  )

                  const known: boolean = teamsMap.has(slot.homeTeamId) && teamsMap.has(slot.awayTeamId)
                  const finished: boolean = slot.homeScore !== null && slot.awayScore !== null

                  return (
                    <div key={slot.id} className="px-4 py-3 pl-3 border-l-2 border-slate-200 dark:border-neutral-600">
                      {known ? (finished ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex-1 flex items-center justify-center gap-2 min-w-0 flex-wrap">
                            {teamsMap.has(slot.homeTeamId) && <TeamFlag countryCode={teamsMap.get(slot.homeTeamId)!.countryCode} />}
                            <span className="text-sm text-slate-700 dark:text-neutral-300 shrink-0">{teamShortNames.get(slot.homeTeamId) ?? slot.homeTeamName}</span>
                            <span className="text-sm font-mono font-bold tabular-nums text-slate-900 dark:text-white shrink-0">{slot.homeScore}–{slot.awayScore}</span>
                            <span className="text-sm text-slate-700 dark:text-neutral-300 shrink-0">{teamShortNames.get(slot.awayTeamId) ?? slot.awayTeamName}</span>
                            {teamsMap.has(slot.awayTeamId) && <TeamFlag countryCode={teamsMap.get(slot.awayTeamId)!.countryCode} />}
                            {pred && pred.points !== null && (
                              <span className={cn('text-xs font-semibold shrink-0', getPredictionPointsColor(pred.points))}>
                                +{pred.points} pts
                              </span>
                            )}
                          </div>
                          {slot.homeScore !== null && slot.awayScore !== null
                            && slot.homeScore === slot.awayScore
                            && slot.extraHomeScore !== null && slot.extraAwayScore !== null && (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-sm font-mono font-bold tabular-nums text-slate-900 dark:text-white shrink-0">
                                Extra {slot.extraHomeScore}–{slot.extraAwayScore}
                              </span>
                              {slot.extraHomeScore === slot.extraAwayScore
                                && slot.penaltyHomeScore !== null && slot.penaltyAwayScore !== null && (
                                <span className="text-sm font-mono font-bold tabular-nums text-slate-900 dark:text-white shrink-0">
                                  Pen {slot.penaltyHomeScore}–{slot.penaltyAwayScore}
                                </span>
                              )}
                            </div>
                          )}
                          {slot.date && (
                          <div className="flex justify-center gap-4">
                            <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
                              {formatMatchDateTime(slot.date)}
                            </span>
                          </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <PredictionForm
                            matchId={slot.id}
                            homeTeamId={slot.homeTeamId}
                            awayTeamId={slot.awayTeamId}
                            homeTeamName={teamShortNames.get(slot.homeTeamId) ?? slot.homeTeamName}
                            awayTeamName={teamShortNames.get(slot.awayTeamId) ?? slot.awayTeamName}
                            homeCountryCode={slot.homeCountryCode}
                            awayCountryCode={slot.awayCountryCode}
                            existingPrediction={pred ?? null}
                            onSave={handleSave}
                            disabled={!isSlotPredictable(slot)}
                          />
                          {slot.date && (
                          <div className="flex justify-center gap-4">
                            <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
                              {formatMatchDateTime(slot.date)}
                            </span>
                          </div>
                          )}
                        </div>
                      )) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex-1 flex items-center justify-center gap-2 min-w-0 flex-wrap">
                            <span className="text-xs font-mono text-slate-500 dark:text-neutral-400">
                              {slot.label || `${slot.homeTeamId} vs ${slot.awayTeamId}`}
                            </span>
                          </div>
                          {slot.date && (
                          <div className="flex justify-center gap-4">
                            <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
                              {formatMatchDateTime(slot.date)}
                            </span>
                          </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
