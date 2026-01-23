"use client";

import { useState } from "react";
import axios from "axios";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "@/componentes/ui/GrayMenu";
import { 
  Home, 
  Utensils, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Leaf,
  Clock
} from "lucide-react";
import { useUser } from "@/componentes/context/UserContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// --- Tipagens Locais ---
interface TarefaCasa {
  id: string;
  tarefa: string;
  feita: boolean;
}

export default function CasaERotina() {
  const { user, refreshUser } = useUser();
  const [active, setActive] = useState("Rotina");
  const [novaTarefa, setNovaTarefa] = useState("");

  // Dados vindos do banco
  const casaData = user?.progress?.casa || {
    tarefas: [],
    cardapio: { almoco: "", jantar: "" }
  };
  const { tarefas, cardapio } = casaData;

  // --- Função para Salvar ---
  const salvarCasa = async (novosDados: typeof casaData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/progress/casa`, novosDados, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshUser();
    } catch (error) {
      console.error("Erro ao salvar rotina da casa:", error);
    }
  };

  const adicionarTarefa = () => {
    if (!novaTarefa.trim()) return;
    const nova: TarefaCasa = { id: Date.now().toString(), tarefa: novaTarefa, feita: false };
    salvarCasa({ ...casaData, tarefas: [...tarefas, nova] });
    setNovaTarefa("");
  };

  const toggleTarefa = (id: string) => {
    const novasTarefas = tarefas.map(t => t.id === id ? { ...t, feita: !t.feita } : t);
    salvarCasa({ ...casaData, tarefas: novasTarefas });
  };

  const excluirTarefa = (id: string) => {
    salvarCasa({ ...casaData, tarefas: tarefas.filter(t => t.id !== id) });
  };

  const progressoCasa = tarefas.length > 0 
    ? (tarefas.filter(t => t.feita).length / tarefas.length) * 100 
    : 0;

  return (
    <ContainerPages>
      <Cabecalho title="Casa e Rotina 🏠" imageSrc="/images/hello-kitty-home.jpg">
        <p>Transforme seu lar em um refúgio de paz e organização ✨</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Cardprogresso 
          title="Tarefas" 
          icon={<Home size={20} className="text-purple-400" />} 
          progressoDodia={`${tarefas.filter(t => t.feita).length}/${tarefas.length}`} 
          progresso={progressoCasa}
          barraDeProgresso
        />
        <Cardprogresso title="Menu" icon={<Utensils size={20} className="text-orange-400" />} porcentagem={cardapio.almoco || "Planejar..."} />
        <Cardprogresso title="Plantas" icon={<Leaf size={20} className="text-green-400" />} porcentagem="Hidratadas" />
      </div>

      <GrayMenu items={[
        { title: "Rotina Diária", onClick: () => setActive("Rotina"), active: active === "Rotina" },
        { title: "Cardápio", onClick: () => setActive("Cardapio"), active: active === "Cardapio" },
        { title: "Zonas de Limpeza", onClick: () => setActive("Limpeza"), active: active === "Limpeza" },
      ]} />

      <div className="mt-6 pb-10">
        {active === "Rotina" && (
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-purple-50 shadow-sm max-w-xl mx-auto">
            <h3 className="font-black text-purple-400 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Clock size={18} /> Checklist do Dia
            </h3>
            <div className="flex gap-2 mb-6">
              <input type="text" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)}
                placeholder="Ex: Arrumar a cama..." className="flex-1 p-4 bg-purple-50/30 rounded-2xl outline-none border border-purple-100" />
              <button onClick={adicionarTarefa} className="p-4 bg-purple-400 text-white rounded-2xl hover:scale-105 transition-all">
                <Plus size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {tarefas.map(item => (
                <div key={item.id} onClick={() => toggleTarefa(item.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    item.feita ? 'bg-purple-50 border-purple-100 opacity-60' : 'bg-gray-50 border-gray-100'
                  }`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className={item.feita ? "text-purple-500" : "text-gray-200"} />
                    <span className={`font-bold text-sm ${item.feita ? 'line-through text-purple-700' : 'text-gray-600'}`}>
                      {item.tarefa}
                    </span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); excluirTarefa(item.id); }}>
                    <Trash2 size={16} className="text-gray-300 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "Cardapio" && (
          <div className="bg-white p-8 rounded-[3rem] border-2 border-orange-50 max-w-md mx-auto shadow-sm">
            <h3 className="font-black text-orange-400 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Utensils size={18} /> O que vamos comer?
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Almoço</label>
                <input type="text" value={cardapio.almoco}
                  onChange={(e) => {
                    const novosDados = { ...casaData, cardapio: { ...cardapio, almoco: e.target.value } };
                    // Dica: Para inputs de texto, você pode usar um estado local e salvar no onBlur 
                    // para não fazer muitas requisições à API
                  }}
                  onBlur={() => salvarCasa(casaData)}
                  className="w-full p-4 bg-orange-50/50 rounded-2xl border border-orange-100 outline-none"
                  placeholder="Ex: Salada e Frango..." />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Jantar</label>
                <input type="text" value={cardapio.jantar}
                  onBlur={() => salvarCasa(casaData)}
                  onChange={(e) => {
                     // Lógica de alteração local aqui
                  }}
                  className="w-full p-4 bg-orange-50/50 rounded-2xl border border-orange-100 outline-none"
                  placeholder="Ex: Sopa leve..." />
              </div>
            </div>
          </div>
        )}

        {active === "Limpeza" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { t: "Zona 1: Cozinha", d: "Limpar fogão e bancadas", c: "bg-blue-50 text-blue-600" },
              { t: "Zona 2: Quarto", d: "Trocar lençóis e organizar", c: "bg-pink-50 text-pink-600" },
              { t: "Zona 3: Banheiro", d: "Limpeza geral e toalhas", c: "bg-green-50 text-green-600" }
            ].map((zona, i) => (
              <div key={i} className={`p-6 rounded-[2.5rem] ${zona.c} border-2 border-white shadow-sm hover:scale-105 transition-transform`}>
                <Sparkles size={24} className="mx-auto mb-2" />
                <h4 className="font-black text-xs uppercase mb-1">{zona.t}</h4>
                <p className="text-sm opacity-80">{zona.d}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ContainerPages>
  );
}