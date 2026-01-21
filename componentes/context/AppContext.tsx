"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Interfaces (Moldes de dados)
interface ItemAgenda { _id?: string; id: number; descricao: string; data: string; horario: string; cor: string; }
interface ItemTreino { _id?: string; nome: string; status: string; }
interface ItemEstudo { _id?: string; materia: string; horasEstudadas: number; metaHoras: number; }
interface ItemFinanca { _id?: string; descricao: string; valor: number; tipo: "Receita" | "Despesa"; }

// Tipo que aceita qualquer uma das listas para evitar o 'any'
type DataType = ItemAgenda[] | ItemTreino[] | ItemEstudo[] | ItemFinanca[];

interface AppContextType {
  agenda: ItemAgenda[];
  treinos: ItemTreino[];
  estudos: ItemEstudo[];
  financas: ItemFinanca[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateAgenda: (newData: ItemAgenda[]) => Promise<void>;
  updateTreinos: (newData: ItemTreino[]) => Promise<void>;
  updateEstudos: (newData: ItemEstudo[]) => Promise<void>;
  updateFinancas: (newData: ItemFinanca[]) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [agenda, setAgenda] = useState<ItemAgenda[]>([]);
  const [treinos, setTreinos] = useState<ItemTreino[]>([]);
  const [estudos, setEstudos] = useState<ItemEstudo[]>([]);
  const [financas, setFinancas] = useState<ItemFinanca[]>([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCAR DADOS DO BACKEND (Porta 3001) ---
  const refreshData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3001/user/progress", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const result = await res.json();
      
      // Como sua API retorna { progress: { agenda: [], ... } }
      const p = result.progress || {};
      
      setAgenda(p.agenda || []);
      setTreinos(p.treino || []);
      setEstudos(p.estudos || []);
      setFinancas(p.financas || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO PARA SALVAR NA API (Porta 3001) ---
  const saveToDatabase = async (moduleName: string, data: DataType) => {
    try {
      const token = localStorage.getItem("token"); 

      await fetch("http://localhost:3001/user/progress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          module: moduleName, 
          data: data          
        }),
      });

      console.log(`Módulo ${moduleName} sincronizado com sucesso! ✅`);
    } catch (error) {
      console.error(`Erro ao salvar modulo ${moduleName}:`, error);
    }
  };

  // --- FUNÇÕES DE ATUALIZAÇÃO ---
  const updateAgenda = async (newData: ItemAgenda[]) => {
    setAgenda(newData);
    await saveToDatabase("agenda", newData); // "agenda" é o nome da chave no progresso
  };

  const updateTreinos = async (newData: ItemTreino[]) => {
    setTreinos(newData);
    await saveToDatabase("treino", newData);
  };

  const updateEstudos = async (newData: ItemEstudo[]) => {
    setEstudos(newData);
    await saveToDatabase("estudos", newData);
  };

  const updateFinancas = async (newData: ItemFinanca[]) => {
    setFinancas(newData);
    await saveToDatabase("financas", newData);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ 
      agenda, treinos, estudos, financas, loading, 
      refreshData, updateAgenda, updateTreinos, updateEstudos, updateFinancas 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve ser usado dentro de um AppProvider");
  return context;
};