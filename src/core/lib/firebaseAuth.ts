import { auth } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  type UserCredential,
} from 'firebase/auth'

export const loginWithEmail = (email: string, password: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password)

export const registerWithEmail = (email: string, password: string): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password)

export const loginWithGoogle = (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return signInWithPopup(auth, provider)
}

export const sendVerificationEmail = (): Promise<void> =>
  sendEmailVerification(auth.currentUser!)

export const logoutUser = (): Promise<void> => signOut(auth)
