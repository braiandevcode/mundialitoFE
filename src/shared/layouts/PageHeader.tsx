import type { ReactNode } from 'react'

interface IPageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

/*
  Encabezado de página estándar: título grande con Bebas Neue, subtítulo opcional y un slot
  para acciones (ej: botón "Editar" o "Cerrar sesión").
*/
export default function PageHeader({ title, subtitle, action }: IPageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-heading text-slate-900 dark:text-white uppercase tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  )
}
