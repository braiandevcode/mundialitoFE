import { Component, type ReactNode, type ErrorInfo } from 'react'

interface IErrorBoundaryProps {
  children: ReactNode
}

interface IErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): IErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-[#0a1a0f] text-center">
          <img
            src="/logo.webp"
            alt="MundialitoApp"
            className="h-16 w-auto mb-6 dark:invert text-emerald-600"
          />
          <h1 className="text-xl font-display text-slate-900 dark:text-white mb-2 tracking-wider">
            Algo salió mal
          </h1>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6 max-w-sm">
            Ocurrió un error inesperado. Recargá la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
