"use client";

import { useEffect, useState, useRef } from "react";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "../ui/GrayMenu";
import StatusCard from "../ui/StatusCard ";
import StatusCard2 from "../ui/StatusCard2";
import CronometroEstudos from "@/componentes/Estudos/CronometroEstudos";
import { BookOpen, Hourglass, Target, Trash2 } from "lucide-react";
import axios from "axios";

// Interfaces
export interface Materia {
  id: string; 
  nome: string;
  metaHoras: number;
  horasEstudadas: number;
}

export interface StudySession {
  id: string;
  materia: string;
  comentario: string;
  duracaoSegundos: number;
  data: string;
}

export default function Estudos() {
  const [active, setActive] = useState<"Hoje" | "Semana" | "Historico">("Hoje");
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [historico, setHistorico] = useState<StudySession[]>([]);
  const [nome, setNome] = useState("");
  const [metaHoras, setMetaHoras] = useState("");
  const [loading, setLoading] = useState(true);

  const conteudoRef = useRef<HTMLDivElement>(null);
  
  // Garantir que a URL termine sem barra para evitar // no link
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  // --- 1. CARREGAR DADOS DO BACKEND ---
useEffect(() => {
  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const [resMaterias, resHistorico] = await Promise.all([
        axios.get(`${API_URL}/estudos/materias`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/estudos/historico`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      console.log("Materias carregadas:", resMaterias.data);
      console.log("Histórico carregado:", resHistorico.data); // Verifique se isso aqui mostra um Array no F12

      setMaterias(resMaterias.data || []);
      setHistorico(resHistorico.data || []); // Se aqui vier undefined, o map falha
    } catch (err) {
      console.error("Erro ao carregar estudos:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [API_URL]);

  const handleTabChange = (tab: "Hoje" | "Semana" | "Historico") => {
    setActive(tab);
    setTimeout(() => {
      conteudoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // --- 2. FUNÇÕES DE AÇÃO ---

  async function adicionarMateria() {
    if (!nome || !metaHoras) return;
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${API_URL}/estudos/materias`,
        { nome, metaHoras: Number(metaHoras) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterias((prev) => [...prev, res.data]);
      setNome("");
      setMetaHoras("");
    } catch (err) {
      console.error("Erro ao adicionar matéria", err);
    }
  }

  async function excluirMateria(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta matéria?")) return;
    
    const token = localStorage.getItem("token");
    const novaLista = materias.filter((m) => m.id !== id);

    try {
      // Usando a rota de progresso geral para salvar a exclusão
      await axios.post(
        `${API_URL}/user/progress`,
        { module: "materias", data: novaLista },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterias(novaLista);
    } catch (err) {
      console.error("Erro ao excluir matéria", err);
    }
  }

  async function finalizarSessao(sessao: StudySession) {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}/estudos/historico`,
        sessao,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHistorico((prev) => [res.data, ...prev]);
      
      // Atualiza horas estudadas localmente
      setMaterias((prev) =>
        prev.map((m) =>
          m.nome === sessao.materia
            ? { ...m, horasEstudadas: (m.horasEstudadas || 0) + sessao.duracaoSegundos / 3600 }
            : m
        )
      );
      
      setActive("Historico"); // Redireciona para ver o registro
    } catch (err) {
      console.error("Erro ao finalizar sessão", err);
    }
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

      <GrayMenu
        items={[
          { title: "Matéria", onClick: () => handleTabChange("Hoje"), active: active === "Hoje" },
          { title: "Cronômetro", onClick: () => handleTabChange("Semana"), active: active === "Semana" },
          { title: "Histórico", onClick: () => handleTabChange("Historico"), active: active === "Historico" },
        ]}
      />

      <div className="mt-4" ref={conteudoRef}>
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
             <p className="mt-4 text-pink-500 font-medium">Carregando seus dados...</p>
           </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {active === "Hoje" && (
              <StatusCard width="" title="Minhas Matérias">
                <div className="grid md:grid-cols-2 mt-2 gap-4 bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                  <input 
                    placeholder="Nome da matéria (ex: React)" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    className="border p-2 rounded outline-pink-300" 
                  />
                  <input 
                    placeholder="Meta de horas" 
                    type="number" 
                    value={metaHoras} 
                    onChange={(e) => setMetaHoras(e.target.value)} 
                    className="border p-2 rounded outline-pink-300" 
                  />
                  <button onClick={adicionarMateria} className="md:col-span-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-all font-bold">
                    + Adicionar Matéria
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  {materias.length === 0 && (
                    <p className="text-center text-gray-400 py-10 border-2 border-dashed rounded-xl">Você ainda não cadastrou nenhuma matéria.</p>
                  )}
                  {materias.map((m) => (
                    <div key={m.id} className="relative group">
                      <Cardprogresso
                        title={m.nome}
                        progressoDodia={`${(m.horasEstudadas || 0).toFixed(1)}h / ${m.metaHoras}h`}
                        progresso={Math.min(((m.horasEstudadas || 0) / m.metaHoras) * 100, 100)}
                        barraDeProgresso
                        icon={<BookOpen size={18} />}
                      />
                      <button 
                        onClick={() => excluirMateria(m.id)}
                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full shadow-sm"
                      >
                        <Trash2 size={16} />
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
                <div className="space-y-3">
                  {historico.length === 0 && (
                    <p className="text-center text-gray-400 py-10">Nenhuma sessão de estudo registrada.</p>
                  )}
                  {historico.map((h) => (
                    <div key={h.id} className="border-l-4 border-pink-400 p-4 rounded-r-lg bg-white shadow-sm flex justify-between items-center group">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-800 text-lg">{h.materia}</strong>
                          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                             {new Date(h.data).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {h.comentario && <p className="text-sm text-gray-500 italic mt-1">{h.comentario}</p>}
                        <p className="text-sm font-bold text-pink-500 mt-1">
                          ⏱️ {(h.duracaoSegundos / 60).toFixed(0)} minutos estudados
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </StatusCard>
            )}
          </div>
        )}
      </div>
    </ContainerPages>
  );
}