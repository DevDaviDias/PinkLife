"use client";

import { useEffect, useState } from "react";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "../ui/GrayMenu";
import StatusCard from "../ui/StatusCard ";
import StatusCard2 from "../ui/StatusCard2";
import CronometroEstudos from "@/componentes/Estudos/CronometroEstudos";
import { BookOpen, Hourglass, Target } from "lucide-react";

/* =========================
   TIPOS
========================= */
export interface Materia {
  id: number;
  nome: string;
  metaHoras: number;
  horasEstudadas: number;
}

export interface StudySession {
  id: number;
  materia: string;
  comentario: string;
  duracaoSegundos: number;
  data: string;
}

export default function Estudos() {
  const [active, setActive] =
    useState<"Hoje" | "Semana" | "Historico">("Hoje");

  /* =========================
     STATES COM LOCALSTORAGE
  ========================= */
  const [materias, setMaterias] = useState<Materia[]>(() => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("materias");
    return data ? JSON.parse(data) : [];
  });

  const [historico, setHistorico] = useState<StudySession[]>(() => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("historico");
    return data ? JSON.parse(data) : [];
  });

  const [nome, setNome] = useState("");
  const [metaHoras, setMetaHoras] = useState("");

  /* =========================
     SALVAR NO LOCALSTORAGE
  ========================= */
  useEffect(() => {
    localStorage.setItem("materias", JSON.stringify(materias));
  }, [materias]);

  useEffect(() => {
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [historico]);

  /* =========================
     FUNÇÕES
  ========================= */
  function adicionarMateria() {
    if (!nome || !metaHoras) return;

    setMaterias((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome,
        metaHoras: Number(metaHoras),
        horasEstudadas: 0,
      },
    ]);

    setNome("");
    setMetaHoras("");
  }

  function finalizarSessao(sessao: StudySession) {
    // adiciona no histórico
    setHistorico((prev) => [...prev, sessao]);

    // soma horas na matéria correta
    setMaterias((prev) =>
      prev.map((m) =>
        m.nome === sessao.materia
          ? {
              ...m,
              horasEstudadas:
                m.horasEstudadas + sessao.duracaoSegundos / 3600,
            }
          : m
      )
    );
  }

  
  return (
    <ContainerPages>
      <Cabecalho
        title="Seção de Estudos 📚"
        imageSrc="/images/hello-kitty-study.jpg"
      >
        <p>Organize seus estudos e acompanhe o progresso</p>
      </Cabecalho>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
        <Cardprogresso
          title="Matérias"
          progressoDodia="cadastradas"
          porcentagem={materias.length}
          icon={<BookOpen size={16} />}
        />

        <Cardprogresso
          title="Horas Totais"
          progressoDodia="estudadas"
          porcentagem={`${materias
            .reduce((acc, m) => acc + m.horasEstudadas, 0)
            .toFixed(1)}h`}
          icon={<Hourglass size={16} />}
        />

        <Cardprogresso
          title="Sessões"
          progressoDodia="realizadas"
          porcentagem={historico.length}
          icon={<Target size={16} />}
        />
      </div>

      <GrayMenu
        items={[
          {
            title: "Matéria",
            onClick: () => setActive("Hoje"),
            active: active === "Hoje",
          },
          {
            title: "Cronômetro",
            onClick: () => setActive("Semana"),
            active: active === "Semana",
          },
          {
            title: "Histórico",
            onClick: () => setActive("Historico"),
            active: active === "Historico",
          },
        ]}
      />

      <div className="mt-4">
        {/* ADICIONAR MATÉRIA */}
        {active === "Hoje" && (
          <StatusCard title="Adicionar Nova Matéria">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Nome da matéria"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border p-2 rounded"
              />

              <input
                placeholder="Meta de horas"
                type="number"
                value={metaHoras}
                onChange={(e) => setMetaHoras(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <button
              onClick={adicionarMateria}
              className="mt-4 bg-pink-500 text-white px-6 py-3 rounded"
            >
              + Nova Matéria
            </button>

            <div className="mt-8 grid sm:grid-cols-2 md:mt-20">
              {materias.map((m) => (
                <Cardprogresso
                  key={m.id}
                  title={m.nome}
                  progressoDodia={`${m.horasEstudadas.toFixed(1)}h / ${
                    m.metaHoras
                  }h`}
                  progresso={(m.horasEstudadas / m.metaHoras) * 100}
                  barraDeProgresso
                  icon={<BookOpen size={18} />}
                />
              ))}
            </div>
          </StatusCard>
        )}

        {/* CRONÔMETRO */}
        {active === "Semana" && (
          <StatusCard2 title="Cronômetro de Estudos">
            <CronometroEstudos
              materias={materias.map((m) => m.nome)}
              onFinalizar={finalizarSessao}
            />
          </StatusCard2>
        )}

        {/* HISTÓRICO */}
        {active === "Historico" && (
          <StatusCard title="Histórico de Estudos">
            <ul className="space-y-2">
              {historico.map((h) => (
                <li key={h.id} className="border p-3 rounded">
                  <strong>{h.materia}</strong>
                  <p>{h.comentario}</p>
                  <p>{(h.duracaoSegundos / 60).toFixed(1)} min</p>
                  <span className="text-xs text-gray-500">{h.data}</span>
                </li>
              ))}
            </ul>
          </StatusCard>
        )}
      </div>
    </ContainerPages>
  );
}
