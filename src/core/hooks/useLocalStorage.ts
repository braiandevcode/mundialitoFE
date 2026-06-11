/*
  Hook para persistir y sincronizar un valor con localStorage.
  - Lee el valor guardado al iniciar o usa initialValue si no existe o falla el parse.
  - setValue actualiza tanto el estado como localStorage automáticamente.
  - Soporta actualización por función (como useState).
*/
import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item: string | null = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev: T) => {
        const nextValue: T = value instanceof Function ? value(prev) : value
        window.localStorage.setItem(key, JSON.stringify(nextValue))
        return nextValue
      })
    },
    [key],
  )

  return [storedValue, setValue] as const
}
