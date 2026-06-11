import SEOHead from '@/shared/seo/SEOHead'

const faqs = [
  {
    q: '¿Qué es MundialitoApp?',
    a: 'Es una plataforma gratuita de pronósticos deportivos para el Mundial 2026. Registrás tus predicciones sobre los resultados de cada partido y competís en el ranking contra otros usuarios.',
  },
  {
    q: '¿Cómo me registro?',
    a: 'Hacé clic en "Comenzar ahora", completá tu nombre, email y una contraseña, y listo. No necesitas ningún dato sensible ni verificación adicional.',
  },
  {
    q: '¿Es gratis?',
    a: 'Sí, completamente gratis. No hay suscripciones, pagos ni compras dentro de la app.',
  },
  {
    q: '¿Cómo se puntúan los pronósticos?',
    a: 'Solo se puntúa el resultado exacto. Si pronosticás 2–1 y el partido termina 2–1, sumás 3 puntos. Si otro usuario también acertó el mismo resultado exacto, cada uno suma 1 punto. Cualquier otro resultado suma 0.',
  },
  {
    q: '¿Puedo cambiar mi pronóstico después de guardarlo?',
    a: 'Sí, podés modificarlo tantas veces como quieras hasta que comience el partido. Una vez que el partido empezó, el pronóstico queda bloqueado.',
  },
  {
    q: '¿Cuándo se cierra la ventana para pronosticar?',
    a: 'Podés pronosticar hasta 1 hora antes del inicio del partido. Pasado ese límite, la predicción se bloquea automáticamente.',
  },
  {
    q: '¿Qué partidos puedo pronosticar?',
    a: 'Todos los 104 partidos del Mundial 2026: 72 de fase de grupos y 32 de eliminatorias (16avos, 8vos, 4tos, semis, final y tercer puesto).',
  },
  {
    q: '¿Cómo funcionan los pronósticos en eliminatorias?',
    a: 'En partidos de eliminatorias, si el marcador termina empatado después de los 90 minutos, podés agregar el resultado del tiempo extra y, si sigue empatado, el ganador por penales.',
  },
  {
    q: '¿Qué son las jornadas (J1, J2, J3)?',
    a: 'La fase de grupos tiene 3 jornadas. Cada jornada agrupa los partidos de una fecha específica. El ranking muestra puntuación global y también desglosada por cada jornada.',
  },
  {
    q: '¿Cómo veo mi posición en el ranking?',
    a: 'Andá a la sección "Ranking" en el menú principal. Ahí ves la tabla completa con todos los participantes ordenados por puntos. Tu fila aparece resaltada en amarillo.',
  },
  {
    q: '¿Puedo compartir mis pronósticos?',
    a: 'Por ahora la experiencia es individual. Cada usuario ve su propio progreso y el ranking general. Estamos trabajando en funciones sociales para futuras versiones.',
  },
  {
    q: '¿Qué hago si encuentro un error o tengo una sugerencia?',
    a: 'Contactanos a través del repositorio del proyecto en GitHub (enlace en el footer). Agradecemos todo feedback para mejorar la experiencia.',
  },
]

export default function FAQPage() {
  return (
    <>
      <SEOHead
        title="Preguntas Frecuentes | MundialitoApp"
        description="Resolvé tus dudas sobre cómo funciona MundialitoApp: registro, puntuación, pronósticos y más."
      />
      <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-display text-slate-900 dark:text-white tracking-wider text-center mb-2">
          Preguntas Frecuentes
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400 text-center mb-10">
          Todo lo que necesitás saber sobre MundialitoApp
        </p>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-700 overflow-hidden transition-all"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm sm:text-base font-medium text-slate-800 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors list-none">
                {faq.q}
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed border-t border-slate-100 dark:border-neutral-800 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
