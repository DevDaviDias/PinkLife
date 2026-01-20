"use client";

import DateComponent from "../ui/date";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import { BookOpen, Heart, Repeat, Target } from "lucide-react";
import Cabecalho from "../ui/Cabecalho";
import ContainerPages from "../ui/ContainerPages";
import { useEffect, useState } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

// --- Interfaces para Tipagem ---
interface Materia {
  id: number;
  nome: string;
  metaHoras: number;
  horasEstudadas: number;
}

interface StudySession {
  id: number;
  materia: string;
  duracaoSegundos: number;
}

interface Treino {
  id: string;
  nome: string;
  exercicios: string[];
}

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  
  // Estados de Estatísticas
  const [estudosStats, setEstudosStats] = useState({ 
    horasLabel: "0.0h / 0h", 
    porcentagem: 0 
  });

  const [treinoStats, setTreinoStats] = useState({
    label: "Nenhum treino",
    porcentagem: 0,
    totalFichas: 0
  });

  // Busca o usuário logado
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getLoggedUser();
        if (user && user.name) setUserName(user.name);
      } catch (err) {
        console.error("Erro ao buscar usuário logado", err);
      }
    }
    fetchUser();
  }, []);

  // Atualiza os dados baseados no LocalStorage
  useEffect(() => {
    const updateDashboardData = () => {
      // 1. Carregar dados de Estudos
      const savedMaterias = localStorage.getItem("materias");
      const materias: Materia[] = savedMaterias ? JSON.parse(savedMaterias) : [];

      const totalHoras = materias.reduce((acc: number, m: Materia) => acc + (m.horasEstudadas || 0), 0);
      const totalMeta = materias.reduce((acc: number, m: Materia) => acc + (m.metaHoras || 0), 0);
      
      const porcentagemEstudo = totalMeta > 0 ? (totalHoras / totalMeta) * 100 : 0;

      setEstudosStats({
        horasLabel: `${totalHoras.toFixed(1)}h / ${totalMeta}h`,
        porcentagem: Math.min(porcentagemEstudo, 100)
      });

      // 2. Carregar dados de Treinos
      const savedTreinos = localStorage.getItem("fichas_treino");
      const treinos: Treino[] = savedTreinos ? JSON.parse(savedTreinos) : [];
      
      setTreinoStats({
        label: treinos.length > 0 
          ? `${treinos.length} ${treinos.length === 1 ? 'ficha ativa' : 'fichas ativas'}`
          : "Nenhum treino",
        porcentagem: treinos.length > 0 ? 100 : 0, // Motivação: barra cheia se houver treino
        totalFichas: treinos.length
      });
    };

    // Executa na montagem e escuta eventos de storage
    updateDashboardData();
    window.addEventListener("storage", updateDashboardData);
    
    return () => window.removeEventListener("storage", updateDashboardData);
  }, []);

  return (
    <ContainerPages>
      <Cabecalho title={`Olá, ${userName || "Bem-vinda"}! 🌸`} imageSrc={"/images/hello-kitty-dashboard.jpg"}>
        <DateComponent />
      </Cabecalho>

      {/* Grid de Cards de Progresso */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4 gap-[0.6em] justify-center md:gap-4">
        <Cardprogresso
          title="Hábitos"
          progressoDodia="Progresso"
          progresso={70}
          barraDeProgresso={true}
          icon={<Target size={20} />}
        />

        <Cardprogresso
          title="Tarefas"
          progressoDodia="Em breve"
          progresso={0}
          barraDeProgresso={true}
          icon={<Repeat size={20} />}
        />

        <Cardprogresso
          title="Estudos"
          progressoDodia={estudosStats.horasLabel}
          progresso={estudosStats.porcentagem}
          barraDeProgresso={true}
          icon={<BookOpen size={20} />}
        />

        <Cardprogresso
          title="Treino"
          progressoDodia={treinoStats.label}
          progresso={treinoStats.porcentagem}
          barraDeProgresso={true}
          icon={<Heart size={20} className={treinoStats.totalFichas > 0 ? "text-pink-500 fill-pink-500 shadow-sm" : ""} />}
        />
      </div>

      {/* Agenda e Conquistas */}
      <div className="flex-col mb-4 flex gap-4 mt-[1.2em] md:mb-0 md:mt-[2em] md:flex-row">
        <Agenda />
        <Conquistas />
      </div>
    </ContainerPages>
  );
}