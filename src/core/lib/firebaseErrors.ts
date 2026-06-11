import { FirebaseError } from 'firebase/app'

export class NeedsVerificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NeedsVerificationError'
  }
}

const FIREBASE_ERROR_MAP: Record<string, string> = {
  'auth/email-already-in-use': 'Este correo ya está registrado',
  'auth/invalid-email': 'El correo electrónico no es válido',
  'auth/user-not-found': 'No existe una cuenta con ese correo',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-credential': 'Correo o contraseña incorrectos',
  'auth/too-many-requests': 'Demasiados intentos. Esperá un momento e intentá de nuevo',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
  'auth/popup-closed-by-user': 'Cerraste la ventana de inicio de sesión de Google',
  'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permití popups para este sitio',
  'auth/network-request-failed': 'Error de conexión. Revisá tu conexión a internet',
  'auth/unauthorized-domain': 'Este dominio no está autorizado. Agregalo en Firebase Console',
  'auth/operation-not-allowed': 'Este método de inicio de sesión no está habilitado',
  'auth/cancelled-popup-request': 'Operación cancelada',
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError && error.code in FIREBASE_ERROR_MAP) {
    return FIREBASE_ERROR_MAP[error.code]
  }
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado. Intentá de nuevo'
}
