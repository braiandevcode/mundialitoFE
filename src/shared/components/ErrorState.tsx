import type { ReactNode } from 'react'
import Card from './Card'

interface IErrorStateProps {
  title?: string
  message?: string
  action?: ReactNode
}

// Componente visual para mostrar errores con mensaje y acción opcional (ej: reintentar)
export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action,
}: IErrorStateProps) {
  return (
    <Card className="text-center py-12">
      <div className="text-red-500 text-4xl mb-3">!</div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-neutral-100 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-neutral-400 mb-4">{message}</p>
      {action}
    </Card>
  )
}
