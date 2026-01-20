"use client";

import { useEffect, useState, useRef } from "react"; // 1. Importar useRef
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "../ui/GrayMenu";
import StatusCard from "../ui/StatusCard ";
import StatusCard2 from "../ui/StatusCard2";
import CronometroEstudos from "@/componentes/Estudos/CronometroEstudos";
import { BookOpen, Hourglass, Target, Trash2 } from "lucide-react"; 

// ... (Interfaces Materia e StudySession permanecem as mesmas)
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
  const [active, setActive] = useState<"Hoje" | "Semana" | "Historico">("Hoje");
  
  // 2. Criar a referência para a área de conteúdo
  const conteudoRef = useRef<HTMLDivElement>(null);

  // 3. Função para mudar a aba e descer a tela
  const handleTabChange = (tab: "Hoje" | "Semana" | "Historico") => {
    setActive(tab);
    
    // Pequeno timeout para garantir que o React renderizou a nova aba antes de scrollar
    setTimeout(() => {
      conteudoRef.current?.scrollIntoView({ 
        behavior: "smooth", // Scroll suave
        block: "start"      // Alinha o topo do elemento no topo da tela
      });
    }, 100);
  };

  const [materias, setMaterias] = useState<Materia[]>(() => {
    if (typeof window !== "undefined") {
      const savedMaterias = localStorage.getItem("materias");
      return savedMaterias ? JSON.parse(savedMaterias) : [];
    }
    return [];
  });

  const [historico, setHistorico] = useState<StudySession[]>(() => {
    if (typeof window !== "undefined") {
      const savedHistorico = localStorage.getItem("historico");
      return savedHistorico ? JSON.parse(savedHistorico) : [];
    }
    return [];
  });

  const [nome, setNome] = useState("");
  const [metaHoras, setMetaHoras] = useState("");

  useEffect(() => {
    localStorage.setItem("materias", JSON.stringify(materias));
  }, [materias]);

  useEffect(() => {
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [historico]);

  // --- Funções (adicionar, excluir, finalizar permanecem iguais) ---
  function adicionarMateria() {
    if (!nome || !metaHoras) return;
    const novaMateria: Materia = {
      id: Date.now(),
      nome,
      metaHoras: Number(metaHoras),
      horasEstudadas: 0,
    };
    setMaterias((prev) => [...prev, novaMateria]);
    setNome("");
    setMetaHoras("");
  }

  function excluirMateria(id: number) {
    if (confirm("Tem certeza que deseja excluir esta matéria?")) {
      setMaterias((prev) => prev.filter((m) => m.id !== id));
    }
  }

  function excluirSessao(id: number) {
    if (confirm("Deseja remover este registro do histórico?")) {
      setHistorico((prev) => prev.filter((h) => h.id !== id));
    }
  }

  function finalizarSessao(sessao: StudySession) {
    setHistorico((prev) => [sessao, ...prev]);
    setMaterias((prev) =>
      prev.map((m) =>
        m.nome === sessao.materia
          ? { ...m, horasEstudadas: (m.horasEstudadas || 0) + sessao.duracaoSegundos / 3600 }
          : m
      )
    );
  }

  const totalHoras = materias.reduce((acc, m) => acc + (m.horasEstudadas || 0), 0);
  const totalSessoes = historico.length;
  const totalMaterias = materias.length;

  return (
    <ContainerPages>
      <Cabecalho title="Seção de Estudos 📚" imageSrc="/images/hello-kitty-study.jpg">
        <p>Organize seus estudos e acompanhe o progresso</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-3 mt-4 gap-4">
        <Cardprogresso title="Matérias" progressoDodia="cadastradas" porcentagem={totalMaterias} icon={<BookOpen size={16} />} />
        <Cardprogresso title="Horas Totais" progressoDodia="estudadas" porcentagem={`${totalHoras.toFixed(1)}h`} icon={<Hourglass size={16} />} />
        <Cardprogresso title="Sessões" progressoDodia="realizadas" porcentagem={totalSessoes} icon={<Target size={16} />} />
      </div>

      {/* 4. Atualizar o GrayMenu para usar a nova função handleTabChange */}
      <GrayMenu
        items={[
          { title: "Matéria", onClick: () => handleTabChange("Hoje"), active: active === "Hoje" },
          { title: "Cronômetro", onClick: () => handleTabChange("Semana"), active: active === "Semana" },
          { title: "Histórico", onClick: () => handleTabChange("Historico"), active: active === "Historico" },
        ]}
      />

      {/* 5. Colocar a referência (ref) na div que contém o conteúdo variável */}
      <div className="mt-4" ref={conteudoRef}>
        {active === "Hoje" && (
          <StatusCard width="" title="Adicionar Nova Matéria">
            <div className="grid md:grid-cols-2 mt-6 gap-4">
              <input placeholder="Nome da matéria" value={nome} onChange={(e) => setNome(e.target.value)} className="border p-2 rounded" />
              <input placeholder="Meta de horas" type="number" value={metaHoras} onChange={(e) => setMetaHoras(e.target.value)} className="border p-2 rounded" />
            </div>
            <button onClick={adicionarMateria} className="mt-9 bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 transition-colors">
              + Nova Matéria
            </button>

            <div className="mt-8 grid grid-cols-1 gap-4">
              {materias.map((m) => (
                <div key={m.id} className="relative group">
                  <Cardprogresso
                    title={m.nome}
                    progressoDodia={`${(m.horasEstudadas || 0).toFixed(1)}h / ${m.metaHoras}h`}
                    progresso={((m.horasEstudadas || 0) / m.metaHoras) * 100}
                    barraDeProgresso
                    icon={<BookOpen size={18} />}
                  />
                  <button 
                    onClick={() => excluirMateria(m.id)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </StatusCard>
        )}

        {active === "Semana" && (
          <div className="flex justify-center">
            <StatusCard2 title="Cronômetro de Estudos">
              <CronometroEstudos materias={materias.map((m) => m.nome)} onFinalizar={finalizarSessao} />
            </StatusCard2>
          </div>
        )}

        {active === "Historico" && (
          <StatusCard width="h-full" title="Histórico de Estudos">
            <ul className="space-y-2">
              {historico.map((h) => (
                <li key={h.id} className="border p-3 rounded bg-white shadow-sm flex justify-between items-center group">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-pink-600">{h.materia}</strong>
                      <span className="text-[10px] text-gray-400">{h.data}</span>
                    </div>
                    <p className="text-sm text-gray-600">{h.comentario}</p>
                    <p className="text-sm font-bold">{(h.duracaoSegundos / 60).toFixed(0)} min</p>
                  </div>
                  <button 
                    onClick={() => excluirSessao(h.id)}
                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </StatusCard>
        )}
      </div>
    </ContainerPages>
  );
}