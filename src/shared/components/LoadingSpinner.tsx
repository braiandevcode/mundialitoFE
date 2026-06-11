import { cn } from '@/core/utils'

interface ILoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Tamaños predefinidos para el spinner de carga
const sizeStyles: Record<string, string> = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export default function LoadingSpinner({ size = 'md', className }: ILoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-4" role="status" aria-label="Loading">
      <span
        className={cn(
          'border-2 border-slate-200 dark:border-neutral-600 border-t-green-600 dark:border-t-emerald-400 rounded-full animate-spin',
          sizeStyles[size],
          className,
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
