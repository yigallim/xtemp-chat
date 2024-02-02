import React, { createContext, ReactNode, useEffect, useState } from "react";
import loginRequest from "../api/loginRequest";
import { authInstance } from "../api/instance";

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextProps {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  id: string | null;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const loggedInUserId = async (): Promise<string | null> => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const _id = (
      await authInstance.post("/refresh", undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
    return _id;
  } catch (error) {
    return null;
  }
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [id, setId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = await loggedInUserId();
      setId(userId);
    };
    setInitialized(true);
    checkLoginStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { token, _id } = await loginRequest(username, password);
      localStorage.setItem("token", token);
      setId(_id);
    } catch {
      return false;
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setId(null);
  };
  return (
    <AuthContext.Provider value={{ login, logout, id }}>
      {initialized ? children : <></>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
