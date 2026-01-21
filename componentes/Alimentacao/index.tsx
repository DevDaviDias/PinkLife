/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import TestApi from "@/componentes/testapi/testApi"
import { useState, useEffect, useRef } from "react";
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

// --- Definição de Tipos ---
interface DiarioRefeicoes {
  cafe: string;
  almoco: string;
  lanche: string;
  jantar: string;
}

interface ItemCompra {
  id: string;
  item: string;
  comprado: boolean;
}

export default function Alimentacao() {
  const [active, setActive] = useState("Diario");
  const isLoaded = useRef(false);

  // Estados com Tipagem Correta
  const [compras, setCompras] = useState<ItemCompra[]>([]);
  const [novoItem, setNovoItem] = useState("");
  const [refeicoes, setRefeicoes] = useState<DiarioRefeicoes>({
    cafe: "",
    almoco: "",
    lanche: "",
    jantar: ""
  });

  // Carregar dados
  useEffect(() => {
    const savedCompras = localStorage.getItem("alimento_compras");
    const savedRefeicoes = localStorage.getItem("alimento_diario");
    if (savedCompras) setCompras(JSON.parse(savedCompras));
    if (savedRefeicoes) setRefeicoes(JSON.parse(savedRefeicoes));
    isLoaded.current = true;
  }, []);

  // Salvar dados
  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem("alimento_compras", JSON.stringify(compras));
      localStorage.setItem("alimento_diario", JSON.stringify(refeicoes));
    }
  }, [compras, refeicoes]);

  const adicionarCompra = () => {
    if (!novoItem) return;
    const novo: ItemCompra = { id: Date.now().toString(), item: novoItem, comprado: false };
    setCompras(prev => [...prev, novo]);
    setNovoItem("");
  };

  const toggleCompra = (id: string) => {
    setCompras(prev => prev.map(c => c.id === id ? { ...c, comprado: !c.comprado } : c));
  };

  const progressoCompras = compras.length > 0 
    ? (compras.filter(c => c.comprado).length / compras.length) * 100 
    : 0;

  // Lista para o Map do Diário (Evita o erro de any)
  const listaRefeicoes: { id: keyof DiarioRefeicoes; label: string; icon: React.ReactNode; color: string }[] = [
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

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Cardprogresso 
          title="Mercado" 
          icon={<ShoppingBasket size={20} className="text-green-500" />} 
          progressoDodia={`${compras.filter(c => c.comprado).length}/${compras.length}`} 
          progresso={progressoCompras}
          barraDeProgresso={true}
        />
        <Cardprogresso 
          title="Hoje" 
          icon={<Apple size={20} className="text-red-400" />} 
          porcentagem={refeicoes.almoco ? "Refeições OK" : "Planejar"} 
        />
        <Cardprogresso 
          title="Receitas" 
          icon={<ChefHat size={20} className="text-orange-400" />} 
          porcentagem="Explorar" 
        />
      </div>

      <GrayMenu items={[
        { title: "Diário", onClick: () => setActive("Diario"), active: active === "Diario" },
        { title: "Lista de Compras", onClick: () => setActive("Compras"), active: active === "Compras" },
        { title: "Ideias Rápidas", onClick: () => setActive("Ideias"), active: active === "Ideias" },
      ]} />

      <div className="mt-6">
        {/* --- ABA DIÁRIO --- */}
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
                  onChange={(e) => setRefeicoes(prev => ({ ...prev, [ref.id]: e.target.value }))}
                  className="w-full p-3 bg-white/60 rounded-xl outline-none border border-transparent focus:border-white transition-all text-sm resize-none text-gray-700 font-medium"
                  placeholder="O que você comeu?"
                  rows={2}
                />
              </div>
            ))}
          </div>
        )}

        {/* --- ABA COMPRAS --- */}
        {active === "Compras" && (
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-green-50 shadow-sm max-w-xl mx-auto">
            <h3 className="font-black text-green-500 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <ShoppingBasket size={18} /> Lista de Mercado
            </h3>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                placeholder="Ex: Abacate, Leite..."
                className="flex-1 p-4 bg-green-50/30 rounded-2xl outline-none border border-green-100"
              />
              <button onClick={adicionarCompra} className="p-4 bg-green-500 text-white rounded-2xl">
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {compras.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleCompra(item.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    item.comprado ? 'bg-green-50 border-green-100 opacity-60' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className={item.comprado ? "text-green-500" : "text-gray-200"} />
                    <span className={`font-bold text-sm ${item.comprado ? 'line-through text-green-700' : 'text-gray-600'}`}>
                      {item.item}
                    </span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setCompras(prev => prev.filter(c => c.id !== item.id)) }}>
                    <Trash2 size={16} className="text-gray-300 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABA IDEIAS --- */}
        {active === "Ideias" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { t: "Snack Saudável", d: "Iogurte com frutas e mel.", c: "bg-pink-50 text-pink-600" },
              { t: "Jantar Rápido", d: "Omelete recheado com vegetais.", c: "bg-yellow-50 text-yellow-600" },
              { t: "Foco total", d: "Prepare marmitas no domingo!", c: "bg-blue-50 text-blue-600" }
            ].map((ideia, i) => (
              <div key={i} className={`p-6 rounded-[2.5rem] ${ideia.c} border-2 border-white text-center`}>
                <ChefHat size={24} className="mx-auto mb-2" />
                <h4 className="font-black text-xs uppercase mb-1">{ideia.t}</h4>
                <p className="text-sm opacity-80">{ideia.d}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <TestApi/>
    </ContainerPages>
  );
}