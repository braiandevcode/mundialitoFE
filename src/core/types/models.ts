/*
  Interfaces y tipos del modelo de datos de la aplicación.
  - IUser, ITeam, IGroup, IMatch: entidades principales del mundial.
  - IPrediction: pronóstico de un usuario para un partido.
  - IRankingEntry / IRankingRound: datos de la tabla de posiciones.
  - IAuthState, ILoginCredentials, IRegisterCredentials, IAuthResponse: tipos de autenticación.
*/
import type { EGroupId, EMatchStatus, EKnockoutRound } from './enums'

type TGroupId = keyof typeof EGroupId
type TKnockoutRound = `${EKnockoutRound}`
type TMatchStatus = `${EMatchStatus}`
type TToastType = 'success' | 'error' | 'warning' | 'info'
type TTheme = 'light' | 'dark'

export type { TGroupId, TKnockoutRound, TMatchStatus, TToastType, TTheme }

export interface IUser {
  id: string
  name: string
  email: string
  avatar?: string
  role?: 'user' | 'admin'
  totalPoints: number
  rank: number
}

export interface ITeam {
  id: string
  name: string
  countryCode: string
  groupId: TGroupId
}

export interface IGroup {
  id: TGroupId
  name: string
  teams: ITeam[]
  matches: IMatch[]
}

export interface IMatch {
  id: string
  groupId: TGroupId | null
  round: TKnockoutRound | null
  matchNumber: number
  homeTeamId: string
  awayTeamId: string
  date: string
  stadium: string
  status: TMatchStatus
  homeScore: number | null
  awayScore: number | null
  extraHomeScore: number | null
  extraAwayScore: number | null
  penaltyHomeScore: number | null
  penaltyAwayScore: number | null
}

export interface IPrediction {
  id: string
  userId: string
  matchId: string
  homeScore: number
  awayScore: number
  extraHomeScore?: number
  extraAwayScore?: number
  penaltyWinner?: 'home' | 'away'
  points: number | null
}

export interface IRankingEntry {
  userId: string
  userName: string
  avatar?: string
  totalPoints: number
  predictionsCount: number
  exactScores: number
  successRate: number
}

export interface IRankingRound {
  id: string
  label: string
  entries: IRankingEntry[]
}

export interface IToast {
  id: string
  type: TToastType
  message: string
}

export interface IAuthState {
  user: IUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IRegisterCredentials {
  name: string
  email: string
  password: string
}

export interface IAuthResponse {
  user: IUser
  token: string
}
