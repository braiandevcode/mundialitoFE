import { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import { fetchTeams } from '@/core/api/teams'
import { fetchMatches } from '@/core/api/matches'
import { getErrorMessage } from '@/core/lib/errorMessages'
import { formatMatchDateTime } from '@/core/utils/dateUtils'
import { useAuth } from '@/shared/providers'
import AdminMatchForm from '@/module/admin/components/AdminMatchForm'
import SEOHead from '@/shared/seo/SEOHead'
import Card from '@/shared/components/Card'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import ErrorState from '@/shared/components/ErrorState'
import Button from '@/shared/components/Button'
import { cn } from '@/core/utils'
import { useSwipe } from '@/shared/hooks/useSwipe'
import type { TGroupId, ITeam, IMatch } from '@/core/types'

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

export default function AdminGroupsPage() {
  const { token } = useAuth()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
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

  const groupFixtures: IMatch[] = useMemo(
    () => data?.fixtures.filter((m: IMatch) => m.groupId === currentGroupId) ?? [],
    [currentGroupId, data?.fixtures],
  )

  const goPrev: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.max(0, i - 1))
  }, [])

  const goNext: () => void = useCallback(() => {
    setCurrentIndex((i: number) => Math.min((data?.groupIds.length ?? 12) - 1, i + 1))
  }, [data?.groupIds.length])

  const swipeHandlers = useSwipe(goNext, goPrev)

  const handleSaved: (updated: IMatch) => void = useCallback(
    (updated: IMatch) => {
      setData((prev: IGroupsData | null) => {
        if (!prev) return prev
        const fixtures: IMatch[] = prev.fixtures.map((m: IMatch) =>
          m.id === updated.id ? updated : m,
        )
        return { ...prev, fixtures }
      })
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

  if (!data) return null

  const { teams, groupIds, teamShortNames } = data

  return (
    <>
      <SEOHead title={`Admin · Grupo ${currentGroupId} | MundialitoApp`} description="Panel de administración de resultados." />

      <section>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Shield className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl sm:text-2xl font-display text-slate-900 dark:text-white tracking-wider">
            Admin · Grupo {currentGroupId}
          </h1>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
          {groupIds.map((gid: TGroupId, i: number) => (
            <button
              key={gid}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'w-8 h-8 rounded-full text-xs font-bold font-mono transition-all duration-200 shrink-0',
                i === currentIndex
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700',
              )}
            >
              {gid}
            </button>
          ))}
        </div>

        <div className="relative">
          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 sm:-ml-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
              aria-label="Grupo anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < groupIds.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 sm:-mr-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
              aria-label="Siguiente grupo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div key={currentGroupId} className="animate-fade-in" {...swipeHandlers}>
            <Card>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-neutral-400 uppercase mb-3">
                Resultados · Grupo {currentGroupId}
              </h2>
              <div className="divide-y divide-slate-100 dark:divide-neutral-700">
                {groupFixtures.map((match: IMatch) => {
                  const home: ITeam | undefined = teams.find((t: ITeam) => t.id === match.homeTeamId)
                  const away: ITeam | undefined = teams.find((t: ITeam) => t.id === match.awayTeamId)
                  const homeName: string = teamShortNames.get(home?.id ?? '') ?? home?.name ?? match.homeTeamId
                  const awayName: string = teamShortNames.get(away?.id ?? '') ?? away?.name ?? match.awayTeamId

                  return (
                    <div key={match.id} className="py-4 pl-3 border-l-2 border-slate-200 dark:border-neutral-600">
                      <AdminMatchForm
                        match={match}
                        isKnockout={false}
                        token={token ?? ''}
                        homeTeamName={homeName}
                        awayTeamName={awayName}
                        homeCountryCode={home?.countryCode ?? ''}
                        awayCountryCode={away?.countryCode ?? ''}
                        onSaved={handleSaved}
                      />
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
      </section>
    </>
  )
}
