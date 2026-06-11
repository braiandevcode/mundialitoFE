/*
  Barra de navegación superior.
  Muestro links a Grupos, Ranking y Eliminatorias en desktop (horizontal) y mobile (tab inferior).
  Incluye toggle de tema claro/oscuro, nombre de usuario y botón de salir.
*/
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/providers'
import { useTheme } from '@/shared/providers'
import { ETheme } from '@/core/types'
import FootballIcon from '@/shared/icons/FootballIcon'
import { cn } from '@/core/utils'
import Button from '@/shared/components/Button'
import { LayoutGrid, Trophy, GitBranch, Shield, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface INavLink {
  to: string
  label: string
  icon: LucideIcon
}

const navLinks: INavLink[] = [
  { to: '/groups', label: 'Grupos', icon: LayoutGrid },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/bracket', label: 'Eliminatorias', icon: GitBranch },
]

const adminNavLinks: INavLink[] = [
  { to: '/admin/groups', label: 'Grupos', icon: LayoutGrid },
  { to: '/admin/bracket', label: 'Eliminatorias', icon: GitBranch },
]

export default function Navbar() {
  const { user, isAdmin, roleLoaded, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white shrink-0">
          <FootballIcon className="h-8 sm:h-9 w-auto text-emerald-600" />
          <span className="hidden sm:inline font-display tracking-wider">Mundialito</span>
          <span className="sm:hidden font-display tracking-wider">M</span>
        </Link>

        {/* Navegación desktop: links con icono */}
        <nav className="hidden sm:flex items-center gap-1">
          {!roleLoaded ? (
            <div className="flex gap-1">
              {adminNavLinks.map((link: INavLink) => (
                <div key={link.to} className="w-20 h-9 rounded-lg bg-slate-100 dark:bg-neutral-800 animate-pulse" />
              ))}
            </div>
          ) : (
            (isAdmin ? adminNavLinks : navLinks).map((link: INavLink) => {
              const Icon: LucideIcon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname.startsWith(link.to)
                      ? isAdmin
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Toggle de tema con icono de luna/sol */}
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

          {/* Nombre del usuario en desktop */}
          {user && (
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                {user.name}
              </Button>
            </Link>
          )}
          {user && (
            <Button variant="ghost" size="sm" onClick={logout} className="text-xs sm:text-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Salir</span>
              <span className="sm:hidden ml-1">Salir</span>
            </Button>
          )}
        </div>
      </div>

      {/* Navegación mobile: barra inferior con iconos */}
      <nav className="sm:hidden flex items-center justify-around px-2 pb-2 pt-1 border-t border-slate-100 dark:border-neutral-800">
        {!roleLoaded ? (
          <div className="flex justify-around w-full">
            {adminNavLinks.map((link: INavLink) => (
              <div key={link.to} className="w-12 h-10 rounded-md bg-slate-100 dark:bg-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : (
          (isAdmin ? adminNavLinks : navLinks).map((link: INavLink) => {
            const Icon: LucideIcon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  location.pathname.startsWith(link.to)
                    ? isAdmin
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-neutral-400',
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{link.label}</span>
              </Link>
            )
          })
        )}
      </nav>
    </header>
  )
}
