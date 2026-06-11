/*
  Enumeraciones de la aplicación.
  - EGroupId: 12 grupos (A-L) del Mundial 2026.
  - EMatchStatus: estados de un partido (programado, en vivo, finalizado).
  - EKnockoutRound: rondas del bracket eliminatorio.
  - EToastType: tipos de notificación toast.
  - EScoringRule: reglas de puntuación para pronósticos.
  - ETheme: modos de tema claro/oscuro.
*/

export enum EGroupId {
  A = 'A', B = 'B', C = 'C', D = 'D', E = 'E', F = 'F',
  G = 'G', H = 'H', I = 'I', J = 'J', K = 'K', L = 'L',
}

export enum EMatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
}

export enum EKnockoutRound {
  R32 = 'R32',
  R16 = 'R16',
  QF = 'QF',
  SF = 'SF',
  THIRD_PLACE = '3rd',
  FINAL = 'Final',
}

export enum EToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum EScoringRule {
  UNIQUE_EXACT = 3,
  SHARED_EXACT = 1,
  WRONG = 0,
}

export enum ETheme {
  LIGHT = 'light',
  DARK = 'dark',
}
