import { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EMatchStatus } from '@/core/types'
import { fetchTeams } from '@/core/api/teams'
import { fetchMatches } from '@/core/api/matches'
import { getErrorMessage } from '@/core/lib/errorMessages'
import { canPredict, formatMatchDateTime } from '@/core/utils/dateUtils'
import { usePredictions } from '@/module/predictions/hooks/usePredictions'
import { getPredictionPointsColor } from '@/module/predictions/services/predictionService'
import PredictionForm from '@/module/predictions/components/PredictionForm'
import SEOHead from '@/shared/seo/SEOHead'
import Card from '@/shared/components/Card'
import TeamFlag from '@/shared/components/TeamFlag'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import ErrorState from '@/shared/components/ErrorState'
import Button from '@/shared/components/Button'
import { useToast } from '@/shared/providers'
import { cn } from '@/core/utils'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { computeGroupStandings } from '../services/groupStandings'
import type { TGroupId, ITeam, IMatch, IPrediction } from '@/core/types'
import type { IStandingEntry } from '../services/groupStandings'

interface IGroupsData {
  teams: ITeam[]
  fixtures: IMatch[]
  groupIds: TGroupId[]
  teamShortNames: Map<string, string>
}

const GROUP_LETTERS: TGroupId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function buildTeamsShortNames(teams: ITeam[]): Map<string, string> {
  const map: Map<string, string> = new Map()
  for (const t of teams) {
    map.set(t.id, t.name.length > 12 ? t.countryCode : t.name)
  }
  return map
}

export default function GroupsPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { predictions, isLoading: isLoadingPredictions, error: predictionsError, submitPrediction } = usePredictions()
  const { showToast } = useToast()
  const [data, setData] = useState<IGroupsData | null>(null)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)
  const [dataError, setDataError] = useState<string | null>(null)

  const loadData = useCallback(() => {
    setIsLoadingData(true)
    setDataError(null)
    Promise.all([fetchTeams(), fetchMatches()])
      .then(([teams, matches]) => {
        const groupIds: TGroupId[] = GROUP_LETTERS
        const teamShortNames: Map<string, string> = buildTeamsShortNames(teams)
        setData({ teams, fixtures: matches, groupIds, teamShortNames })
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

  const currentGroupId: TGroupId = data?.groupIds[currentIndex] ?? 'A'

  const groupTeams: ITeam[] = useMemo(
    () => data?.teams.filter((t: ITeam) => t.groupId === currentGroupId) ?? [],
    [currentGroupId, data?.teams],
  )

  const groupFixtures: IMatch[] = useMemo(
    () => data?.fixtures.filter((m: IMatch) => m.groupId === currentGroupId) ?? [],
    [currentGroupId, data?.fixtures],
  )

  const standings: IStandingEntry[] = useMemo(
    () => computeGroupStandings(groupTeams, groupFixtures),
    [groupTeams, groupFixtures],
  )

  const hasFinishedMatches: boolean = groupFixtures.some(
    (m: IMatch) => m.status === EMatchStatus.FINISHED,
  )

  const goPrev: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.max(0, i - 1))
  }, [])

  const goNext: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.min((data?.groupIds.length ?? 12) - 1, i + 1))
  }, [data?.groupIds.length])

  const swipeHandlers = useSwipe(goNext, goPrev)

  const handleSave: (matchId: string, homeScore: number, awayScore: number) => Promise<void> = useCallback(
    async (matchId: string, homeScore: number, awayScore: number) => {
      try {
        await submitPrediction(matchId, homeScore, awayScore)
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

  if (!data) return null

  const { teams, fixtures, groupIds, teamShortNames } = data

  return (
    <>
      <SEOHead title={`Grupo ${currentGroupId} | MundialitoApp`} description={`Tabla de posiciones y pronósticos del Grupo ${currentGroupId} del Mundial 2026.`} />
      <section>
      {/* Letter tabs */}
      <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
        {groupIds.map((gid: TGroupId, i: number) => (
          <button
            key={gid}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              'w-8 h-8 rounded-full text-xs font-bold font-mono transition-all duration-200 shrink-0',
              i === currentIndex
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700',
            )}
          >
            {gid}
          </button>
        ))}
      </div>

      {/* Slider container */}
      <div className="relative">
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 sm:-ml-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-200/50 hover:scale-105 transition-all"
            aria-label="Grupo anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {currentIndex < groupIds.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 sm:-mr-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-200/50 hover:scale-105 transition-all"
            aria-label="Siguiente grupo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div key={currentGroupId} className="animate-fade-in" {...swipeHandlers}>
          <h1 className="text-xl sm:text-2xl font-display text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-wider">
            Grupo {currentGroupId}
          </h1>

          <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-6 lg:items-start">
            <Card className="mb-6 lg:mb-0">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-neutral-400 uppercase mb-3">
                Clasificación
              </h2>
              <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-neutral-600 text-xs uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  <th className="w-8 pb-2 px-2 text-left font-medium">#</th>
                  <th className="pb-2 px-2 text-left font-medium">Equipo</th>
                  <th className="pb-2 px-2 text-right font-medium tabular-nums">Pts</th>
                  <th className="pb-2 px-2 text-right font-medium tabular-nums">GF</th>
                  <th className="pb-2 px-2 text-right font-medium tabular-nums">GC</th>
                  <th className="pb-2 px-2 text-right font-medium tabular-nums">DF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-700">
                {standings.map((entry: IStandingEntry, i: number) => (
                  <tr
                    key={entry.teamId}
                    className={cn(
                      'transition-colors',
                      hasFinishedMatches && i < 2 && 'bg-green-50 dark:bg-green-900/15',
                    )}
                  >
                    <td className="py-2.5 px-2 text-xs font-mono text-slate-400">{i + 1}</td>
                    <td className="py-2.5 px-2">
                      <span className="flex items-center gap-2">
                        <TeamFlag countryCode={entry.countryCode} />
                        <span className="font-medium text-slate-700 dark:text-neutral-300">
                          {teamShortNames.get(entry.teamId) ?? entry.teamName}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {entry.pts}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-neutral-400">
                      {entry.gf}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-neutral-400">
                      {entry.gc}
                    </td>
                    <td className={cn(
                      'py-2.5 px-2 text-right font-mono font-semibold tabular-nums',
                      entry.df > 0 && 'text-green-600 dark:text-green-400',
                      entry.df < 0 && 'text-red-500 dark:text-red-400',
                      entry.df === 0 && 'text-slate-500 dark:text-neutral-400',
                    )}>
                      {entry.df > 0 ? `+${entry.df}` : entry.df}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-neutral-400 uppercase mb-3">
              Partidos y Pronósticos
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-neutral-700">
              {groupFixtures.map((match: IMatch) => {
                const home: ITeam | undefined = teams.find((t: ITeam) => t.id === match.homeTeamId)
                const away: ITeam | undefined = teams.find((t: ITeam) => t.id === match.awayTeamId)
                const existingPrediction: IPrediction | undefined = predictions.find(
                  (p: IPrediction) => p.matchId === match.id,
                )

                const isFinished: boolean = match.status === EMatchStatus.FINISHED
                const canPredictMatch: boolean = canPredict(match)

                const homeName: string = teamShortNames.get(home?.id ?? '') ?? home?.name ?? match.homeTeamId
                const awayName: string = teamShortNames.get(away?.id ?? '') ?? away?.name ?? match.awayTeamId

                const isDisabled: boolean = !canPredictMatch

                return (
                  <div key={match.id} className="py-3 pl-3 border-l-2 border-slate-200 dark:border-neutral-600">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3">
                      {isFinished ? (
                        <div className="flex-1 flex items-center justify-center gap-2 min-w-0 flex-wrap">
                          {home && <TeamFlag countryCode={home.countryCode} />}
                          <span className="text-sm text-slate-700 dark:text-neutral-300 shrink-0">
                            {homeName}
                          </span>
                          <span className="text-sm font-mono font-bold tabular-nums text-slate-900 dark:text-white shrink-0">
                            {match.homeScore}–{match.awayScore}
                          </span>
                          <span className="text-sm text-slate-700 dark:text-neutral-300 shrink-0">
                            {awayName}
                          </span>
                          {away && <TeamFlag countryCode={away.countryCode} />}
                          {existingPrediction && existingPrediction.points !== null && (
                            <span className={cn(
                              'text-xs font-semibold shrink-0',
                              getPredictionPointsColor(existingPrediction.points),
                            )}>
                              +{existingPrediction.points} pts
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className={cn(
                          'flex-1 flex items-center justify-center gap-2 min-w-0 flex-wrap',
                          isDisabled && 'opacity-55',
                        )}>
                          <PredictionForm
                            matchId={match.id}
                            homeTeamId={match.homeTeamId}
                            awayTeamId={match.awayTeamId}
                            homeTeamName={homeName}
                            awayTeamName={awayName}
                            homeCountryCode={home?.countryCode ?? ''}
                            awayCountryCode={away?.countryCode ?? ''}
                            existingPrediction={existingPrediction ?? null}
                            onSave={handleSave}
                            disabled={isDisabled}
                            allowExtraTime={false}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center mt-2">
                      <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
                        {formatMatchDateTime(match.date)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
    </section>
    </>
  )
}
