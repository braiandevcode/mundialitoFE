import SEOHead from '@/shared/seo/SEOHead'

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Política de Privacidad | MundialitoApp"
        description="Política de privacidad de MundialitoApp. Conocé qué datos recogemos y cómo los usamos."
      />
      <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-display text-slate-900 dark:text-white tracking-wider text-center mb-2">
          Política de Privacidad
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400 text-center mb-10">
          Última actualización: junio 2026
        </p>

        <div className="space-y-8 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">1. Datos que recogemos</h2>
            <p>Recogemos únicamente la información que nos proporcionás al registrarte: nombre, dirección de email y contraseña (almacenada de forma segura). También almacenamos tus pronósticos y puntuaciones asociados a tu cuenta.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">2. Cómo usamos tus datos</h2>
            <p>Usamos tus datos para: (a) autenticarte en la plataforma, (b) mostrar tu nombre y puntuación en el ranking, (c) calcular y mostrar tus estadísticas personales, (d) mejorar la experiencia de la aplicación. No usamos tus datos para publicidad ni perfiles comerciales.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">3. Almacenamiento y seguridad</h2>
            <p>Tus datos se almacenan localmente en tu navegador (modo mock) o en servidores seguros con encriptación. Implementamos medidas de seguridad básicas pero no podemos garantizar seguridad absoluta en la transmisión de datos por internet.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">4. Compartición de datos</h2>
            <p>No compartimos, vendemos ni transferimos tus datos personales a terceros. Tu nombre y puntuación son visibles para otros usuarios en el ranking, pero tu email y contraseña permanecen privados.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">5. Cookies</h2>
            <p>Esta aplicación no utiliza cookies de rastreo ni seguimiento. Puede usar almacenamiento local del navegador (localStorage) para mantener tu sesión iniciada y almacenar tus pronósticos.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">6. Derechos del usuario</h2>
            <p>Podés solicitar la eliminación de tu cuenta y datos personales en cualquier momento contactándonos a través del repositorio del proyecto. También podés dejar de usar la aplicación en cualquier momento.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">7. Cambios en esta política</h2>
            <p>Podemos actualizar esta política de privacidad ocasionalmente. Los cambios se publicarán en esta página con la fecha de actualización correspondiente.</p>
          </section>

          <section>
            <h2 className="text-lg font-display text-slate-900 dark:text-white tracking-wider mb-2">8. Contacto</h2>
            <p>Si tenés preguntas sobre esta política de privacidad, podés abrir un issue en el repositorio de GitHub vinculado en el footer de esta página.</p>
          </section>
        </div>
      </div>
    </>
  )
}
