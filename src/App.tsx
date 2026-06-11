import ErrorBoundary  from '@/shared/components/ErrorBoundary'
import { AuthProvider, ThemeProvider, ToastProvider, ToastContainer } from '@/shared/providers'
import AppRoutes from '@/routes'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
