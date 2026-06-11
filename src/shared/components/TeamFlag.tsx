import { type FC } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'

/*
  Mapa de códigos de país compuestos (ej: GB-ENG, GB-SCT) a sus componentes de bandera específicos.
  Los códigos de 2 letras se resuelven automáticamente desde el módulo country-flag-icons.
*/
const FLAG_MAP: Record<string, FC<{ className?: string; title?: string }>> = {
  'GB-ENG': Flags.GB_ENG,
  'GB-SCT': Flags.GB_SCT,
  'GB-NIR': Flags.GB_NIR,
  'GB-WLS': Flags.GB_WLS,
}

interface ITeamFlagProps {
  countryCode: string;
  className?: string;
  size?: number;
}

/*
  Renderizo la bandera de un país a partir de su código.
  - Si el código tiene más de 2 letras (ej: GB-ENG), busco en FLAG_MAP.
  - Si no, tomo las primeras 2 letras y busco el componente directamente.
  - Si no encuentro el componente, muestro un placeholder con las iniciales.
*/
export default function TeamFlag({ countryCode, size, className = 'w-5 h-5 inline-block shrink-0' }: ITeamFlagProps) {
  const base: string = countryCode.slice(0, 2).toUpperCase()
  const FlagComponent: FC<{ className?: string; title?: string }> | undefined = FLAG_MAP[countryCode] ?? (Flags as Record<string, FC<{ className?: string; title?: string }>>)[base]

  if (!FlagComponent) {
    return (
      <span className={`${className} fs-[${size}] flex items-center justify-center rounded bg-slate-100 dark:bg-neutral-700 text-[9px] font-bold text-slate-500`}>
        {base}
      </span>
    )
  }

  return <FlagComponent className={className} />
}
