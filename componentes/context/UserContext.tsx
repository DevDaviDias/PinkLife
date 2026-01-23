"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

// --- 1. Definição de Interfaces Específicas ---

interface Materia {
  id: string;
  nome: string;
  metaHoras: number;
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
  duracaoSegundos: number;
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
  id: string;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa" | "Receita" | "Despesa";
  categoria: string;
  data: string;
}

interface RegistroSaude {
  data: string;
  menstruando: boolean;
  notas: string;
  sintomas: string[];
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

interface ItemCompra {
  id: string;
  item: string;
  comprado: boolean;
}

interface AlimentacaoData {
  refeicoes: {
    cafe: string;
    almoco: string;
    lanche: string;
    jantar: string;
  };
  compras: ItemCompra[];
}

interface ItemMala {
  id: string;
  texto: string;
  check: boolean;
  categoria: "Roupas" | "Higiene" | "Documentos" | "Outros";
}

interface ViagensData {
  mala: ItemMala[];
}

interface TarefaCasa {
  id: string;
  tarefa: string;
  feita: boolean;
}

interface CasaData {
  tarefas: TarefaCasa[];
  cardapio: {
    almoco: string;
    jantar: string;
  };
}

// Interface da Tarefa alinhada com o Componente Agenda
interface TarefaAgenda {
  id: string;
  concluida: boolean;
  descricao: string; // Importante: deve ser igual ao backend
  horario: string;
  data: string;
}

// --- 2. Interface Principal do Progresso ---

interface UserProgress {
  saude?: Record<string, RegistroSaude>;
  financas?: Transacao[]; 
  materias?: Materia[];
  habitos?: Habito[];
  historicoEstudos?: HistoricoEstudo[];
  treinos?: Treino[];
  tarefas?: TarefaAgenda[]; // <--- USANDO A INTERFACE CRIADA ACIMA
  beleza?: BelezaData; 
  alimentacao?: AlimentacaoData;
  viagens?: ViagensData;
  casa?: CasaData;
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
      
      if (data) {
        setUser(data);
        // Atualiza o cache para persistência offline rápida
        localStorage.setItem("userData", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Erro ao sincronizar usuário:", err);
      // Recupera do cache se a rede falhar
      const cached = localStorage.getItem("userData");
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  }

  // Sincroniza uma vez ao carregar o app
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