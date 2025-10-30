import React, { createContext, ReactNode, useContext, useState } from 'react';

type AuthContextType = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);

  const signIn = () => setSignedIn(true);
  const signOut = () => setSignedIn(false);

  return (
    <AuthContext.Provider value={{ signedIn, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
