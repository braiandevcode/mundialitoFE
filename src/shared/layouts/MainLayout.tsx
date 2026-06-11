/*
  Layout principal de la aplicación.
  Renderizo Navbar arriba, el contenido de la ruta activa via <Outlet /> en el medio.
  Protege todas las rutas privadas: redirige a /login si no hay sesión.
*/
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/providers'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import Footer from '@/shared/components/Footer'
import Navbar from './Navbar'

export default function MainLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a1a0f] text-slate-900 dark:text-neutral-100">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer variant="private" />
    </div>
  )
}
