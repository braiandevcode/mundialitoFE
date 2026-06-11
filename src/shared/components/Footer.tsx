import { Link } from 'react-router-dom'
import FootballIcon from '@/shared/icons/FootballIcon'

const GITHUB_URL: string = `${import.meta.env.VITE_GITHUB}`;

interface IFooterProps {
  variant?: 'public' | 'private'
}

export default function Footer({ variant = 'public' }: IFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <FootballIcon className="h-6 w-auto" />
          <span className="font-display tracking-wider text-base">Mundialito</span>
        </Link>

        {variant === 'public' && (
          <nav className="flex items-center gap-4 text-xs text-slate-500 dark:text-neutral-400">
            <Link to="/faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">FAQ</Link>
            <Link to="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Términos</Link>
            <Link to="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacidad</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <span className="text-xs text-slate-400 dark:text-neutral-500">
            &copy; {year} MundialitoApp
          </span>
        </div>
      </div>
    </footer>
  )
}
