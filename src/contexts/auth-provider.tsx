import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  email: string;
};

type AuthContextProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext({} as AuthContextProps);

const AUTH_KEY = "auth_user";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isLocalStorageAvailable = typeof localStorage !== "undefined";

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (isLocalStorageAvailable) {
        const storedUser = localStorage.getItem(
          AUTH_KEY // process.env.NEXT_PUBLIC_LOCALSTORAGE_USER_KEY
        );
        if (storedUser) {
          return JSON.parse(storedUser) || false;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  });

  useEffect(() => {
    setLoaded(true);
    if (isLocalStorageAvailable) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
  }, [isLocalStorageAvailable, user]);

  return loaded ? (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  ) : null;
};
