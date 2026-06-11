import type { IUser, IAuthResponse, ILoginCredentials, IRegisterCredentials } from '../types'

// Usuarios de prueba precargados para desarrollo y testing
export const mockUsers: IUser[] = [
  {
    id: 'U01',
    name: 'Demo User',
    email: 'demo@mundialito.app',
    avatar: undefined,
    totalPoints: 0,
    rank: 1,
  },
  {
    id: 'U02',
    name: 'Maria López',
    email: 'maria@mundialito.app',
    avatar: undefined,
    totalPoints: 0,
    rank: 2,
  },
]

/*
  Simulo un inicio de sesión contra el backend.
  - Busco al usuario por email en la lista mock.
  - Verifico que la contraseña sea "123456" (todos los usuarios mock usan la misma).
  - Si no coincide, lanzo error de credenciales inválidas.
  - Si coincide, genero un token mock codificando el usuario en base64 con prefijo "mock-".
  - Agrego una demora de 600ms para simular latencia de red.
*/
export async function mockLogin(credentials: ILoginCredentials): Promise<IAuthResponse> {
  await new Promise((r: (value: unknown) => void) => setTimeout(r, 600))

  const user: IUser | undefined = mockUsers.find((u: IUser) => u.email === credentials.email)

  if (!user || credentials.password !== '123456') {
    throw new Error('Credenciales inválidas')
  }

  const token: string = `mock-${btoa(JSON.stringify({ user }))}`
  return {
    user,
    token,
  }
}

/*
  Simulo el registro de un nuevo usuario.
  - Verifico que el email no esté ya registrado.
  - Creo un nuevo usuario con ID autoincremental.
  - Lo agrego a la lista mock para que persista durante la sesión.
  - Genero un token mock igual que en el login.
*/
export async function mockRegister(credentials: IRegisterCredentials): Promise<IAuthResponse> {
  await new Promise((r: (value: unknown) => void) => setTimeout(r, 600))

  const exists: boolean = mockUsers.some((u: IUser) => u.email === credentials.email)
  if (exists) {
    throw new Error('El email ya está registrado')
  }

  const newUser: IUser = {
    id: `U${String(mockUsers.length + 1).padStart(2, '0')}`,
    name: credentials.name,
    email: credentials.email,
    avatar: undefined,
    totalPoints: 0,
    rank: mockUsers.length + 1,
  }

  mockUsers.push(newUser)

  const token: string = `mock-${btoa(JSON.stringify({ user: newUser }))}`
  return {
    user: newUser,
    token,
  }
}
