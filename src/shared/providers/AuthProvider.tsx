import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  IUser,
  ILoginCredentials,
  IRegisterCredentials,
} from "@/core/types";
import { env } from "@/core/config";
import { useLocalStorage } from "@/core/hooks";
import { fetchCurrentUser } from "@/core/api/users";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  sendVerificationEmail as firebaseSendVerification,
  logoutUser,
} from "@/core/lib/firebaseAuth";
import { auth } from "@/core/lib/firebase";
import {
  getFirebaseErrorMessage,
  NeedsVerificationError,
} from "@/core/lib/firebaseErrors";
import {
  type UserCredential,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";

interface IAuthContext {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  roleLoaded: boolean;
  emailVerified: boolean;
  login: (credentials: ILoginCredentials) => Promise<void>;
  register: (credentials: IRegisterCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

interface IFirebaseTokenPayload {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

function firebaseUserToIUser(firebaseUser: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): IUser {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "",
    email: firebaseUser.email ?? "",
    avatar: firebaseUser.photoURL ?? undefined,
    totalPoints: 0,
    rank: 0,
  };
}

// function parseFirebaseTokenPayload(
//   token: string,
// ): { user: IUser; emailVerified: boolean } | null {
//   try {
//     const payload: IFirebaseTokenPayload = JSON.parse(
//       atob(token.split(".")[1]),
//     ) as IFirebaseTokenPayload;
//     return {
//       user: {
//         id: payload.sub ?? "",
//         name: payload.name ?? payload.email?.split("@")[0] ?? "",
//         email: payload.email ?? "",
//         avatar: payload.picture ?? undefined,
//         totalPoints: 0,
//         rank: 0,
//       },
//       emailVerified: payload.email_verified ?? false,
//     };
//   } catch {
//     return null;
//   }
// }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(
    "mundialito-token",
    null,
  );
  const [user, setUser] = useState<IUser | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roleLoaded, setRoleLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   if (storedToken) {
  //     try {
  //       if (storedToken.startsWith('mock-')) {
  //         const base64: string = storedToken.replace('mock-', '')
  //         const parsed: { user: IUser } = JSON.parse(atob(base64)) as { user: IUser }
  //         setUser(parsed.user)
  //         setEmailVerified(true)
  //         setRoleLoaded(true)
  //       } else {
  //         const parsed = parseFirebaseTokenPayload(storedToken)
  //         if (parsed) {
  //           setUser(parsed.user)
  //           setEmailVerified(parsed.emailVerified)
  //           fetchCurrentUser(storedToken)
  //             .then((fullUser: IUser) => {
  //               setUser((prev: IUser | null) => prev ? { ...prev, ...fullUser } : prev)
  //               setRoleLoaded(true)
  //             })
  //             .catch(() => { setRoleLoaded(true) /* fallback: role undefined */ })
  //         } else {
  //           setStoredToken(null)
  //           setRoleLoaded(true)
  //         }
  //       }
  //     } catch {
  //       setStoredToken(null)
  //       setRoleLoaded(true)
  //     }
  //   } else {
  //     setRoleLoaded(true)
  //   }
  //   setIsLoading(false)
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (storedToken?.startsWith("mock-")) {
      const base64: string = storedToken.replace("mock-", "");
      const parsed: { user: IUser } = JSON.parse(atob(base64)) as {
        user: IUser;
      };
      setUser(parsed.user);
      setEmailVerified(true);
      setRoleLoaded(true);
      try {
        const parsed = JSON.parse(atob(storedToken.replace("mock-", "")));
        setUser(parsed.user);
        setEmailVerified(true);
        setRoleLoaded(true);
      } catch {
        /* */
      }
      setIsLoading(false);
      return;
    }

    // Firebase: esperar a que Firebase detecte la sesión
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const freshToken = await firebaseUser.getIdToken();
        setStoredToken(freshToken);
        setUser(firebaseUserToIUser(firebaseUser));
        setEmailVerified(firebaseUser.emailVerified);

        try {
          const fullUser = await fetchCurrentUser(freshToken);
          setUser((prev) => (prev ? { ...prev, ...fullUser } : prev));
        } catch {
          /* fallback */
        }
      } else if (storedToken) {
        // Tenía token guardado pero Firebase no restauró sesión → token inválido
        setStoredToken(null);
        setUser(null);
      }
      setRoleLoaded(true);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !storedToken?.startsWith("mock-")) {
        const freshToken = await firebaseUser.getIdToken();
        setStoredToken(freshToken);
      }
    });
    return unsubscribe;
  }, [storedToken, setStoredToken]);

  const login: (credentials: ILoginCredentials) => Promise<void> = useCallback(
    async (credentials: ILoginCredentials) => {
      setIsLoading(true);

      try {
        const credential: UserCredential = await loginWithEmail(
          credentials.email,
          credentials.password,
        );
        if (!credential.user.emailVerified) {
          await logoutUser();
          throw new Error("Verificá tu correo antes de iniciar sesión");
        }
        const idToken: string = await credential.user.getIdToken();
        const baseUser: IUser = firebaseUserToIUser(credential.user);
        try {
          const fullUser: IUser = await fetchCurrentUser(idToken);
          setUser({ ...baseUser, ...fullUser });
        } catch {
          setUser(baseUser);
        }
        setRoleLoaded(true);
        setEmailVerified(true);
        setStoredToken(idToken);
      } catch (err) {
        throw new Error(getFirebaseErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [setStoredToken],
  );

  const register: (credentials: IRegisterCredentials) => Promise<void> =
    useCallback(
      async (credentials: IRegisterCredentials) => {
        setIsLoading(true);

        try {
          await registerWithEmail(credentials.email, credentials.password);
          await firebaseSendVerification();
          await logoutUser();
          throw new NeedsVerificationError(
            "Registro exitoso. Revisá tu correo para verificar tu cuenta",
          );
        } catch (err) {
          if (err instanceof NeedsVerificationError) throw err;
          throw new Error(getFirebaseErrorMessage(err));
        } finally {
          setIsLoading(false);
        }
      },
      [setStoredToken],
    );

  const signInWithGoogle: () => Promise<void> = useCallback(async () => {
    if (env.useMock) {
      return;
    }
    setIsLoading(true);
    try {
      const credential: UserCredential = await loginWithGoogle();
      const idToken: string = await credential.user.getIdToken();
      const baseUser: IUser = firebaseUserToIUser(credential.user);
      try {
        const fullUser: IUser = await fetchCurrentUser(idToken);
        setUser({ ...baseUser, ...fullUser });
      } catch {
        setUser(baseUser);
      }
      setRoleLoaded(true);
      setEmailVerified(true);
      setStoredToken(idToken);
    } catch (err) {
      throw new Error(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [setStoredToken]);

  const handleSendVerificationEmail: () => Promise<void> =
    useCallback(async () => {
      if (env.useMock) {
        return;
      }
      await firebaseSendVerification();
    }, []);

  const refreshUser: () => Promise<void> = useCallback(async () => {
    if (env.useMock) {
      return;
    }
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    const token = await auth.currentUser.getIdToken(true);
    setEmailVerified(auth.currentUser.emailVerified);
    setStoredToken(token);
  }, [setStoredToken]);

  const logout: () => void = useCallback(() => {
    if (!env.useMock) {
      logoutUser();
    }
    setUser(null);
    setEmailVerified(true);
    setStoredToken(null);
    setRoleLoaded(false);
  }, [setStoredToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: storedToken,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === "admin",
        roleLoaded,
        emailVerified,
        login,
        register,
        loginWithGoogle: signInWithGoogle,
        sendVerificationEmail: handleSendVerificationEmail,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
  const context: IAuthContext | undefined = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
