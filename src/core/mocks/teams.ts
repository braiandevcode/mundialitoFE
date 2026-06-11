import type { ITeam, TGroupId } from '../types'

// Contrato interno para los datos crudos de cada equipo antes de asignarles ID
interface ITeamRaw {
  name: string
  countryCode: string
}

// Mapeo de todos los equipos organizados por grupo (A a L) con nombre y código de país
const teamsByGroup: Record<TGroupId, ITeamRaw[]> = {
  A: [
    { name: 'Mexico', countryCode: 'MX' },
    { name: 'South Africa', countryCode: 'ZA' },
    { name: 'South Korea', countryCode: 'KR' },
    { name: 'Czech Republic', countryCode: 'CZ' },
  ],
  B: [
    { name: 'Canada', countryCode: 'CA' },
    { name: 'Bosnia and Herzegovina', countryCode: 'BA' },
    { name: 'Qatar', countryCode: 'QA' },
    { name: 'Switzerland', countryCode: 'CH' },
  ],
  C: [
    { name: 'Brazil', countryCode: 'BR' },
    { name: 'Morocco', countryCode: 'MA' },
    { name: 'Haiti', countryCode: 'HT' },
    { name: 'Scotland', countryCode: 'GB-SCT' },
  ],
  D: [
    { name: 'USA', countryCode: 'US' },
    { name: 'Paraguay', countryCode: 'PY' },
    { name: 'Australia', countryCode: 'AU' },
    { name: 'Turkey', countryCode: 'TR' },
  ],
  E: [
    { name: 'Germany', countryCode: 'DE' },
    { name: 'Curaçao', countryCode: 'CW' },
    { name: 'Ivory Coast', countryCode: 'CI' },
    { name: 'Ecuador', countryCode: 'EC' },
  ],
  F: [
    { name: 'Netherlands', countryCode: 'NL' },
    { name: 'Japan', countryCode: 'JP' },
    { name: 'Sweden', countryCode: 'SE' },
    { name: 'Tunisia', countryCode: 'TN' },
  ],
  G: [
    { name: 'Belgium', countryCode: 'BE' },
    { name: 'Egypt', countryCode: 'EG' },
    { name: 'Iran', countryCode: 'IR' },
    { name: 'New Zealand', countryCode: 'NZ' },
  ],
  H: [
    { name: 'Spain', countryCode: 'ES' },
    { name: 'Cape Verde', countryCode: 'CV' },
    { name: 'Saudi Arabia', countryCode: 'SA' },
    { name: 'Uruguay', countryCode: 'UY' },
  ],
  I: [
    { name: 'France', countryCode: 'FR' },
    { name: 'Senegal', countryCode: 'SN' },
    { name: 'Iraq', countryCode: 'IQ' },
    { name: 'Norway', countryCode: 'NO' },
  ],
  J: [
    { name: 'Argentina', countryCode: 'AR' },
    { name: 'Algeria', countryCode: 'DZ' },
    { name: 'Austria', countryCode: 'AT' },
    { name: 'Jordan', countryCode: 'JO' },
  ],
  K: [
    { name: 'Portugal', countryCode: 'PT' },
    { name: 'DR Congo', countryCode: 'CD' },
    { name: 'Uzbekistan', countryCode: 'UZ' },
    { name: 'Colombia', countryCode: 'CO' },
  ],
  L: [
    { name: 'England', countryCode: 'GB-ENG' },
    { name: 'Croatia', countryCode: 'HR' },
    { name: 'Ghana', countryCode: 'GH' },
    { name: 'Panama', countryCode: 'PA' },
  ],
}

// Contador secuencial para asignar IDs únicos a cada equipo (T01, T02, ...)
let teamCounter: number = 0

/*
  Aplano el mapeo de grupos a un arreglo plano de equipos.
  Por cada grupo, transformo cada equipo raw en un objeto ITeam con ID único,
  nombre, código de país y el grupo al que pertenece.
*/
export const teams: ITeam[] = Object.entries(teamsByGroup).flatMap(
  ([groupId, rawTeams]: [string, ITeamRaw[]]) =>
    rawTeams.map((raw: ITeamRaw) => {
      teamCounter++
      return {
        id: `T${String(teamCounter).padStart(2, '0')}`,
        name: raw.name,
        countryCode: raw.countryCode,
        groupId: groupId as TGroupId,
      }
    }),
)

// Mapa de búsqueda rápida de equipos por su ID, usado en toda la app
export const teamsMap: Map<string, ITeam> = new Map(teams.map((t: ITeam) => [t.id, t]))

// Códigos FIFA de 3 letras para mostrar nombres cortos sin que salten de línea en la UI
const SHORT_NAMES: Record<string, string> = {
  MX: 'MEX', ZA: 'RSA', KR: 'KOR', CZ: 'CZE',
  CA: 'CAN', BA: 'BIH', QA: 'QAT', CH: 'SUI',
  BR: 'BRA', MA: 'MAR', HT: 'HTI', 'GB-SCT': 'SCO',
  US: 'USA', PY: 'PAR', AU: 'AUS', TR: 'TUR',
  DE: 'GER', CW: 'CUR', CI: 'CIV', EC: 'ECU',
  NL: 'NED', JP: 'JPN', SE: 'SWE', TN: 'TUN',
  BE: 'BEL', EG: 'EGY', IR: 'IRN', NZ: 'NZL',
  ES: 'ESP', CV: 'CPV', SA: 'KSA', UY: 'URU',
  FR: 'FRA', SN: 'SEN', IQ: 'IRQ', NO: 'NOR',
  AR: 'ARG', DZ: 'ALG', AT: 'AUT', JO: 'JOR',
  PT: 'POR', CD: 'COD', UZ: 'UZB', CO: 'COL',
  'GB-ENG': 'ENG', HR: 'CRO', GH: 'GHA', PA: 'PAN',
}

// Mapa de ID de equipo → nombre corto de 3 letras (FIFA style)
export const teamShortNamesMap: Map<string, string> = new Map(
  teams.map((t: ITeam) => [t.id, SHORT_NAMES[t.countryCode] ?? t.name.substring(0, 3).toUpperCase()]),
)
