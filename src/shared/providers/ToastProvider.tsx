import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type TToastType = 'success' | 'error' | 'info'

interface IToast {
  id: number
  message: string
  type: TToastType
}

interface IToastContextValue {
  toasts: IToast[]
  showToast: (toast: { type: TToastType; message: string }) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<IToastContextValue | undefined>(undefined)

let _nextId: number = 1

/*
  Proveedor de notificaciones toast.
  addToast() crea un toast con ID único y tipo (success/error/info).
  removeToast() lo elimina de la lista. Uso useCallback para evitar renders innecesarios.
*/
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<IToast[]>([])

  const showToast = useCallback(({ type, message }: { type: TToastType; message: string }): void => {
    const id: number = _nextId++
    setToasts((prev: IToast[]) => [...prev, { id, message, type }])
    // Auto-destrucción después de 3 segundos
    setTimeout(() => {
      setToasts((prev: IToast[]) => prev.filter((t: IToast) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: number): void => {
    setToasts((prev: IToast[]) => prev.filter((t: IToast) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): IToastContextValue {
  const ctx: IToastContextValue | undefined = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

/*
  Renderizado flotante de los toasts activos.
  Cada toast tiene un color según su tipo y un botón para cerrarlo manualmente.
*/
export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  const typeStyles: Record<TToastType, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-800 text-white',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast: IToast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg text-sm animate-slide-up ${typeStyles[toast.type]}`}
          role="alert"
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-70 hover:opacity-100 text-lg leading-none"
            aria-label="Cerrar notificación"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )
}
