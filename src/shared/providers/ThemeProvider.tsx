import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type TTheme = 'light' | 'dark'

interface IThemeContextValue {
  theme: TTheme
  toggleTheme: () => void
}

const ThemeContext = createContext<IThemeContextValue | undefined>(undefined)

/*
  Proveedor de tema claro/oscuro.
  - Leo el tema guardado en localStorage o uso la preferencia del sistema.
  - Aplico la clase 'dark' al <html> para que Tailwind active el modo oscuro.
  - toggleTheme() invierte el valor actual y lo persiste.
*/
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<TTheme>(() => {
    const stored: string | null = localStorage.getItem('mundialito-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root: HTMLElement = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('mundialito-theme', theme)
  }, [theme])

  const toggleTheme = (): void => {
    setTheme((prev: TTheme) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): IThemeContextValue {
  const ctx: IThemeContextValue | undefined = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
