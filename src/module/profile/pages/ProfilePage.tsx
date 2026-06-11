import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, ShieldAlert, RefreshCw } from 'lucide-react'
import { useAuth } from '@/shared/providers'
import { useToast } from '@/shared/providers'
import { usePredictions } from '@/module/predictions/hooks/usePredictions'
import SEOHead from '@/shared/seo/SEOHead'
import Card from '@/shared/components/Card'
import ErrorState from '@/shared/components/ErrorState'
import Button from '@/shared/components/Button'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import FootballIcon from '@/shared/icons/FootballIcon'
import type { IPrediction } from '@/core/types'

export default function ProfilePage() {
  const { user, isAdmin, roleLoaded, emailVerified, sendVerificationEmail, refreshUser } = useAuth()
  const { predictions, error } = usePredictions()
  const navigate = useNavigate()
  const { showToast } = useToast()

  if (!user) return null

  if (!roleLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )

  const totalPoints: number = predictions.reduce(
    (sum: number, p: IPrediction) => sum + (p.points ?? 0), 0,
  )
  const exactCount: number = predictions.filter(
    (p: IPrediction) => p.points !== null && p.points > 0,
  ).length
  const successRate: number = predictions.length > 0
    ? Math.round((exactCount / predictions.length) * 1000) / 10
    : 0

  const handleResend: () => Promise<void> = async () => {
    try {
      await sendVerificationEmail()
      showToast({ type: 'success', message: 'Correo de verificación enviado. Revisá tu bandeja de entrada' })
    } catch (err) {
      showToast({ type: 'error', message: err instanceof Error ? err.message : 'Error al enviar verificación' })
    }
  }

  const handleRefresh: () => Promise<void> = async () => {
    try {
      await refreshUser()
      showToast({ type: 'success', message: 'Estado actualizado' })
    } catch (err) {
      showToast({ type: 'error', message: err instanceof Error ? err.message : 'Error al actualizar' })
    }
  }

  return (
    <>
      <SEOHead title="Mi Perfil | MundialitoApp" description={isAdmin ? 'Panel de administración de MundialitoApp.' : 'Tu perfil personal de MundialitoApp: puntos, aciertos y precisión en los pronósticos del Mundial 2026.'} />
      <section className="max-w-lg mx-auto text-center">
      {/* Hero */}
      <div className="mb-8">
        <FootballIcon className="h-20 w-auto mx-auto mb-4" />
        <h1 className="text-xl sm:text-2xl font-display text-slate-900 dark:text-white mb-2 tracking-wider">
          Bienvenido, {user.name}
        </h1>
        {isAdmin ? (
          <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
            Panel de administración del Mundial 2026. Gestioná resultados y generá las llaves eliminatorias.
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
            Pronosticá los resultados de los 104 partidos del Mundial 2026.
            Sumá puntos por cada acierto exacto y competí en el ranking global.
          </p>
        )}
      </div>

      {!emailVerified && (
        <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4" />
              Email no verificado
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 max-w-xs">
              Revisá tu bandeja de entrada y hacé clic en el enlace de verificación.
              Si no lo encontrás, revisá spam o solicitá un nuevo correo.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleResend}>
                Reenviar verificación
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-3.5 h-3.5" />
                Ya lo verifiqué
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!isAdmin && error && (
        <ErrorState
          title="Error al cargar pronósticos"
          message={error}
        />
      )}

      {!isAdmin && (
        <>
        {/* Stats del usuario */}
        <Card className="mb-8">
          <div className="flex justify-center gap-6">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalPoints}</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Puntos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{exactCount}</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Aciertos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{successRate}%</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Precisión</p>
            </div>
          </div>
        </Card>

        {/* Call to action */}
        <Button
          onClick={() => navigate('/groups')}
          className="w-full text-base mb-3"
          size="lg"
        >
          Ir a predecir
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/guide')}
          className="w-full text-base"
          size="lg"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Guía de uso
        </Button>
        </>
      )}
    </section>
    </>
  )
}
