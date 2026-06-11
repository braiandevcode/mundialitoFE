import { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Shield } from 'lucide-react'
import { type ITeam, type IMatch } from '@/core/types'
import { EKnockoutRound } from '@/core/types'
import { fetchTeams } from '@/core/api/teams'
import { fetchBracketMatches, generateNextRound } from '@/core/api/matches'
import { getErrorMessage } from '@/core/lib/errorMessages'
import { getBracketSlotsFromMatches } from '@/module/bracket/services/bracketService'
import { useAuth, useToast } from '@/shared/providers'
import AdminMatchForm from '@/module/admin/components/AdminMatchForm'
import SEOHead from '@/shared/seo/SEOHead'
import Card from '@/shared/components/Card'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import ErrorState from '@/shared/components/ErrorState'
import Button from '@/shared/components/Button'
import { cn } from '@/core/utils'
import { formatMatchDateTime } from '@/core/utils/dateUtils'
import { useSwipe } from '@/shared/hooks/useSwipe'
import type { IBracketSlotWithTeams } from '@/module/bracket/services/bracketService'

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

export default function AdminBracketPage() {
  const { token } = useAuth()
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
    const grouped: Record<string, IBracketSlotWithTeams[]> = {}
    for (const round of rounds) {
      grouped[round] = allSlots
        .filter((s: IBracketSlotWithTeams) => s.round === round)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
    return grouped
  }, [allSlots])

  const goPrev: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.max(0, i - 1))
  }, [])

  const goNext: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.min(rounds.length - 1, i + 1))
  }, [])

  const swipeHandlers = useSwipe(goNext, goPrev)

  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const ROUND_ORDER: EKnockoutRound[] = useMemo(() => [
    EKnockoutRound.R32,
    EKnockoutRound.R16,
    EKnockoutRound.QF,
    EKnockoutRound.SF,
    EKnockoutRound.FINAL,
    EKnockoutRound.THIRD_PLACE,
  ], [])

  const nextRoundInfo: { nextRound: EKnockoutRound | null; progress: { done: number; total: number } } = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const round of ROUND_ORDER) {
      const roundMatches: IMatch[] = bracketMatches.filter((m: IMatch) => m.round === round)
      counts[round] = roundMatches.length
      if (roundMatches.length === 0) {
        const idx: number = ROUND_ORDER.indexOf(round)
        if (idx === 0) {
          if (import.meta.env.NODE_ENV === 'development') {
            console.debug('[nextRoundInfo] first round empty:', { round })
          }
          return { nextRound: round, progress: { done: 0, total: 0 } }
        }
        const prevRound: EKnockoutRound = ROUND_ORDER[idx - 1]
        const prevMatches: IMatch[] = bracketMatches.filter((m: IMatch) => m.round === prevRound)
        const done: number = prevMatches.filter((m: IMatch) => m.status === 'finished').length
        if (import.meta.env.NODE_ENV === 'development') {
          console.debug('[nextRoundInfo] next round:', { nextRound: round, prevRound, done, total: prevMatches.length, counts })
        }
        return { nextRound: round, progress: { done, total: prevMatches.length } }
      }
    }
    if (import.meta.env.NODE_ENV === 'development') {
      console.debug('[nextRoundInfo] all rounds have matches — no next round', { counts })
    }
    return { nextRound: null, progress: { done: 0, total: 0 } }
  }, [bracketMatches, ROUND_ORDER])

  const canGenerate: boolean = nextRoundInfo.nextRound !== null
    && (nextRoundInfo.progress.total === 0 || nextRoundInfo.progress.done === nextRoundInfo.progress.total)

  const handleGenerateRound: () => Promise<void> = useCallback(async () => {
    if (!canGenerate || !token) return
    setIsGenerating(true)
    try {
      const result = await generateNextRound(token)
      if (result.message) {
        showToast({ type: 'success', message: result.message })
      }
      await loadData()
      const nextIdx: number = nextRoundInfo.nextRound
        ? ROUND_ORDER.indexOf(nextRoundInfo.nextRound)
        : -1
      if (nextIdx >= 0) setCurrentIndex(nextIdx)
    } catch (err) {
      showToast({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setIsGenerating(false)
    }
  }, [canGenerate, token, loadData, nextRoundInfo.nextRound, ROUND_ORDER])

  const handleSaved: (updated: IMatch) => void = useCallback(
    (updated: IMatch) => {
      setBracketMatches((prev: IMatch[]) =>
        prev.map((m: IMatch) => (m.id === updated.id ? updated : m)),
      )
    },
    [],
  )

  if (isLoadingData) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )

  if (dataError) return (
    <ErrorState
      title="Algo salió mal"
      message={dataError}
      action={
        <Button variant="secondary" onClick={loadData}>
          Reintentar
        </Button>
      }
    />
  )

  return (
    <>
      <SEOHead title={`Admin · ${roundLabels[currentRound]} | MundialitoApp`} description="Panel de administración de eliminatorias." />

      <section>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Shield className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl sm:text-2xl font-display text-slate-900 dark:text-white tracking-wider">
            Admin · Eliminatorias
          </h1>
        </div>

        {nextRoundInfo.nextRound && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {nextRoundInfo.progress.total > 0 && (
                <span className="text-xs text-amber-700 dark:text-amber-300 font-mono">
                  {nextRoundInfo.progress.done}/{nextRoundInfo.progress.total} completados
                </span>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateRound}
                disabled={!canGenerate || isGenerating}
                isLoading={isGenerating}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Generar {roundLabels[nextRoundInfo.nextRound] ?? nextRoundInfo.nextRound}
              </Button>
              {nextRoundInfo.progress.total > 0 && nextRoundInfo.progress.done < nextRoundInfo.progress.total && (
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  Completá todos los partidos de la ronda anterior
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
          {rounds.map((r: EKnockoutRound, i: number) => (
            <button
              key={r}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'px-2.5 h-7 rounded-full text-xs font-bold font-mono transition-all duration-200 shrink-0',
                i === currentIndex
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700',
              )}
            >
              {roundLabels[r]}
            </button>
          ))}
        </div>

        <div className="relative">
          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 sm:-ml-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
              aria-label="Ronda anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < rounds.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 sm:-mr-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
              aria-label="Siguiente ronda"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div key={currentRound} className="animate-fade-in" {...swipeHandlers}>
            <Card padding="none" className="overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-neutral-700">
                {(sortedSlotsByRound[currentRound] ?? []).map((slot: IBracketSlotWithTeams) => {
                  const known: boolean = teamsMap.has(slot.homeTeamId) && teamsMap.has(slot.awayTeamId)
                  const match: IMatch | undefined = bracketMatches.find((m: IMatch) => m.id === slot.id)

                  if (!known || !match) {
                    return (
                      <div key={slot.id} className="px-4 py-3 pl-3 border-l-2 border-slate-200 dark:border-neutral-600">
                        <div className="flex items-center justify-center gap-2 min-w-0 flex-wrap">
                          <span className="text-xs font-mono text-slate-500 dark:text-neutral-400">
                            {slot.label || `${slot.homeTeamId} vs ${slot.awayTeamId}`}
                          </span>
                        </div>
                        {slot.date && (
                        <div className="flex justify-center mt-1">
                          <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
                            {formatMatchDateTime(slot.date)}
                          </span>
                        </div>
                        )}
                      </div>
                    )
                  }

                  const homeName: string = teamShortNames.get(slot.homeTeamId) ?? slot.homeTeamName
                  const awayName: string = teamShortNames.get(slot.awayTeamId) ?? slot.awayTeamName

                  return (
                    <div key={slot.id} className="px-4 py-3 pl-3 border-l-2 border-slate-200 dark:border-neutral-600">
                      <AdminMatchForm
                        match={match}
                        isKnockout={true}
                        token={token ?? ''}
                        homeTeamName={homeName}
                        awayTeamName={awayName}
                        homeCountryCode={slot.homeCountryCode}
                        awayCountryCode={slot.awayCountryCode}
                        onSaved={handleSaved}
                      />
                      {slot.date && (
                      <div className="flex justify-center mt-2">
                        <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
                          {formatMatchDateTime(slot.date)}
                        </span>
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
