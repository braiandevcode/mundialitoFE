import { UserPlus, Target, Trophy, BarChart3 } from 'lucide-react'
import SEOHead from '@/shared/seo/SEOHead'
import Card from '@/shared/components/Card'

const steps = [
  {
    icon: UserPlus,
    title: '1. Registrate',
    desc: 'Creá tu cuenta con nombre, email y contraseña. El proceso es inmediato y no requiere verificación.',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: Target,
    title: '2. Pronosticá',
    desc: 'Andá a la sección Grupos o Eliminatorias y cargá el resultado exacto que creés que va a tener cada partido. Podés cambiar tu pronóstico hasta 1 hora antes del inicio.',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    icon: Trophy,
    title: '3. Sumá puntos',
    desc: 'Cada acierto exacto te da 3 puntos (o 1 si otro usuario también acertó el mismo marcador). Los puntos se actualizan automáticamente cuando el partido termina.',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
  },
  {
    icon: BarChart3,
    title: '4. Seguí el ranking',
    desc: 'En la sección Ranking podés ver tu posición global y por jornada. Tu fila aparece resaltada para que te encuentres rápido.',
    color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  },
]

const tips = [
  'En partidos de eliminatorias, si hay empate podés agregar tiempo extra y penales.',
  'No hay límite de cambios: corregí tus pronósticos cuando quieras antes del partido.',
  'Los datos se guardan automáticamente al salir de cada campo.',
  'Usá el modo oscuro desde el icono de luna/sol en el menú superior.',
]

export default function GuidePage() {
  return (
    <>
      <SEOHead
        title="Guía de uso | MundialitoApp"
        description="Aprendé cómo usar MundialitoApp: registro, pronósticos, puntuación y ranking."
      />
      <section className="max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-display text-slate-900 dark:text-white mb-2 tracking-wider">
          ¿Cómo funciona MundialitoApp?
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400 mb-8">
          Seguí estos pasos para empezar a pronosticar
        </p>

        <div className="space-y-5">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="flex items-start gap-4 p-4 sm:p-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-neutral-100 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>

        <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mt-10 mb-4">
          Consejos útiles
        </h2>
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-neutral-400">
              <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">&#8226;</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
