import { get, patch } from './httpClient'
import type { IUser } from '@/core/types'

export function fetchCurrentUser(token: string): Promise<IUser> {
  return get<IUser>('/users/me', token)
}

export function updateCurrentUser(data: Partial<Pick<IUser, 'name' | 'avatar'>>, token: string): Promise<IUser> {
  return patch<IUser>('/users/me', data, token)
}

export function fetchUser(uid: string, token: string): Promise<IUser | null> {
  return get<IUser | null>(`/users/${uid}`, token)
}
