import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/core/utils'

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

// Mapeo de estilos de padding interno según la prop padding
const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export default function Card({ children, padding = 'md', hover = false, className, ...props }: ICardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-neutral-800 rounded-xl border border-slate-200/80 dark:border-neutral-700/50 shadow-sm',
        hover && 'card-hover',
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
