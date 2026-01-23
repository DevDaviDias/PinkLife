"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

// --- 1. Definição de Interfaces Específicas ---

interface Materia {
  id: string;
  nome: string;
  metaHoras: number; // Adicionado para bater com o index.js
  horasEstudadas: number;
}

interface Habito {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  frequencia: string;
  concluido: boolean;
  streak: number;
  emoji: string;
}

interface HistoricoEstudo {
  id: string;
  materia: string;
  duracaoSegundos: number; // Ajustado para bater com o backend (index.js)
  comentario?: string;
  data: string;
}

interface Treino {
  id: string;
  nome: string;
  categoria: string;
  duracao: string;
  exercicios: string[];
}

interface Transacao {
  id: string; // backend usa UUID agora
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
  sintomas: string[]; // Simplificado para array de strings como no backend
}
interface BelezaData {
  skincareManha: {
    limpador: boolean;
    tonico: boolean;
    hidratante: boolean;
    protetor: boolean;
  };
  skincareNoite: {
    demaquilante: boolean;
    limpador: boolean;
    serum: boolean;
    hidratante: boolean;
  };
  cronogramaCapilar: string;
}
// --- 2. Interface Principal do Progresso ---

interface UserProgress {
  saude?: Record<string, RegistroSaude>;
  financas?: Transacao[]; 
  materias?: Materia[];
  habitos?: Habito[];
  historicoEstudos?: HistoricoEstudo[];
  treinos?: Treino[];
  tarefas?: { 
    id: string; 
    concluida: boolean; 
    titulo: string; 
    horario: string 
  }[];
  beleza?: BelezaData; // <--- ADICIONE ESTA LINHA AQUI
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

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      setLoading(true);
      const data = await getLoggedUser();
      setUser(data);
      localStorage.setItem("userData", JSON.stringify(data));
    } catch (err) {
      console.error("Erro ao sincronizar usuário:", err);
      // Tenta recuperar do cache se falhar a rede (opcional)
      const cached = localStorage.getItem("userData");
      if (cached) setUser(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}