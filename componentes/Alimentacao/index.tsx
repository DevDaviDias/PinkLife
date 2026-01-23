"use client";

import { useState } from "react";
import axios from "axios";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "@/componentes/ui/GrayMenu";
import { 
  Apple, 
  ShoppingBasket, 
  ChefHat, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Coffee,
  Sandwich
} from "lucide-react";
import { useUser } from "@/componentes/context/UserContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Alimentacao() {
  const { user, refreshUser } = useUser();
  const [active, setActive] = useState("Diario");
  const [novoItem, setNovoItem] = useState("");

  // Dados vindos do banco com fallback
  const alimentacao = user?.progress?.alimentacao || {
    refeicoes: { cafe: "", almoco: "", lanche: "", jantar: "" },
    compras: []
  };

  const { refeicoes, compras } = alimentacao;

  // --- Função para Salvar no Banco ---
  const salvarAlimentacao = async (novosDados: typeof alimentacao) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/progress/alimentacao`, novosDados, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshUser();
    } catch (error) {
      console.error("Erro ao salvar alimentação:", error);
    }
  };

  // --- Ações de Compras ---
  const adicionarCompra = () => {
    if (!novoItem.trim()) return;
    const novo = { id: Date.now().toString(), item: novoItem, comprado: false };
    salvarAlimentacao({ ...alimentacao, compras: [...compras, novo] });
    setNovoItem("");
  };

  const toggleCompra = (id: string) => {
    const novasCompras = compras.map(c => c.id === id ? { ...c, comprado: !c.comprado } : c);
    salvarAlimentacao({ ...alimentacao, compras: novasCompras });
  };

  const excluirCompra = (id: string) => {
    salvarAlimentacao({ ...alimentacao, compras: compras.filter(c => c.id !== id) });
  };

  const progressoCompras = compras.length > 0 
    ? (compras.filter(c => c.comprado).length / compras.length) * 100 
    : 0;

  const listaRefeicoes: { id: keyof typeof refeicoes; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "cafe", label: "Café da Manhã", icon: <Coffee size={18}/>, color: "border-orange-100 bg-orange-50/30" },
    { id: "almoco", label: "Almoço", icon: <Apple size={18}/>, color: "border-green-100 bg-green-50/30" },
    { id: "lanche", label: "Lanche", icon: <Sandwich size={18}/>, color: "border-pink-100 bg-pink-50/30" },
    { id: "jantar", label: "Jantar", icon: <ChefHat size={18}/>, color: "border-blue-100 bg-blue-50/30" },
  ];

  return (
    <ContainerPages>
      <Cabecalho title="Alimentação 🍏" imageSrc="/images/hello-kitty-food.jpg">
        <p>Nutra seu corpo com carinho e equilíbrio ✨</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Cardprogresso title="Mercado" icon={<ShoppingBasket size={20} className="text-green-500" />} 
          progressoDodia={`${compras.filter(c => c.comprado).length}/${compras.length}`} 
          progresso={progressoCompras} barraDeProgresso />
        <Cardprogresso title="Hoje" icon={<Apple size={20} className="text-red-400" />} 
          porcentagem={refeicoes.almoco ? "Refeições OK" : "Planejar"} />
        <Cardprogresso title="Receitas" icon={<ChefHat size={20} className="text-orange-400" />} porcentagem="Explorar" />
      </div>

      <GrayMenu items={[
        { title: "Diário", onClick: () => setActive("Diario"), active: active === "Diario" },
        { title: "Lista de Compras", onClick: () => setActive("Compras"), active: active === "Compras" },
      ]} />

      <div className="mt-6 pb-10">
        {active === "Diario" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listaRefeicoes.map((ref) => (
              <div key={ref.id} className={`p-6 rounded-[2rem] border-2 shadow-sm ${ref.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-600">{ref.icon}</span>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{ref.label}</label>
                </div>
                <textarea 
                  value={refeicoes[ref.id]}
                  onBlur={() => salvarAlimentacao(alimentacao)} // Salva ao sair do campo
                  onChange={(e) => {
                    const novosDados = { ...alimentacao, refeicoes: { ...refeicoes, [ref.id]: e.target.value } };
                    // Atualiza localmente para não travar a digitação, mas sem disparar API a cada letra
                    // Para melhor performance, use um estado local e salve no onBlur
                  }}
                  className="w-full p-3 bg-white/60 rounded-xl outline-none border border-transparent focus:border-white text-sm resize-none"
                  placeholder="O que você comeu?"
                  rows={2}
                />
              </div>
            ))}
          </div>
        )}

        {active === "Compras" && (
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-green-50 shadow-sm max-w-xl mx-auto">
            <h3 className="font-black text-green-500 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <ShoppingBasket size={18} /> Lista de Mercado
            </h3>
            <div className="flex gap-2 mb-6">
              <input type="text" value={novoItem} onChange={(e) => setNovoItem(e.target.value)}
                placeholder="Ex: Abacate, Leite..." className="flex-1 p-4 bg-green-50/30 rounded-2xl outline-none" />
              <button onClick={adicionarCompra} className="p-4 bg-green-500 text-white rounded-2xl hover:scale-95 transition-transform">
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {compras.map(item => (
                <div key={item.id} onClick={() => toggleCompra(item.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    item.comprado ? 'bg-green-50 border-green-100 opacity-60' : 'bg-gray-50 border-gray-100'
                  }`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className={item.comprado ? "text-green-500" : "text-gray-200"} />
                    <span className={`font-bold text-sm ${item.comprado ? 'line-through text-green-700' : 'text-gray-600'}`}>
                      {item.item}
                    </span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); excluirCompra(item.id); }}>
                    <Trash2 size={16} className="text-gray-300 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ContainerPages>
  );
}