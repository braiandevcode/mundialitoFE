import { useNavigate } from 'react-router-dom'
import { ArrowRight, Target, Users, Trophy, Sparkles, Eye } from 'lucide-react'
import SEOHead from '@/shared/seo/SEOHead'
import Button from '@/shared/components/Button'
import FootballIcon from '@/shared/icons/FootballIcon'

const steps = [
  {
    icon: Eye,
    title: 'Registrate',
    desc: 'Creá tu cuenta gratis en segundos. Solo necesitás un email y una contraseña.',
  },
  {
    icon: Target,
    title: 'Pronosticá',
    desc: 'Antes de cada partido, cargá tu pronóstico del resultado exacto en grupos y eliminatorias.',
  },
  {
    icon: Trophy,
    title: 'Competí',
    desc: 'Sumá puntos por cada acierto exacto y escalá posiciones en el ranking global.',
  },
]

const reasons = [
  { icon: Users, title: 'Gratuito y social', desc: 'Compartís el tablero con amigos y ves cómo avanza cada uno.' },
  { icon: Sparkles, title: 'Solo resultados exactos', desc: 'No vale el ganador nomás: tenés que clavar el marcador para sumar.' },
  { icon: Trophy, title: 'Cobertura completa', desc: 'Los 104 partidos del Mundial 2026: grupos, 16avos, 8vos, 4tos, semis y final.' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <SEOHead
        title="MundialitoApp - Pronósticos del Mundial 2026"
        description="Pronosticá los 104 partidos del Mundial 2026. Competí en el ranking global y demostrá que sabés de fútbol."
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(22,163,74,0.12),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center relative">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-emerald-600/10 dark:bg-emerald-600/20 flex items-center justify-center mx-auto mb-6 animate-fade-in">
            <FootballIcon className="h-14 sm:h-20 w-auto text-emerald-600" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display text-slate-900 dark:text-white tracking-wider mb-4 animate-slide-up">
            Mundialito <span className="text-emerald-600">2026</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed animate-fade-in">
            Pronosticá los 104 partidos del Mundial. Competí en el ranking.
            Demostrá que sabés de fútbol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
            <Button size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto text-base px-8">
              Comenzar ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto text-base">
              Iniciar sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-t border-slate-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-display text-slate-900 dark:text-white text-center tracking-wider mb-2">
            Cómo funciona
          </h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400 text-center mb-10 sm:mb-12">
            Tres pasos simples para empezar
          </p>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="text-center animate-fade-in" style={{ animationDelay: `${i * 120}ms` }}>
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Por qué participar */}
      <section className="border-t border-slate-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-display text-slate-900 dark:text-white text-center tracking-wider mb-10 sm:mb-12">
            ¿Por qué participar?
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {reasons.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-700 p-5 sm:p-6 text-center animate-fade-in card-hover" style={{ animationDelay: `${i * 120}ms` }}>
                  <Icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-base font-display text-slate-900 dark:text-white tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-slate-200 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-display text-slate-900 dark:text-white tracking-wider mb-3">
            ¿Listo para el desafío?
          </h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mb-8">
            El Mundial 2026 te espera. Registrate gratis y empezá a pronosticar.
          </p>
          <Button size="lg" onClick={() => navigate('/register')} className="text-base px-8">
            Comenzar ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </>
  )
}
