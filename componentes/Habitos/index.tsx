"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import { 
  Target, 
  Repeat, 
  Flame, 
  Heart, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Trash2 
} from "lucide-react";
import GrayMenu from "../ui/GrayMenu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Habito {
  id: string; // Mudado para string (UUID do backend)
  nome: string;
  descricao: string;
  categoria: string;
  frequencia: string;
  concluido: boolean;
  streak: number;
  emoji: string;
}

export default function Habitos() {
  const [active, setActive] = useState("Hoje");
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Saúde");
  const [freq, setFreq] = useState("Diário");

  // --- Buscar Hábitos do Backend ---
  useEffect(() => {
    const fetchHabitos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/habitos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHabitos(res.data || []);
      } catch (error) {
        console.error("Erro ao buscar hábitos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabitos();
  }, []);

  // --- Criar Hábito ---
  const criarHabito = async () => {
    if (!nome.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const novoHabito = {
        nome,
        descricao: desc,
        categoria: cat,
        frequencia: freq,
        concluido: false,
        streak: 0,
        emoji: "✨"
      };

      const res = await axios.post(`${API_URL}/habitos`, novoHabito, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHabitos(prev => [res.data, ...prev]);
      setNome(""); setDesc(""); setActive("Hoje");
    } catch (error) {
      alert("Erro ao criar hábito");
    }
  };

  // --- Toggle Concluído ---
  const toggleHabito = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${API_URL}/habitos/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHabitos(prev => prev.map(h => h.id === id ? res.data : h));
    } catch (error) {
      console.error("Erro ao atualizar hábito");
    }
  };

  // --- Excluir Hábito ---
  const excluirHabito = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Tens a certeza que queres excluir este hábito? 🎀")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/habitos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHabitos(prev => prev.filter(h => h.id !== id));
    } catch (error) {
      alert("Erro ao excluir hábito");
    }
  };

  // --- Cálculos ---
  const concluidoCount = habitos.filter(h => h.concluido).length;
  const taxaSucesso = habitos.length > 0 ? Math.round((concluidoCount / habitos.length) * 100) : 0;
  const maiorStreak = habitos.length > 0 ? Math.max(...habitos.map(h => h.streak), 0) : 0;

  return (
    <ContainerPages>
      <Cabecalho title="Hábitos 🎯" imageSrc={"/images/hello-kitty-habits.jpg"}>
        <p>Construa hábitos saudáveis dia a dia</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-[0.6em] md:gap-4">
        <Cardprogresso title="Hoje" progressoDodia="concluído" porcentagem={`${concluidoCount}/${habitos.length}`} icon={<Target size={15} />} />
        <Cardprogresso title="Taxa" progressoDodia="sucesso" porcentagem={`${taxaSucesso}%`} icon={<Repeat size={15} />} />
        <Cardprogresso title="Maior" progressoDodia="streak" porcentagem={maiorStreak.toString()} icon={<Flame size={15} className="text-orange-400" />} />
        <Cardprogresso title="Total" progressoDodia="hábitos" porcentagem={habitos.length.toString()} icon={<Heart size={15} />} />
      </div>

      <GrayMenu items={[
        { title: "Hoje", onClick: () => setActive("Hoje"), active: active === "Hoje" },
        { title: "Meus Hábitos", onClick: () => setActive("MeusHabitos"), active: active === "MeusHabitos" },
        { title: "Criar Novo", onClick: () => setActive("Criar"), active: active === "Criar" }
      ]} />

      <div className="mt-6 pb-10">
        {loading ? (
          <p className="text-center py-10 text-pink-400 animate-pulse font-bold">Carregando seus hábitos... 🎀</p>
        ) : (
          <>
            {active === "Hoje" && (
              <div className="space-y-4">
                <h3 className="text-pink-500 font-bold px-2 text-sm uppercase tracking-widest">Checklist ✨</h3>
                {habitos.map(h => (
                  <div 
                    key={h.id} 
                    onClick={() => toggleHabito(h.id)} 
                    className={`group flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer ${
                      h.concluido ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-100 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${h.concluido ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-400'}`}>
                        {h.concluido ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-bold ${h.concluido ? 'text-pink-400 line-through' : 'text-gray-700'}`}>{h.nome}</h4>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded-lg border border-pink-100 text-pink-500 font-bold">
                            {h.streak} dias
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{h.descricao}</p>
                      </div>
                    </div>
                    <button onClick={(e) => excluirHabito(h.id, e)} className="p-2 text-gray-200 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {active === "MeusHabitos" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {habitos.map(h => (
                  <div key={h.id} className="bg-white p-6 rounded-[2rem] border border-pink-100 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="bg-pink-50 p-3 rounded-2xl text-2xl">{h.emoji}</div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-pink-500">{h.streak}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">streak</p>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mt-4">{h.nome}</h4>
                    <p className="text-xs text-gray-400">{h.descricao}</p>
                    <div className="mt-4 pt-3 border-t border-pink-50 flex justify-between items-center">
                      <span className="text-[10px] bg-pink-50 text-pink-500 px-3 py-1 rounded-full font-bold uppercase">{h.categoria}</span>
                      <button onClick={(e) => excluirHabito(h.id, e)} className="text-gray-200 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {active === "Criar" && (
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-pink-50 max-w-2xl mx-auto shadow-sm">
                <h3 className="text-xl font-bold text-pink-500 mb-6 flex items-center gap-2">
                  <Sparkles size={20} /> Novo Hábito
                </h3>
                <div className="space-y-5">
                  <input value={nome} onChange={e => setNome(e.target.value)} type="text" placeholder="Nome" className="w-full p-4 bg-pink-50 rounded-2xl outline-none" />
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição" className="w-full p-4 bg-pink-50 rounded-2xl outline-none h-24" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={cat} onChange={e => setCat(e.target.value)} className="p-4 bg-pink-50 rounded-2xl outline-none">
                      {["Saúde", "Bem-estar", "Educação", "Produtividade"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={freq} onChange={e => setFreq(e.target.value)} className="p-4 bg-pink-50 rounded-2xl outline-none">
                      <option value="Diário">Diário</option>
                      <option value="Semanal">Semanal</option>
                    </select>
                  </div>
                  <button onClick={criarHabito} className="w-full py-5 bg-pink-500 text-white rounded-2xl font-black hover:bg-pink-600 transition-all uppercase tracking-widest">
                    Salvar 🎀
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ContainerPages>
  );
}