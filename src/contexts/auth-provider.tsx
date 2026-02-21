import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  email: string;
};

type AuthContextProps = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextProps);

const AUTH_KEY = "auth_user";
const TOKEN_KEY = "id_token";

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
  const [user, setUserState] = useState<User | null>(() => {
    try {
      if (isLocalStorageAvailable) {
        const storedUser = localStorage.getItem(AUTH_KEY);
        if (storedUser) {
          return JSON.parse(storedUser) || null;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  });

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (isLocalStorageAvailable) {
      if (newUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  ) : null;
};
