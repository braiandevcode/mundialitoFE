import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/core/utils'

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightSlot?: ReactNode
}

export default function Input({ label, error, leftIcon, rightSlot, className, id, ...props }: IInputProps) {
  const inputId: string | undefined = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-neutral-500">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-lg border bg-white dark:bg-neutral-800 text-sm text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 transition-all focus:outline-none focus:ring-2 focus:border-emerald-500',
            leftIcon ? 'pl-10' : 'px-3',
            rightSlot ? 'pr-10' : 'pr-3',
            'py-2.5',
            error
              ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
              : 'border-slate-300 dark:border-neutral-600 focus:ring-emerald-500/30',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 dark:text-neutral-500">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
