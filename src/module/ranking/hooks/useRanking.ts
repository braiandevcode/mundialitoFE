import { useState, useEffect, useCallback } from 'react'
import type { IRankingRound } from '@/core/types'
import { getErrorMessage } from '@/core/lib/errorMessages'
import { getRankingRounds } from '../services/rankingService'

interface IUseRankingReturn {
  rounds: IRankingRound[]
  activeRound: string
  setActiveRound: (id: string) => void
  currentRound: IRankingRound | undefined
  entries: IRankingRound['entries']
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useRanking(): IUseRankingReturn {
  const [rounds, setRounds] = useState<IRankingRound[]>([])
  const [activeRound, setActiveRound] = useState<string>('global')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    getRankingRounds()
      .then((data: IRankingRound[]) => {
        setRounds(data)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        setError(getErrorMessage(err))
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  const currentRound: IRankingRound | undefined = rounds.find((r: IRankingRound) => r.id === activeRound)

  return {
    rounds,
    activeRound,
    setActiveRound,
    currentRound,
    entries: currentRound?.entries ?? [],
    isLoading,
    error,
    refetch: fetch,
  }
}
