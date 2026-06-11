import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/shared/providers'
import { useToast } from '@/shared/providers'
import { Button, Input } from '@/shared/components'
import SEOHead from '@/shared/seo/SEOHead'
import type { ILoginCredentials } from '@/core/types'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<ILoginCredentials>({
    defaultValues: { email: 'demo@mundialito.app', password: '123456' },
    mode: 'onChange',
  })

  const emailValue: string = watch('email')
  const passwordValue: string = watch('password')
  const canSubmit: boolean = (emailValue?.length ?? 0) > 3 && (passwordValue?.length ?? 0) > 3

  const onSubmit: (data: ILoginCredentials) => Promise<void> = async () => {
    setIsSubmitting(true)
    try {
      await login({ email: emailValue, password: passwordValue })
      showToast({ type: 'success', message: '¡Bienvenido!' })
    } catch {
      showToast({ type: 'error', message: 'Email o contraseña incorrectos' })
      setValue('password', '')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin: () => Promise<void> = async () => {
    setIsGoogleSubmitting(true)
    try {
      await loginWithGoogle()
      showToast({ type: 'success', message: '¡Bienvenido!' })
    } catch {
      showToast({ type: 'error', message: 'Error al iniciar sesión con Google' })
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <>
      <SEOHead title="Iniciar Sesión | MundialitoApp" description="Accedé a tu cuenta de MundialitoApp para pronosticar los resultados del Mundial 2026." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="demo@mundialito.app"
        autoComplete="email"
        leftIcon={<Mail className="w-4 h-4" />}
        {...register('email')}
      />
      <Input
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••"
        autoComplete="current-password"
        leftIcon={<Lock className="w-4 h-4" />}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((p: boolean) => !p)}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        {...register('password')}
      />
      <Button type="submit" className="w-full" disabled={!canSubmit} isLoading={isSubmitting}>
        Ingresar
      </Button>
      <div className="text-center text-xs text-slate-400 dark:text-neutral-500 bg-slate-100 dark:bg-neutral-800 rounded-md px-3 py-2">
        Demo: <span className="font-mono text-slate-600 dark:text-neutral-300">demo@mundialito.app</span> | <span className="font-mono text-slate-600 dark:text-neutral-300">123456</span>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-black px-2 text-slate-400 dark:text-neutral-500">o</span>
        </div>
      </div>
      <Button type="button" variant="secondary" className="w-full gap-2" isLoading={isGoogleSubmitting} onClick={handleGoogleLogin}>
        <GoogleIcon />
        Continuar con Google
      </Button>
      <p className="text-center text-xs text-slate-400 dark:text-neutral-500">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="text-green-600 dark:text-green-400 hover:underline font-medium">
          Registrate
        </Link>
      </p>
    </form>
    </>
  )
}
