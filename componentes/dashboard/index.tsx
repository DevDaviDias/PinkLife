/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import DateComponent from "../ui/date";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import { BookOpen, Heart, Repeat, Target } from "lucide-react";
import Cabecalho from "../ui/Cabecalho";
import ContainerPages from "../ui/ContainerPages";
import { useEffect, useState } from "react";
import { useUser } from "@/componentes/context/UserContext";

// --- Interfaces Estritas ---
interface Materia { 
  id: string; 
  nome: string; 
  metaHoras: number; 
  horasEstudadas: number; 
}
interface Treino { id: string; nome: string; }
interface Tarefa { id: string; concluida: boolean; }

interface UserProgress {
  materias?: Materia[];
  tarefas?: Tarefa[];
  treinos?: Treino[];
  saude?: Record<string, unknown>;
  historicoEstudos?: unknown[];
}

export default function Dashboard() {
  const { user } = useUser();
  const userName = user?.name || "Bem-vinda";

  const [estudosStats, setEstudosStats] = useState({ horasLabel: "0.0h / 0h", porcentagem: 0 });
  const [treinoStats, setTreinoStats] = useState({ label: "Nenhum treino", porcentagem: 0, totalFichas: 0 });
  const [habitosStats, setHabitosStats] = useState({ label: "Sem registros", porcentagem: 0 });
  const [tarefasStats, setTarefasStats] = useState({ label: "0 pendentes", porcentagem: 0 });

  useEffect(() => {
    // 1. Convertemos o user para unknown antes de chegar no nosso tipo, evitando erro de 'any'
    const userUnknown = user as unknown;
    const progress = (userUnknown as { progress?: UserProgress })?.progress;

    if (!progress) return;

    // 2. Estudos - Garantimos que o resultado do reduce é sempre um number real
    const materias = progress.materias || [];
    
    const tHoras: number = materias.reduce((acc, m) => {
      const valor = Number(m.horasEstudadas);
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);

    const tMeta: number = materias.reduce((acc, m) => {
      const valor = Number(m.metaHoras);
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);
    
    // Agora o TypeScript sabe que tHoras é number e aceita o toFixed
    setEstudosStats({
      horasLabel: `${tHoras.toFixed(1)}h / ${tMeta.toFixed(0)}h`,
      porcentagem: tMeta > 0 ? Math.min((tHoras / tMeta) * 100, 100) : 0,
    });

    // 3. Treinos
    const treinos = progress.treinos || [];
    setTreinoStats({
      label: treinos.length > 0 ? `${treinos.length} treinos` : "Nenhum treino",
      porcentagem: treinos.length > 0 ? 100 : 0,
      totalFichas: treinos.length,
    });

    // 4. Saúde
    const totalSaude = progress.saude ? Object.keys(progress.saude).length : 0;
    setHabitosStats({
      label: totalSaude > 0 ? `${totalSaude} registros` : "Sem registros",
      porcentagem: totalSaude > 0 ? 100 : 0,
    });

    // 5. Tarefas
    const tarefas = progress.tarefas || [];
    const concluidasT = tarefas.filter(t => t.concluida).length;
    const pendentes = tarefas.length - concluidasT;
    
    setTarefasStats({
      label: pendentes > 0 ? `${pendentes} pendentes` : tarefas.length > 0 ? "Tudo feito! ✨" : "Sem tarefas",
      porcentagem: tarefas.length > 0 ? (concluidasT / tarefas.length) * 100 : 0,
    });

  }, [user]);

  return (
    <ContainerPages>
      <Cabecalho title={`Olá, ${userName}! 🌸`} imageSrc={"/images/hello-kitty-dashboard.jpg"}>
        <DateComponent />
      </Cabecalho>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4 gap-[0.6em] justify-center md:gap-4">
        <Cardprogresso title="Saúde" progressoDodia={habitosStats.label} progresso={habitosStats.porcentagem} barraDeProgresso icon={<Target size={20} />} />
        <Cardprogresso title="Tarefas" progressoDodia={tarefasStats.label} progresso={tarefasStats.porcentagem} barraDeProgresso icon={<Repeat size={20} />} />
        <Cardprogresso title="Estudos" progressoDodia={estudosStats.horasLabel} progresso={estudosStats.porcentagem} barraDeProgresso icon={<BookOpen size={20} />} />
        <Cardprogresso 
          title="Treino" 
          progressoDodia={treinoStats.label} 
          progresso={treinoStats.porcentagem} 
          barraDeProgresso 
          icon={<Heart size={20} className={treinoStats.totalFichas > 0 ? "text-pink-500 fill-pink-500" : ""} />} 
        />
      </div>

      <div className="flex-col mb-4 flex gap-4 mt-[1.2em] md:mb-0 md:mt-[2em] md:flex-row">
        <Agenda />
        <Conquistas />
      </div>
    </ContainerPages>
  );
}