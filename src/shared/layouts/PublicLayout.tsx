import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth, useTheme } from '@/shared/providers'
import { ETheme } from '@/core/types'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import FootballIcon from '@/shared/icons/FootballIcon'
import Button from '@/shared/components/Button'
import Footer from '@/shared/components/Footer'

export default function PublicLayout() {
  const { isLoading, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a1a0f] text-slate-900 dark:text-neutral-100">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white shrink-0">
            <FootballIcon className="h-8 sm:h-9 w-auto text-emerald-600" />
            <span className="hidden sm:inline font-display tracking-wider">Mundialito</span>
            <span className="sm:hidden font-display tracking-wider">M</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={theme === ETheme.LIGHT ? 'Modo oscuro' : 'Modo claro'}
            >
              {theme === ETheme.LIGHT ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <Link to="/faq" className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors">
              FAQ
            </Link>
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  Ir a la app &rarr;
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Iniciar sesión
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Comenzar
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer variant="public" />
    </div>
  )
}
