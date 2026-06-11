import { useState, useEffect, useRef, type KeyboardEvent } from 'react'
import { TeamFlag } from '@/shared/components'
import { cn, stripNonDigits } from '@/core/utils'
import type { IPrediction } from '@/core/types'

interface IPredictionFormProps {
  matchId: string
  homeTeamId: string
  awayTeamId: string
  homeTeamName: string
  awayTeamName: string
  homeCountryCode: string
  awayCountryCode: string
  existingPrediction?: IPrediction | null
  onSave: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    extraHomeScore?: number,
    extraAwayScore?: number,
    penaltyWinner?: 'home' | 'away',
  ) => Promise<void>
  disabled?: boolean
  allowExtraTime?: boolean
}

export default function PredictionForm({
  matchId,
  homeTeamName,
  awayTeamName,
  homeCountryCode,
  awayCountryCode,
  existingPrediction,
  onSave,
  disabled = false,
  allowExtraTime = true,
}: IPredictionFormProps) {
  const [homeScore, setHomeScore] = useState<string>(
    existingPrediction?.homeScore?.toString() ?? '',
  )
  const [awayScore, setAwayScore] = useState<string>(
    existingPrediction?.awayScore?.toString() ?? '',
  )
  const [extraHome, setExtraHome] = useState<string>(
    existingPrediction?.extraHomeScore?.toString() ?? '',
  )
  const [extraAway, setExtraAway] = useState<string>(
    existingPrediction?.extraAwayScore?.toString() ?? '',
  )
  const [penaltyWinner, setPenaltyWinner] = useState<'home' | 'away' | null>(
    existingPrediction?.penaltyWinner ?? null,
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const isFirstRender = useRef<boolean>(true)
  const isRestoring = useRef<boolean>(false)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (isRestoring.current) {
      isRestoring.current = false
      return
    }
    setExtraHome('')
    setExtraAway('')
    setPenaltyWinner(null)
  }, [homeScore, awayScore])

  const homeCountry: string = homeCountryCode
  const awayCountry: string = awayCountryCode

  const h: number = parseInt(homeScore, 10)
  const a: number = parseInt(awayScore, 10)
  const isDraw: boolean = !isNaN(h) && !isNaN(a) && h === a

  const eh: number = parseInt(extraHome, 10)
  const ea: number = parseInt(extraAway, 10)
  const extraDraw: boolean = isDraw && !isNaN(eh) && !isNaN(ea) && eh === ea

  useEffect(() => {
    if (existingPrediction) {
      isRestoring.current = true
      setHomeScore(existingPrediction.homeScore.toString())
      setAwayScore(existingPrediction.awayScore.toString())
      setExtraHome(existingPrediction.extraHomeScore?.toString() ?? '')
      setExtraAway(existingPrediction.extraAwayScore?.toString() ?? '')
      setPenaltyWinner(existingPrediction.penaltyWinner ?? null)
    }
  }, [existingPrediction])

  const doSubmit = async (
    hVal: string,
    aVal: string,
    ehVal?: string,
    eaVal?: string,
    pw?: 'home' | 'away' | null,
  ): Promise<void> => {
    if (disabled) return
    const homeNum = parseInt(hVal, 10)
    const awayNum = parseInt(aVal, 10)
    if (isNaN(homeNum) || isNaN(awayNum) || homeNum < 0 || awayNum < 0) return

    let extraHomeNum: number | undefined
    let extraAwayNum: number | undefined
    let penaltyWinnerVal: 'home' | 'away' | undefined

    if (ehVal !== undefined && eaVal !== undefined) {
      const pEh = parseInt(ehVal, 10)
      const pEa = parseInt(eaVal, 10)
      if (!isNaN(pEh) && !isNaN(pEa)) {
        extraHomeNum = pEh
        extraAwayNum = pEa
      }
    }

    if (pw) penaltyWinnerVal = pw

    setIsSubmitting(true)
    try {
      await onSave(matchId, homeNum, awayNum, extraHomeNum, extraAwayNum, penaltyWinnerVal)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBlur = (isAway: boolean): void => {
    const hVal = homeScore
    const aVal = awayScore

    if (hVal === '' && aVal === '') return
    if (!isAway && aVal === '') return

    const hNum = hVal === '' ? 0 : parseInt(hVal, 10)
    const aNum = aVal === '' ? 0 : parseInt(aVal, 10)
    if (isNaN(hNum) || isNaN(aNum) || hNum < 0 || aNum < 0) return

    if (hNum === aNum && allowExtraTime) return

    doSubmit(hVal === '' ? '0' : hVal, aVal === '' ? '0' : aVal)
  }

  const handleExtraBlur = (): void => {
    const ehVal = extraHome
    const eaVal = extraAway

    if (ehVal === '' && eaVal === '') {
      setHomeScore('')
      setAwayScore('')
      setExtraHome('')
      setExtraAway('')
      setPenaltyWinner(null)
      return
    }

    if (ehVal === '' || eaVal === '') return

    const pEh = parseInt(ehVal, 10)
    const pEa = parseInt(eaVal, 10)
    if (isNaN(pEh) || isNaN(pEa) || pEh < 0 || pEa < 0) return

    const hVal = homeScore === '' ? '0' : homeScore
    const aVal = awayScore === '' ? '0' : awayScore

    if (pEh === pEa && !penaltyWinner) return

    doSubmit(hVal, aVal, ehVal, eaVal, penaltyWinner)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (disabled) return

      const hVal = homeScore === '' ? '0' : homeScore
      const aVal = awayScore === '' ? '0' : awayScore
      const pH = parseInt(hVal, 10)
      const pA = parseInt(aVal, 10)
      if (isNaN(pH) || isNaN(pA) || pH < 0 || pA < 0) return

      if (pH === pA && allowExtraTime) {
        const ehVal = extraHome === '' ? '0' : extraHome
        const eaVal = extraAway === '' ? '0' : extraAway
        const pEh = parseInt(ehVal, 10)
        const pEa = parseInt(eaVal, 10)
        if (isNaN(pEh) || isNaN(pEa) || pEh < 0 || pEa < 0) return
        if (pEh === pEa && !penaltyWinner) return
        doSubmit(hVal, aVal, ehVal, eaVal, penaltyWinner)
      } else {
        doSubmit(hVal, aVal)
      }
    }
  }

  const handlePenaltyChange = (winner: 'home' | 'away'): void => {
    const newWinner = penaltyWinner === winner ? null : winner
    setPenaltyWinner(newWinner)

    if (newWinner) {
      const pH = parseInt(homeScore, 10)
      const pA = parseInt(awayScore, 10)
      if (isNaN(pH) || isNaN(pA)) return
      const pEh = parseInt(extraHome, 10)
      const pEa = parseInt(extraAway, 10)
      if (isNaN(pEh) || isNaN(pEa)) return
      doSubmit(homeScore, awayScore, extraHome, extraAway, newWinner)
    }
  }

  return (
    <div className={cn('space-y-2', disabled && 'opacity-55')}>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={homeScore}
          onChange={(e) => setHomeScore(stripNonDigits(e.target.value))}
          onBlur={() => handleBlur(false)}
          onKeyDown={handleKeyDown}
          className="match-input"
          disabled={disabled}
          aria-label={homeTeamName}
        />

        <span className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-neutral-300 min-w-0">
          {homeCountry && <TeamFlag countryCode={homeCountry} className="w-4 h-4 inline-block shrink-0" />}
          <span className="shrink-0">{homeTeamName}</span>
        </span>

        <span className="text-[10px] text-slate-400 font-mono">vs</span>

        <span className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-neutral-300 min-w-0">
          <span className="shrink-0">{awayTeamName}</span>
          {awayCountry && <TeamFlag countryCode={awayCountry} className="w-4 h-4 inline-block shrink-0" />}
        </span>

        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={awayScore}
          onChange={(e) => setAwayScore(stripNonDigits(e.target.value))}
          onBlur={() => handleBlur(true)}
          onKeyDown={handleKeyDown}
          className="match-input"
          disabled={disabled}
          aria-label={awayTeamName}
        />
      </div>

      {allowExtraTime && isDraw && (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Extra
          </p>
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={extraHome}
              onChange={(e) => setExtraHome(stripNonDigits(e.target.value))}
              onBlur={handleExtraBlur}
              onKeyDown={handleKeyDown}
              className="match-input"
              disabled={disabled}
              aria-label="Goles local tiempo extra"
            />
            <span className="text-xs text-slate-400 font-mono">–</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={extraAway}
              onChange={(e) => setExtraAway(stripNonDigits(e.target.value))}
              onBlur={handleExtraBlur}
              onKeyDown={handleKeyDown}
              className="match-input"
              disabled={disabled}
              aria-label="Goles visitante tiempo extra"
            />
          </div>

          {extraDraw && (
            <div className="flex flex-col items-center gap-1 animate-fade-in">
              <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Pen
              </p>
              <div className="flex gap-3 justify-center">
                <label className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs',
                  'border border-slate-200 dark:border-neutral-600',
                  penaltyWinner === 'home'
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300'
                    : 'bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-300',
                )}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={penaltyWinner === 'home'}
                    onChange={() => handlePenaltyChange('home')}
                    disabled={disabled}
                  />
                  {homeCountry && <TeamFlag countryCode={homeCountry} />}
                  {homeTeamName}
                </label>
                <label className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs',
                  'border border-slate-200 dark:border-neutral-600',
                  penaltyWinner === 'away'
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300'
                    : 'bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-300',
                )}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={penaltyWinner === 'away'}
                    onChange={() => handlePenaltyChange('away')}
                    disabled={disabled}
                  />
                  {awayCountry && <TeamFlag countryCode={awayCountry} size={16} />}
                  {awayTeamName}
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
