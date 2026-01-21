"use client";

import DateComponent from "../ui/date";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import { BookOpen, Heart, Repeat, Target } from "lucide-react";
import Cabecalho from "../ui/Cabecalho";
import ContainerPages from "../ui/ContainerPages";
import { useEffect, useState } from "react";
import { useUser } from "@/componentes/context/UserContext"; // <- contexto do usuário

// --- Interfaces ---
interface Materia { id: number; nome: string; metaHoras: number; horasEstudadas: number; }
interface Treino { id: string; nome: string; }
interface Habito { id: number; concluido: boolean; }
interface Tarefa { id: number; concluida: boolean; }

export default function Dashboard() {
  const { user } = useUser(); // pega usuário do contexto
  const userName = user?.name || "Bem-vinda";

  // Estados de Estatísticas
  const [estudosStats, setEstudosStats] = useState({ horasLabel: "0.0h / 0h", porcentagem: 0 });
  const [treinoStats, setTreinoStats] = useState({ label: "Nenhum treino", porcentagem: 0, totalFichas: 0 });
  const [habitosStats, setHabitosStats] = useState({ label: "0/0 concluídos", porcentagem: 0 });
  const [tarefasStats, setTarefasStats] = useState({ label: "0 pendentes", porcentagem: 0 });

  useEffect(() => {
    const updateDashboardData = () => {
      const progress = user?.progress?.dashboard;

      // 1. Estudos
      const materias: Materia[] = progress?.treino?.exercicios
        ? progress.treino.exercicios.map((nome, i) => ({
            id: i,
            nome,
            metaHoras: 0,
            horasEstudadas: 0,
          }))
        : [];

      const tHoras = materias.reduce((acc, m) => acc + (m.horasEstudadas || 0), 0);
      const tMeta = materias.reduce((acc, m) => acc + (m.metaHoras || 0), 0);
      setEstudosStats({
        horasLabel: `${tHoras.toFixed(1)}h / ${tMeta}h`,
        porcentagem: tMeta > 0 ? Math.min((tHoras / tMeta) * 100, 100) : 0,
      });

      // 2. Treinos
      const treinos: Treino[] = progress?.treino?.exercicios
        ? progress.treino.exercicios.map((nome, i) => ({ id: i.toString(), nome }))
        : [];
      setTreinoStats({
        label: treinos.length > 0 ? `${treinos.length} fichas` : "Nenhum treino",
        porcentagem: treinos.length > 0 ? 100 : 0,
        totalFichas: treinos.length,
      });

      // 3. Hábitos
      const habitos: Habito[] = progress?.habitos
        ? Object.entries(progress.habitos).map(([nome, value], i) => ({
            id: i,
            concluido: !!value,
          }))
        : [];
      const concluidosH = habitos.filter(h => h.concluido).length;
      setHabitosStats({
        label: `${concluidosH}/${habitos.length} concluídos`,
        porcentagem: habitos.length > 0 ? (concluidosH / habitos.length) * 100 : 0,
      });

      // 4. Tarefas
      const tarefas: Tarefa[] = (progress?.agenda?.tarefas ?? []).map((t, i) => ({
        id: i,
        concluida: t.concluida ?? false,
      }));
      const concluidasT = tarefas.filter(t => t.concluida).length;
      const pendentes = tarefas.length - concluidasT;
      setTarefasStats({
        label:
          pendentes > 0
            ? `${pendentes} pendentes`
            : tarefas.length > 0
            ? "Tudo feito! ✨"
            : "Sem tarefas",
        porcentagem: tarefas.length > 0 ? (concluidasT / tarefas.length) * 100 : 0,
      });
    };

    updateDashboardData();
  }, [user]); // Recalcula quando o usuário for carregado

  return (
    <ContainerPages>
      <Cabecalho title={`Olá, ${userName}! 🌸`} imageSrc={"/images/hello-kitty-dashboard.jpg"}>
        <DateComponent />
      </Cabecalho>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4 gap-[0.6em] justify-center md:gap-4">
        <Cardprogresso
          title="Hábitos"
          progressoDodia={habitosStats.label}
          progresso={habitosStats.porcentagem}
          barraDeProgresso={true}
          icon={<Target size={20} />}
        />

        <Cardprogresso
          title="Tarefas"
          progressoDodia={tarefasStats.label}
          progresso={tarefasStats.porcentagem}
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
          icon={
            <Heart
              size={20}
              className={treinoStats.totalFichas > 0 ? "text-pink-500 fill-pink-500" : ""}
            />
          }
        />
      </div>

      <div className="flex-col mb-4 flex gap-4 mt-[1.2em] md:mb-0 md:mt-[2em] md:flex-row">
        <Agenda />
        <Conquistas />
      </div>
    </ContainerPages>
  );
}
