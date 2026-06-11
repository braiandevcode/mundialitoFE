/*
  Página de pronósticos (ruta /predictions, actualmente no en uso en la navegación principal).
  Muestro la lista de todos los pronósticos del usuario con puntaje y fecha.
  Mantengo texto en español aunque la página no esté enlazada.
*/
import { usePredictions } from '@/module/predictions/hooks/usePredictions'
import Card from '@/shared/components/Card'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

export default function PredictionsPage() {
  const { predictions, isLoading } = usePredictions()

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Mis Pronósticos
      </h1>

      {predictions.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Sin pronósticos"
          description="Andá a un grupo y empezá a pronosticar resultados."
        />
      ) : (
        <div className="space-y-3">
          {predictions.map((pred) => (
            <Card key={pred.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-xs font-mono text-slate-400">
                    Partido #{pred.matchId.replace(/[^0-9]/g, '')}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-semibold text-slate-800 dark:text-neutral-200">
                      {pred.homeScore} - {pred.awayScore}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {pred.points !== null ? (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      +{pred.points} pts
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-700 text-slate-500 dark:text-neutral-400">
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
