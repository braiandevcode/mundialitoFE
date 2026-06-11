import { useState, useMemo, type FormEvent } from 'react'
import { Check, Save, ShieldAlert, Timer, Swords } from 'lucide-react'
import { updateMatch, type IUpdateMatchBody } from '@/core/api/matches'
import { getErrorMessage } from '@/core/lib/errorMessages'
import Button from '@/shared/components/Button'
import TeamFlag from '@/shared/components/TeamFlag'
import { useToast } from '@/shared/providers'
import { cn } from '@/core/utils'
import type { IMatch } from '@/core/types'

interface IAdminMatchFormProps {
  match: IMatch
  isKnockout: boolean
  token: string
  homeTeamName: string
  awayTeamName: string
  homeCountryCode: string
  awayCountryCode: string
  onSaved: (updated: IMatch) => void
}

export default function AdminMatchForm({
  match,
  isKnockout,
  token,
  homeTeamName,
  awayTeamName,
  homeCountryCode,
  awayCountryCode,
  onSaved,
}: IAdminMatchFormProps) {
  const { showToast } = useToast()
  const [homeScore, setHomeScore] = useState<string>(match.homeScore !== null ? String(match.homeScore) : '')
  const [awayScore, setAwayScore] = useState<string>(match.awayScore !== null ? String(match.awayScore) : '')
  const [extraHome, setExtraHome] = useState<string>(match.extraHomeScore !== null ? String(match.extraHomeScore) : '')
  const [extraAway, setExtraAway] = useState<string>(match.extraAwayScore !== null ? String(match.extraAwayScore) : '')
  const [penaltyHome, setPenaltyHome] = useState<string>(match.penaltyHomeScore !== null ? String(match.penaltyHomeScore) : '')
  const [penaltyAway, setPenaltyAway] = useState<string>(match.penaltyAwayScore !== null ? String(match.penaltyAwayScore) : '')
  const [isFinished, setIsFinished] = useState<boolean>(match.status === 'finished')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const homeNum: number | null = homeScore === '' ? null : parseInt(homeScore, 10)
  const awayNum: number | null = awayScore === '' ? null : parseInt(awayScore, 10)
  const extraHomeNum: number | null = extraHome === '' ? null : parseInt(extraHome, 10)
  const extraAwayNum: number | null = extraAway === '' ? null : parseInt(extraAway, 10)
  const penaltyHomeNum: number | null = penaltyHome === '' ? null : parseInt(penaltyHome, 10)
  const penaltyAwayNum: number | null = penaltyAway === '' ? null : parseInt(penaltyAway, 10)

  const scoresFilled: boolean = homeNum !== null && awayNum !== null && !isNaN(homeNum) && !isNaN(awayNum)

  const isDraw: boolean = scoresFilled && homeNum === awayNum

  const showExtra: boolean = isKnockout && isDraw

  const extraScoresFilled: boolean = extraHomeNum !== null && extraAwayNum !== null && !isNaN(extraHomeNum) && !isNaN(extraAwayNum)

  const isExtraDraw: boolean = showExtra && extraScoresFilled && extraHomeNum === extraAwayNum

  const showPenalties: boolean = isKnockout && isExtraDraw

  const penaltyScoresFilled: boolean = penaltyHomeNum !== null && penaltyAwayNum !== null && !isNaN(penaltyHomeNum) && !isNaN(penaltyAwayNum)

  const requiredFieldsComplete: boolean = useMemo(() => {
    if (!scoresFilled) return false
    if (showExtra && !extraScoresFilled) return false
    if (showPenalties && !penaltyScoresFilled) return false
    return true
  }, [scoresFilled, showExtra, extraScoresFilled, showPenalties, penaltyScoresFilled])

  const canSave: boolean = requiredFieldsComplete && isFinished

  const handleSubmit: (e: FormEvent) => Promise<void> = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSave) return
    setIsSaving(true)
    try {
      const body: IUpdateMatchBody = {
        homeScore: homeNum,
        awayScore: awayNum,
        extraHomeScore: showExtra ? extraHomeNum : null,
        extraAwayScore: showExtra ? extraAwayNum : null,
        penaltyHomeScore: showPenalties ? penaltyHomeNum : null,
        penaltyAwayScore: showPenalties ? penaltyAwayNum : null,
        status: isFinished ? 'finished' : undefined,
      }
      const updated: IMatch = await updateMatch(match.id, body, token)
      showToast({ type: 'success', message: 'Resultado guardado' })
      onSaved(updated)
    } catch (err) {
      showToast({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <TeamFlag countryCode={homeCountryCode} />
          <span className="text-sm font-medium text-slate-700 dark:text-neutral-300 shrink-0 max-w-[100px] truncate">
            {homeTeamName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={99}
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-12 h-10 text-center text-lg font-bold font-mono rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            aria-label="Goles local"
          />
          <span className="text-lg font-bold text-slate-400 dark:text-neutral-500 mx-0.5">–</span>
          <input
            type="number"
            min={0}
            max={99}
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-12 h-10 text-center text-lg font-bold font-mono rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            aria-label="Goles visita"
          />
        </div>

        <div className="flex items-center gap-2">
          <TeamFlag countryCode={awayCountryCode} />
          <span className="text-sm font-medium text-slate-700 dark:text-neutral-300 shrink-0 max-w-[100px] truncate">
            {awayTeamName}
          </span>
        </div>
      </div>

      {showExtra && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-700">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Tiempo extra
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={99}
                value={extraHome}
                onChange={(e) => setExtraHome(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-9 text-center text-base font-bold font-mono rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                aria-label="Goles local tiempo extra"
              />
              <span className="text-base font-bold text-amber-400 mx-0.5">–</span>
              <input
                type="number"
                min={0}
                max={99}
                value={extraAway}
                onChange={(e) => setExtraAway(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-9 text-center text-base font-bold font-mono rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                aria-label="Goles visita tiempo extra"
              />
            </div>
          </div>
        </div>
      )}

      {showPenalties && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-700">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Swords className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              Penales
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={99}
                value={penaltyHome}
                onChange={(e) => setPenaltyHome(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-9 text-center text-base font-bold font-mono rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                aria-label="Penales local"
              />
              <span className="text-base font-bold text-red-400 mx-0.5">–</span>
              <input
                type="number"
                min={0}
                max={99}
                value={penaltyAway}
                onChange={(e) => setPenaltyAway(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-9 text-center text-base font-bold font-mono rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                aria-label="Penales visita"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-700 flex items-center justify-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFinished}
            onChange={(e) => setIsFinished(e.target.checked)}
            disabled={!requiredFieldsComplete}
            className="w-4 h-4 rounded border-slate-300 dark:border-neutral-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-neutral-400">
            Finalizado
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!canSave || isSaving}
          isLoading={isSaving}
        >
          <Save className="w-3.5 h-3.5 mr-1" />
          Actualizar
        </Button>

        {!requiredFieldsComplete && (
          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-3 h-3" />
            Completá los campos requeridos
          </span>
        )}
      </div>
    </form>
  )
}
