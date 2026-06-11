import SEOHead from '@/shared/seo/SEOHead'

export default function TermsPage() {
  return (
    <>
      <SEOHead
        title="Términos y Condiciones | MundialitoApp"
        description="Términos y condiciones de uso de MundialitoApp, la plataforma de pronósticos del Mundial 2026."
      />
      <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-display text-slate-900 dark:text-white tracking-wider text-center mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400 text-center mb-10">
          Última actualización: junio 2026
        </p>

        <div className="space-y-8 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">1. Aceptación de los términos</h2>
            <p>Al acceder y usar MundialitoApp, aceptás cumplir con estos términos y condiciones. Si no estás de acuerdo, no uses la plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">2. Descripción del servicio</h2>
            <p>MundialitoApp es una plataforma de pronósticos deportivos gratuita para el Mundial 2026. Los usuarios registran predicciones de resultados y compiten en un ranking. El servicio se ofrece "tal cual" y puede modificarse o suspenderse sin previo aviso.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">3. Registro y cuenta</h2>
            <p>Para usar la plataforma necesitás crear una cuenta con nombre, email y contraseña. Sos responsable de mantener la confidencialidad de tu contraseña. No podés tener más de una cuenta ni suplantar a otro usuario.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">4. Uso aceptable</h2>
            <p>No podés usar la plataforma para actividades ilegales, acosar a otros usuarios, intentar vulnerar la seguridad del sistema, ni manipular los resultados o rankings mediante medios automatizados o fraudulentos.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">5. Propiedad intelectual</h2>
            <p>El código, diseño, marca y contenido de MundialitoApp son propiedad del desarrollador. No está permitida su reproducción, distribución o modificación sin autorización expresa. Los nombres de equipos, torneos y marcas relacionadas con la FIFA son propiedad de sus respectivos dueños.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">6. Limitación de responsabilidad</h2>
            <p>MundialitoApp es un juego de pronósticos sin valor real. No involucra apuestas ni dinero real. El desarrollador no se responsabiliza por errores en los datos, caídas del servicio, pérdida de información, o cualquier daño derivado del uso de la plataforma. El usuario asume que el servicio puede contener errores y se proporciona sin garantías de disponibilidad continua.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">7. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán en esta página. El uso continuado de la plataforma después de los cambios constituye aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">8. Jurisdicción</h2>
            <p>Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia se someterá a los tribunales de la Ciudad Autónoma de Buenos Aires.</p>
          </section>
        </div>
      </div>
    </>
  )
}
