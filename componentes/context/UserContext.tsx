"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

// --- Tipagens ---
interface UserProgress {
  dashboard?: {
    treino?: {
      exercicios?: string[];
      duracao?: string;
      dias?: string[];
    };
    agenda?: {
      tarefas?: {
        concluida: boolean; titulo: string; horario: string 
}[];
    };
    habitos?: {
      agua?: string;
      sono?: string;
      meditacao?: string;
    };
    metas?: { titulo: string; prazo: string }[];
    refeicoes?: {
      cafe?: string[];
      almoco?: string[];
      jantar?: string[];
    };
  };
}

interface User {
  name: string;
  email: string;
  progress: UserProgress;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

// --- Contexto ---
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Função para buscar os dados do backend
  async function refreshUser() {
    try {
      const data = await getLoggedUser();
      setUser(data);
      // opcional: salvar no localStorage como cache
      localStorage.setItem("userData", JSON.stringify(data));
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setUser(null);
      localStorage.removeItem("userData");
    }
  }

  
  useEffect(() => {
  // Função async dentro do useEffect
  async function loadUser() {
    await refreshUser();
  }

  loadUser();
}, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

// --- Hook para usar o contexto facilmente ---
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve ser usado dentro de UserProvider");
  return context;
}
