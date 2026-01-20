"use client";

import { useState, useEffect } from "react";
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
  BookOpen, 
  Trash2 
} from "lucide-react";
import GrayMenu from "../ui/GrayMenu";

// --- Interface para o Hábito ---
interface Habito {
  id: number;
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
  
  // Estados para o Formulário de Criação
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Saúde");
  const [freq, setFreq] = useState("Diário");

  // --- Carregar Dados com Proteção de Erro ---
  useEffect(() => {
    try {
      const salvos = localStorage.getItem("habitos_v2");
      if (salvos) {
        const dadosConvertidos = JSON.parse(salvos);
        if (Array.isArray(dadosConvertidos)) {
          setHabitos(dadosConvertidos);
        } else {
          throw new Error("Formato inválido");
        }
      } else {
        // Exemplos Iniciais
        const iniciais: Habito[] = [
          { id: 1, nome: "Beber 2L de água", descricao: "Manter-se hidratada durante o dia", categoria: "Saúde", frequencia: "Diário", concluido: false, streak: 7, emoji: "✨" },
          { id: 2, nome: "Meditar 10 minutos", descricao: "Praticar mindfulness e relaxamento", categoria: "Bem-estar", frequencia: "Diário", concluido: true, streak: 3, emoji: "💫" },
          { id: 3, nome: "Ler 30 páginas", descricao: "Desenvolver o hábito de leitura", categoria: "Educação", frequencia: "Diário", concluido: false, streak: 12, emoji: "📖" },
        ];
        setHabitos(iniciais);
      }
    } catch (error) {
      console.error("Erro ao carregar hábitos:", error);
      setHabitos([]); // Fallback para lista vazia se houver erro
    }
  }, []);

  // --- Salvar no LocalStorage ---
  useEffect(() => {
    if (habitos.length > 0) {
      localStorage.setItem("habitos_v2", JSON.stringify(habitos));
    }
  }, [habitos]);

  // --- Funções de Ação ---
  const criarHabito = () => {
    if (!nome.trim()) return;
    const novo: Habito = {
      id: Date.now(),
      nome,
      descricao: desc,
      categoria: cat,
      frequencia: freq,
      concluido: false,
      streak: 0,
      emoji: "✨"
    };
    setHabitos(prev => [...prev, novo]);
    setNome(""); setDesc(""); setActive("Hoje");
  };

  const toggleHabito = (id: number) => {
    setHabitos(prev => prev.map(h => 
      h.id === id ? { 
        ...h, 
        concluido: !h.concluido, 
        streak: !h.concluido ? h.streak + 1 : Math.max(0, h.streak - 1) 
      } : h
    ));
  };

  const excluirHabito = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tens a certeza que queres excluir este hábito? 🎀")) {
      setHabitos(prev => prev.filter(h => h.id !== id));
    }
  };

  // --- Cálculos para os Cards ---
  const concluidoCount = habitos.filter(h => h.concluido).length;
  const taxaSucesso = habitos.length > 0 ? Math.round((concluidoCount / habitos.length) * 100) : 0;
  const maiorStreak = habitos.length > 0 ? Math.max(...habitos.map(h => h.streak), 0) : 0;

  return (
    <ContainerPages>
      <Cabecalho title="Hábitos 🎯" imageSrc={"/images/hello-kitty-habits.jpg"}>
        <p>Construa hábitos saudáveis dia a dia</p>
      </Cabecalho>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-[0.6em] md:gap-4">
        <Cardprogresso title="Hoje" progressoDodia="concluído" porcentagem={`${concluidoCount}/${habitos.length}`} icon={<Target size={15} />} />
        <Cardprogresso title="Taxa" progressoDodia="sucesso" porcentagem={`${taxaSucesso}%`} icon={<Repeat size={15} />} />
        <Cardprogresso title="Maior Streak" progressoDodia="recorde" porcentagem={maiorStreak.toString()} icon={<Flame size={15} className="text-orange-400" />} />
        <Cardprogresso title="Total" progressoDodia="hábitos" porcentagem={habitos.length.toString()} icon={<Heart size={15} />} />
      </div>

      <GrayMenu items={[
        { title: "Hoje", onClick: () => setActive("Hoje"), active: active === "Hoje" },
        { title: "Meus Hábitos", onClick: () => setActive("MeusHabitos"), active: active === "MeusHabitos" },
        { title: "Criar Novo Hábito", onClick: () => setActive("Criar"), active: active === "Criar" }
      ]} />

      <div className="mt-6 pb-10">
        
        {/* --- ABA HOJE (Checklist) --- */}
        {active === "Hoje" && (
          <div className="space-y-4">
            <h3 className="text-pink-500 font-bold px-2">Checklist de Hoje ✨</h3>
            {habitos.map(h => (
              <div 
                key={h.id} 
                onClick={() => toggleHabito(h.id)} 
                className={`group flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer ${
                  h.concluido ? 'bg-pink-50 border-pink-200 shadow-inner' : 'bg-white border-gray-100 shadow-sm hover:border-pink-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-colors ${h.concluido ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-pink-50 text-pink-400'}`}>
                    {h.concluido ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-bold ${h.concluido ? 'text-pink-400 line-through' : 'text-gray-700'}`}>{h.nome}</h4>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-lg border border-pink-100 text-pink-500 font-bold">
                        {h.emoji} {h.streak} dias
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{h.descricao}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] text-pink-300 font-bold uppercase">{h.categoria}</span>
                      <span className="text-[10px] text-gray-300 font-bold uppercase">• {h.frequencia}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={(e) => excluirHabito(h.id, e)}
                  className="p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {habitos.length === 0 && <p className="text-center py-10 text-gray-400">Comece criando o seu primeiro hábito! 🎀</p>}
          </div>
        )}

        {/* --- ABA MEUS HÁBITOS (Cards) --- */}
        {active === "MeusHabitos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {habitos.map(h => (
              <div key={h.id} className="bg-white p-6 rounded-[2rem] border border-pink-100 shadow-sm relative group">
                <div className="flex justify-between items-start">
                  <div className="bg-pink-50 p-3 rounded-2xl text-2xl">{h.emoji}</div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-pink-500 leading-none">{h.streak}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">dias completados</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 mt-4">{h.nome}</h4>
                <p className="text-xs text-gray-400">{h.descricao}</p>
                <div className="mt-4 pt-3 border-t border-pink-50 flex justify-between items-center">
                  <span className="text-[10px] bg-pink-50 text-pink-500 px-3 py-1 rounded-full font-bold uppercase">{h.categoria}</span>
                  <button onClick={(e) => excluirHabito(h.id, e)} className="text-gray-200 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- ABA CRIAR --- */}
        {active === "Criar" && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-pink-50 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-pink-500 mb-6 flex items-center gap-2">
              <Sparkles size={20} /> Criar Novo Hábito
            </h3>
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Nome do Hábito</label>
                <input value={nome} onChange={e => setNome(e.target.value)} type="text" placeholder="Ex: Beber 2L de água" className="w-full p-4 bg-pink-50 rounded-2xl outline-none border-2 border-transparent focus:border-pink-200 transition-all" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Descrição</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Manter-se hidratada durante o dia" className="w-full p-4 bg-pink-50 rounded-2xl outline-none border-2 border-transparent focus:border-pink-200 transition-all h-24 resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Categoria</label>
                  <select value={cat} onChange={e => setCat(e.target.value)} className="w-full p-4 bg-pink-50 rounded-2xl outline-none border-2 border-transparent focus:border-pink-200 text-gray-600">
                    {["Saúde", "Bem-estar", "Educação", "Produtividade", "Beleza", "Exercício"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Frequência</label>
                  <select value={freq} onChange={e => setFreq(e.target.value)} className="w-full p-4 bg-pink-50 rounded-2xl outline-none border-2 border-transparent focus:border-pink-200 text-gray-600">
                    <option value="Diário">Diário</option>
                    <option value="Semanal">Semanal</option>
                  </select>
                </div>
              </div>

              <button onClick={criarHabito} className="w-full py-5 bg-pink-500 text-white rounded-2xl font-black shadow-lg shadow-pink-100 hover:bg-pink-600 active:scale-95 transition-all mt-4 uppercase text-sm tracking-widest">
                Salvar Hábito 🎀
              </button>
            </div>
          </div>
        )}
      </div>
    </ContainerPages>
  );
}