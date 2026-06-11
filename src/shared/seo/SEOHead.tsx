import { Helmet } from 'react-helmet-async'

interface ISEOHeadProps {
  title: string
  description?: string
}

/*
  Componente reutilizable para establecer title y meta description por página.
  Uso: <SEOHead title="Mi Título | MundialitoApp" description="Descripción única de la página" />
*/
export default function SEOHead({ title, description }: ISEOHeadProps) {
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
    </Helmet>
  )
}
