/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import DateComponent from "../ui/date";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import { BookOpen, Heart, Repeat, Target } from "lucide-react";
import Cabecalho from "../ui/Cabecalho";
import ContainerPages from "../ui/ContainerPages";
import { useUser } from "@/componentes/context/UserContext";

// --- Interfaces para Tipagem Segura ---
interface Materia { 
  id: string; 
  nome: string; 
  metaHoras: number; 
  horasEstudadas: number; 
}

interface Tarefa {
  id: string | number;
  concluida: boolean;
  descricao?: string;
  horario?: string;
  data?: string;
}

interface Treino {
  id: string;
  nome: string;
}

export default function Dashboard() {
  const { user, refreshUser } = useUser();
  const userName = user?.name || "Bem-vinda";

  // Estados para os Cards
  const [estudosStats, setEstudosStats] = useState({ horasLabel: "0.0h / 0h", porcentagem: 0 });
  const [treinoStats, setTreinoStats] = useState({ label: "Nenhum treino", porcentagem: 0, totalFichas: 0 });
  const [habitosStats, setHabitosStats] = useState({ label: "Sem registros", porcentagem: 0 });
  const [tarefasStats, setTarefasStats] = useState({ label: "0 pendentes", porcentagem: 0 });

  // 1. Forçar atualização ao montar o Dashboard
  useEffect(() => {
    refreshUser();
  }, []);

  // 2. Processar os dados sempre que o 'user' mudar
  useEffect(() => {
    if (!user?.progress) return;

    const { progress } = user;

    // --- Lógica de Estudos ---
    const materias = (progress.materias as Materia[]) || [];
    const tHoras = materias.reduce((acc, m) => acc + (Number(m.horasEstudadas) || 0), 0);
    const tMeta = materias.reduce((acc, m) => acc + (Number(m.metaHoras) || 0), 0);
    
    setEstudosStats({
      horasLabel: `${tHoras.toFixed(1)}h / ${tMeta.toFixed(0)}h`,
      porcentagem: tMeta > 0 ? Math.min((tHoras / tMeta) * 100, 100) : 0,
    });

    // --- Lógica de Treinos ---
    const treinos = (progress.treinos as Treino[]) || [];
    setTreinoStats({
      label: treinos.length > 0 ? `${treinos.length} treinos` : "Nenhum treino",
      porcentagem: treinos.length > 0 ? 100 : 0,
      totalFichas: treinos.length,
    });

    // --- Lógica de Saúde ---
    const totalSaude = progress.saude ? Object.keys(progress.saude).length : 0;
    setHabitosStats({
      label: totalSaude > 0 ? `${totalSaude} registros` : "Sem registros",
      porcentagem: totalSaude > 0 ? 100 : 0,
    });

    // --- Lógica de Tarefas (Agenda) ---
    // Substituído 'any' por 'Tarefa[]'
    const tarefas = (progress.tarefas as Tarefa[]) || [];
    const concluidasT = tarefas.filter(t => t.concluida).length;
    const totalT = tarefas.length;
    const pendentes = totalT - concluidasT;
    
    setTarefasStats({
      label: pendentes > 0 ? `${pendentes} pendentes` : totalT > 0 ? "Tudo feito! ✨" : "Sem tarefas",
      porcentagem: totalT > 0 ? (concluidasT / totalT) * 100 : 0,
    });

  }, [user]);

  return (
    <ContainerPages>
      <Cabecalho title={`Olá, ${userName}! 🌸`} imageSrc={"/images/hello-kitty-dashboard.jpg"}>
        <DateComponent />
      </Cabecalho>

      {/* Grid de Cards de Progresso */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4 gap-[0.6em] justify-center md:gap-4">
        <Cardprogresso 
          title="Saúde" 
          progressoDodia={habitosStats.label} 
          progresso={habitosStats.porcentagem} 
          barraDeProgresso 
          icon={<Target size={20} />} 
        />
        <Cardprogresso 
          title="Tarefas" 
          progressoDodia={tarefasStats.label} 
          progresso={tarefasStats.porcentagem} 
          barraDeProgresso 
          icon={<Repeat size={20} />} 
        />
        <Cardprogresso 
          title="Estudos" 
          progressoDodia={estudosStats.horasLabel} 
          progresso={estudosStats.porcentagem} 
          barraDeProgresso 
          icon={<BookOpen size={20} />} 
        />
        <Cardprogresso 
          title="Treino" 
          progressoDodia={treinoStats.label} 
          progresso={treinoStats.porcentagem} 
          barraDeProgresso 
          icon={<Heart size={20} className={treinoStats.totalFichas > 0 ? "text-pink-500 fill-pink-500" : ""} />} 
        />
      </div>

      {/* Seção Inferior: Agenda e Conquistas */}
      <div className="flex-col mb-4 flex gap-4 mt-[1.2em] md:mb-0 md:mt-[2em] md:flex-row">
        <div className="flex-1">
          <Agenda />
        </div>
        <div className="md:w-1/3">
          <Conquistas />
        </div>
      </div>
    </ContainerPages>
  );
}