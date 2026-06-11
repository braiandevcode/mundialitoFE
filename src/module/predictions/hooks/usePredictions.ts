import { useState, useEffect, useCallback } from 'react'
import type { IPrediction } from '@/core/types'
import { getErrorMessage } from '@/core/lib/errorMessages'
import { useAuth } from '@/shared/providers'
import { getPredictions, getPredictionByMatch, savePrediction } from '../services/predictionService'

interface IUsePredictionsReturn {
  predictions: IPrediction[]
  isLoading: boolean
  error: string | null
  getPrediction: (matchId: string) => Promise<IPrediction | undefined>
  submitPrediction: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    extraHomeScore?: number,
    extraAwayScore?: number,
    penaltyWinner?: 'home' | 'away',
  ) => Promise<IPrediction | undefined>
}

export function usePredictions(): IUsePredictionsReturn {
  const { user, token } = useAuth()
  const [predictions, setPredictions] = useState<IPrediction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !token) {
      setIsLoading(false)
      setPredictions([])
      return
    }
    setIsLoading(true)
    setError(null)
    getPredictions(user.id, token)
      .then((data: IPrediction[]) => {
        setPredictions(data)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        setError(getErrorMessage(err))
        setIsLoading(false)
      })
  }, [user, token])

  const getPrediction = useCallback(
    async (matchId: string): Promise<IPrediction | undefined> => {
      if (!user || !token) return
      try {
        const result: IPrediction | null = await getPredictionByMatch(user.id, matchId, token)
        return result ?? undefined
      } catch {
        return undefined
      }
    },
    [user, token],
  )

  const submitPrediction = useCallback(
    async (
      matchId: string,
      homeScore: number,
      awayScore: number,
      extraHomeScore?: number,
      extraAwayScore?: number,
      penaltyWinner?: 'home' | 'away',
    ): Promise<IPrediction | undefined> => {
      if (!user || !token) return
      const prediction: IPrediction = {
        id: `pred-${user.id}-${matchId}`,
        userId: user.id,
        matchId,
        homeScore,
        awayScore,
        extraHomeScore,
        extraAwayScore,
        penaltyWinner,
        points: null,
      }
      const saved: IPrediction = await savePrediction(prediction, token)
      setPredictions((prev: IPrediction[]) => {
        const idx: number = prev.findIndex((p: IPrediction) => p.matchId === matchId)
        if (idx >= 0) {
          const next: IPrediction[] = [...prev]
          next[idx] = saved
          return next
        }
        return [...prev, saved]
      })
      return saved
    },
    [user, token],
  )

  return { predictions, isLoading, error, getPrediction, submitPrediction }
}
