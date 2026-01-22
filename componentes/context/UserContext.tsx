"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

// --- 1. Definição de Interfaces Específicas (Contratos de Dados) ---

interface Materia {
  id: string;
  nome: string;
  horasEstudadas: number;
  cor?: string;
}

interface HistoricoEstudo {
  id: string;
  materia: string;
  duracao: number; // em minutos
  data: string;
}

interface Treino {
  id: string;
  tipo: string;
  exercicios: string[];
  data: string;
  duracao?: string;
}

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  categoria: string;
  data: string;
}

interface RegistroSaude {
  data: string;
  menstruando: boolean;
  notas: string;
  sintomas: {
    dorDeCabeca: boolean;
    colica: boolean;
    inchaco: boolean;
    seiosSensiveis: boolean;
    humorInstavel: boolean;
  };
}

// --- 2. Interface Principal do Progresso (Sem 'any') ---

interface UserProgress {
  saude?: Record<string, RegistroSaude>;
  financas?: Transacao[]; 
  materias?: Materia[];
  historicoEstudos?: HistoricoEstudo[];
  treinos?: Treino[];
  
  // MUDANÇA AQUI: tarefas saiu de dentro de 'agenda'
  tarefas?: { 
    id: string; // Adicionado id
    concluida: boolean; 
    titulo: string; 
    horario: string 
  }[];

  // Se você não usa mais o dashboard antigo, pode remover depois
  dashboard?: {
    habitos?: { agua?: string; sono?: string; meditacao?: string };
    metas?: { titulo: string; prazo: string }[];
  };
}

// --- 3. Interface do Usuário e do Contexto ---

interface User {
  id?: string;
  name: string;
  email: string;
  progress: UserProgress;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

// --- 4. Criação do Contexto ---

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      setLoading(true);
      const data = await getLoggedUser();
      setUser(data);
      // Cache local para persistência rápida entre reloads
      localStorage.setItem("userData", JSON.stringify(data));
    } catch (err) {
      console.error("Erro ao sincronizar usuário:", err);
      setUser(null);
      localStorage.removeItem("userData");
    } finally {
      setLoading(false);
    }
  }

  // Carrega o usuário ao montar o componente
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// --- 5. Hook Customizado ---

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}