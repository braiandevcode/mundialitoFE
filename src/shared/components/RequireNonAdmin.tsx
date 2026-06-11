import { Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/providers'
import type { ReactNode } from 'react'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

interface IRequireNonAdminProps {
  children: ReactNode
}

export default function RequireNonAdmin({ children }: IRequireNonAdminProps) {
  const { isAdmin, roleLoaded } = useAuth()

  if (!roleLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isAdmin) {
    return <Navigate to="/admin/groups" replace />
  }

  return <>{children}</>
}
