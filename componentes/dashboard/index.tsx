"use client";

import DateComponent from "../ui/date";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import CardAcoes from "../ui/CardAcoes";
import { BookOpen, Heart, Repeat, Target } from "lucide-react";
import Cabecalho from "../ui/Cabecalho";
import ContainerPages from "../ui/ContainerPages";
import { useEffect, useState } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

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

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [estudosStats, setEstudosStats] = useState({ 
    horasLabel: "0.0h / 0h", 
    tarefasLabel: "0 / 0",
    porcentagem: 0 
  });

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

  useEffect(() => {
    const updateDashboardData = () => {
      const savedMaterias = localStorage.getItem("materias");
      const savedHistorico = localStorage.getItem("historico");

      const materias: Materia[] = savedMaterias ? JSON.parse(savedMaterias) : [];
      const historico: StudySession[] = savedHistorico ? JSON.parse(savedHistorico) : [];

      // 1. Cálculo de Horas
      const totalHoras = materias.reduce((acc, m) => acc + (m.horasEstudadas || 0), 0);
      const totalMeta = materias.reduce((acc, m) => acc + (m.metaHoras || 0), 0);
      
      // 2. Cálculo de Tarefas (Sessões vs Total de Matérias)
      const feitas = historico.length;
      const totalTarefas = materias.length;

      // 3. Porcentagem da barra (baseada nas horas)
      const porcentagemGeral = totalMeta > 0 ? (totalHoras / totalMeta) * 100 : 0;

      setEstudosStats({
        horasLabel: `${totalHoras.toFixed(1)}h / ${totalMeta}h`,
        tarefasLabel: `${feitas} / ${totalTarefas} tarefas`,
        porcentagem: Math.min(porcentagemGeral, 100)
      });
    };

    updateDashboardData();
    window.addEventListener("storage", updateDashboardData);
    return () => window.removeEventListener("storage", updateDashboardData);
  }, []);

  return (
    <>
      <ContainerPages>
        <Cabecalho title={`Olá, ${userName || "Bem-vinda"}! 🌸`} imageSrc={"/images/hello-kitty-dashboard.jpg"}>
          <DateComponent />
        </Cabecalho>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4 gap-[0.6em] justify-center md:gap-4 ">
          <Cardprogresso
            title="Hábitos"
            progressoDodia="Progresso"
            progresso={70}
            barraDeProgresso={true}
            icon={<Target size={20} />}
          />

          <Cardprogresso
            title="Tarefas"
            progressoDodia="Em breve" // Deixamos reservado como você pediu
            progresso={0}
            barraDeProgresso={true}
            icon={<Repeat size={20} />}
          />

          {/* CARD DE ESTUDOS COM HORAS E TAREFAS JUNTOS */}
          <Cardprogresso
            title="Estudos"
            // Exibe: "3.5h / 10h  2 / 5 tarefas"
            progressoDodia={`${estudosStats.horasLabel} `}
            progresso={estudosStats.porcentagem}
            barraDeProgresso={true}
            icon={<BookOpen size={20} />}
          />

          <Cardprogresso
            title="Treino"
            progressoDodia="Concluído"
            progresso={100}
            barraDeProgresso={true}
            icon={<Heart size={20} />}
          />
        </div>

        <div className="flex-col mb-4 flex gap-4 mt-[1.2em] md:mb-0 md:mt-[2em] md:flex-row">
          <Agenda />
          <Conquistas />
        </div>
      </ContainerPages>
    </>
  );
}