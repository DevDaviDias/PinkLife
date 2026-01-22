"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ContainerPages from "@/componentes/ui/ContainerPages";
import Cabecalho from "@/componentes/ui/Cabecalho";
import Cardprogresso from "@/componentes/ui/Cardprogresso";
import GrayMenu from "@/componentes/ui/GrayMenu";
import { Plus, Trash2, CheckCircle, Clock, Dumbbell as Muscle, Target, Flame } from "lucide-react";

interface Treino {
  id: string;
  nome: string;
  categoria: string;
  duracao: string;
  exercicios: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function Treino() {
  const [active, setActive] = useState("Hoje");
  const [fichas, setFichas] = useState<Treino[]>([]);
  const [novoNomeTreino, setNovoNomeTreino] = useState("");
  const [novoExercicio, setNovoExercicio] = useState("");
  const [listaTempExercicio, setListaTempExercicio] = useState<string[]>([]);

  // --- Carregar treinos do backend ---
 useEffect(() => {
  async function fetchTreinos() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/treinos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // GARANTIA: Só atualiza se o que vier do back for um Array
      if (Array.isArray(res.data)) {
        setFichas(res.data);
      } else {
        setFichas([]); // Se não for array, limpa para não quebrar
      }
    } catch (err) {
      console.error("Erro ao carregar treinos:", err);
      setFichas([]); // Em caso de erro de rede, mantém array vazio
    }
  }
  fetchTreinos();
}, []);

  const adicionarExercicioParaLista = () => {
    if (!novoExercicio.trim()) return;
    setListaTempExercicio(prev => [...prev, novoExercicio.trim()]);
    setNovoExercicio("");
  };

  const salvarNovoTreino = async () => {
    if (!novoNomeTreino.trim() || listaTempExercicio.length === 0) {
      alert("Dê um nome ao treino e adicione pelo menos um exercício!");
      return;
    }

    const token = localStorage.getItem("token"); // BUSCA O TOKEN
    const novaFicha = {
      nome: novoNomeTreino,
      categoria: "Musculação",
      duracao: "45 min",
      exercicios: listaTempExercicio,
    };

    try {
      const res = await axios.post(`${API_URL}/treinos`, novaFicha, {
        headers: { Authorization: `Bearer ${token}` } // ENVIA O TOKEN
      });
      setFichas(prev => [res.data, ...prev]);
      setNovoNomeTreino("");
      setListaTempExercicio([]);
      setActive("MeusTreinos");
    } catch (err) {
      console.error("Erro ao salvar treino:", err);
    }
  };

  const excluirTreino = async (id: string) => {
    if (!confirm("Deseja excluir este treino permanentemente?")) return;
    const token = localStorage.getItem("token"); // BUSCA O TOKEN

    try {
      await axios.delete(`${API_URL}/treinos/${id}`, {
        headers: { Authorization: `Bearer ${token}` } // ENVIA O TOKEN
      });
      setFichas(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error("Erro ao excluir treino:", err);
    }
  };

  return (
    <ContainerPages>
      <Cabecalho title="Treino 💪" imageSrc="/images/hello-kitty-fitness.jpg">
        <p>Acompanhe seu progresso e mantenha o foco!</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
        <Cardprogresso 
          title="Fichas" 
          progressoDodia="ativas" 
          porcentagem={(fichas?.length ?? 0).toString()} 
          icon={<Muscle size={15} />} 
        />
        <Cardprogresso title="Hoje" progressoDodia="status" porcentagem="Pendente" icon={<Target size={15} />} />
        <Cardprogresso title="Sequência" progressoDodia="dias" porcentagem="12" icon={<Flame size={15} />} />
        <Cardprogresso title="Kcal" progressoDodia="estimadas" porcentagem="320" icon={<Clock size={15} />} />
      </div>

      <div className="mt-6">
        <GrayMenu items={[
          { title: "Hoje", onClick: () => setActive("Hoje"), active: active === "Hoje" },
          { title: "Meus Treinos", onClick: () => setActive("MeusTreinos"), active: active === "MeusTreinos" },
          { title: "Criar Treino", onClick: () => setActive("CriarTreinos"), active: active === "CriarTreinos" },
        ]} />
      </div>

      <div className="mt-6">
        {active === "Hoje" && (
          <div className="space-y-4">
            <h2 className="text-pink-500 font-bold flex items-center gap-2 px-1 text-sm uppercase tracking-wider">
              <Clock size={18} /> Treinos Disponíveis
            </h2>
            <div className="grid gap-4">
              {fichas.map((treino) => (
                <div key={treino.id} className="bg-white border-2 border-pink-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">{treino.nome}</h3>
                      <p className="text-xs text-pink-400 font-bold uppercase tracking-tighter mt-1">{treino.categoria} • {treino.duracao}</p>
                    </div>
                    <button className="bg-pink-500 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                      Concluir
                    </button>
                  </div>
                  <div className="bg-pink-50/50 rounded-2xl p-4 flex flex-wrap gap-x-5 gap-y-2">
                    {treino.exercicios.map((ex, i) => (
                      <span key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div> {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "MeusTreinos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fichas.map((treino) => (
              <div key={treino.id} className="bg-white p-6 rounded-[2rem] border-2 border-pink-50 relative group hover:border-pink-200 transition-all">
                <button onClick={() => excluirTreino(treino.id)} className="absolute top-5 right-5 text-gray-300 hover:text-red-500 transition-all">
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl"><Muscle size={24} /></div>
                  <div>
                    <h3 className="font-bold text-gray-800">{treino.nome}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{treino.duracao}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {treino.exercicios.map((ex, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-pink-50/30 p-2.5 rounded-xl border border-pink-50">
                      <CheckCircle size={14} className="text-pink-300" />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "CriarTreinos" && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-pink-50 max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-pink-500 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Plus size={24} /> Novo Treino Customizado
            </h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome da Ficha</label>
                <input 
                  placeholder="Ex: Treino de Superiores" 
                  value={novoNomeTreino} 
                  onChange={(e) => setNovoNomeTreino(e.target.value)} 
                  className="w-full p-4 bg-pink-50/50 border-2 border-transparent focus:border-pink-200 rounded-2xl outline-none transition-all" 
                />
              </div>

              <div className="p-5 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase ml-1">Adicionar Exercícios</label>
                <div className="flex gap-2">
                  <input 
                    placeholder="Nome do exercício..." 
                    value={novoExercicio} 
                    onChange={(e) => setNovoExercicio(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && adicionarExercicioParaLista()} 
                    className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:border-pink-300 transition-all" 
                  />
                  <button onClick={adicionarExercicioParaLista} className="bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 shadow-md">
                    <Plus size={20} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {listaTempExercicio.map((ex, index) => (
                    <span key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-pink-200 text-xs text-pink-600 font-bold">
                      {ex} 
                      <Trash2 size={14} className="cursor-pointer hover:text-red-500" onClick={() => setListaTempExercicio(listaTempExercicio.filter((_, i) => i !== index))} />
                    </span>
                  ))}
                </div>
              </div>
              
              <button onClick={salvarNovoTreino} className="w-full py-5 bg-pink-500 text-white rounded-[1.5rem] font-black shadow-lg hover:bg-pink-600 active:scale-95 transition-all uppercase tracking-widest text-sm">
                Criar Treino
              </button>
            </div>
          </div>
        )}
      </div>
    </ContainerPages>
  );
}