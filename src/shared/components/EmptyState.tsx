import { cn } from '@/core/utils'

interface IEmptyStateProps {
  icon?: string
  title: string
  description?: string
  className?: string
}

// Componente visual para mostrar un estado vacío con ícono, título y descripción opcional
export default function EmptyState({ icon = '0', title, description, className }: IEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <span className="text-4xl text-slate-300 dark:text-neutral-600 mb-3">{icon}</span>
      <h3 className="text-base font-medium text-slate-700 dark:text-neutral-300">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400 max-w-xs">{description}</p>
      )}
    </div>
  )
}
