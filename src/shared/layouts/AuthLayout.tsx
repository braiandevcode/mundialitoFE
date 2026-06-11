/*
  Layout para páginas de autenticación (login/register).
  Si el usuario ya está autenticado, redirijo a /groups.
  Mientras carga el estado de auth, muestro un spinner.
*/
import { Outlet, Navigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/shared/providers'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import FootballIcon from '@/shared/icons/FootballIcon'

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-noise">
      <div className="w-full max-w-sm animate-slide-up">
        <Link
          to="/"
          className="inline-flex items-center gap-1 mb-4 text-xs text-slate-400 dark:text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-600/10 dark:bg-emerald-600/20 flex items-center justify-center mb-4">
            <FootballIcon className="h-12 w-auto text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-slate-900 dark:text-white tracking-wider">
            Mundialito
          </h1>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">Ingresa para pronosticar</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
