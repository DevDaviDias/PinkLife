/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "@/componentes/ui/GrayMenu";
import { 
  Plane, 
  ShoppingBag, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Backpack, 
  ExternalLink,
  Info
} from "lucide-react";

// --- Definição de Tipos ---
type CategoriaMala = "Roupas" | "Higiene" | "Documentos" | "Outros";

interface ItemMala {
  id: string;
  texto: string;
  check: boolean;
  categoria: CategoriaMala;
}

export default function Viagens() {
  const [active, setActive] = useState("Mala");
  const isLoaded = useRef(false);

  const [itensMala, setItensMala] = useState<ItemMala[]>([]);
  const [novoItem, setNovoItem] = useState("");
  const [categoriaSel, setCategoriaSel] = useState<CategoriaMala>("Roupas");

  // Lista de categorias para o map (com tipagem correta)
  const categorias: CategoriaMala[] = ["Roupas", "Higiene", "Documentos", "Outros"];

  // Carregar dados
  useEffect(() => {
    const savedMala = localStorage.getItem("viagem_mala_v2");
    if (savedMala) {
      try {
        setItensMala(JSON.parse(savedMala));
      } catch (e) {
        console.error("Erro ao carregar mala", e);
      }
    }
    isLoaded.current = true;
  }, []);

  // Salvar dados
  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem("viagem_mala_v2", JSON.stringify(itensMala));
    }
  }, [itensMala]);

  const adicionarItem = () => {
    if (!novoItem) return;
    const novo: ItemMala = { 
      id: Date.now().toString(), 
      texto: novoItem, 
      check: false,
      categoria: categoriaSel 
    };
    setItensMala(prev => [...prev, novo]);
    setNovoItem("");
  };

  const toggleItem = (id: string) => {
    setItensMala(prev => prev.map(i => i.id === id ? { ...i, check: !i.check } : i));
  };

  const progressoMala = itensMala.length > 0 
    ? (itensMala.filter(i => i.check).length / itensMala.length) * 100 
    : 0;

  const sitesUteis = [
    { nome: "Skyscanner", desc: "Passagens baratas", url: "https://www.skyscanner.com.br" },
    { nome: "Booking.com", desc: "Melhores hotéis", url: "https://www.booking.com" },
    { nome: "Airbnb", desc: "Casas e experiências", url: "https://www.airbnb.com.br" },
    { nome: "Shopee", desc: "Acessórios de viagem", url: "https://shopee.com.br" },
  ];

  return (
    <ContainerPages>
      <Cabecalho title="Viagens 🧳" imageSrc="/images/hello-kitty-travel.jpg">
        <p>Planeje seu próximo destino com estilo ✨</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Cardprogresso 
          title="Itens na Mala" 
          icon={<Backpack size={20} className="text-blue-400" />} 
          progressoDodia={`${itensMala.filter(i => i.check).length}/${itensMala.length}`} 
          progresso={progressoMala}
          barraDeProgresso={true}
        />
        <Cardprogresso 
          title="Compras" 
          icon={<ShoppingBag size={20} className="text-pink-400" />} 
          porcentagem="Ver Sites" 
        />
        <Cardprogresso 
          title="Dicas" 
          icon={<Info size={20} className="text-yellow-500" />} 
          porcentagem="Checklist" 
        />
      </div>

      <GrayMenu items={[
        { title: "Mala Pink", onClick: () => setActive("Mala"), active: active === "Mala" },
        { title: "Onde Comprar", onClick: () => setActive("Compras"), active: active === "Compras" },
        { title: "Infos Úteis", onClick: () => setActive("Infos"), active: active === "Infos" },
      ]} />

      <div className="mt-6">
        {active === "Mala" && (
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-pink-50 shadow-sm">
            <h3 className="font-black text-pink-400 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <CheckSquare size={18} /> Checklist de Viagem
            </h3>
            
            <div className="flex flex-col md:flex-row gap-2 mb-8">
              <input 
                type="text" 
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                placeholder="O que não pode esquecer?"
                className="flex-1 p-4 bg-pink-50/30 rounded-2xl outline-none border border-pink-100"
              />
              <select 
                value={categoriaSel}
                onChange={(e) => setCategoriaSel(e.target.value as CategoriaMala)}
                className="p-4 bg-white border border-pink-100 rounded-2xl font-bold text-xs text-pink-400 outline-none"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button onClick={adicionarItem} className="p-4 bg-pink-400 text-white rounded-2xl hover:scale-105 transition-all">
                <Plus size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categorias.map((cat) => (
                <div key={cat}>
                  <h4 className="text-[10px] font-black text-gray-300 uppercase mb-3 ml-2 tracking-tighter">{cat}</h4>
                  <div className="space-y-2">
                    {itensMala.filter(i => i.categoria === cat).map(item => (
                      <div 
                        key={item.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          item.check ? 'bg-green-50/50 border-green-100 opacity-50' : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleItem(item.id)}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.check ? 'bg-green-400 border-green-400' : 'border-gray-200'}`}>
                            {item.check && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className={`font-bold text-sm ${item.check ? 'line-through text-gray-400' : 'text-gray-600'}`}>{item.texto}</span>
                        </div>
                        <button onClick={() => setItensMala(prev => prev.filter(i => i.id !== item.id))}>
                          <Trash2 size={16} className="text-gray-300 hover:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "Compras" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sitesUteis.map((site) => (
              <a 
                key={site.nome} 
                href={site.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-[2rem] border-2 border-blue-50 hover:border-blue-300 transition-all group"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-500">
                   <ExternalLink size={20} />
                </div>
                <h4 className="font-black text-gray-700">{site.nome}</h4>
                <p className="text-xs text-gray-400 mb-4">{site.desc}</p>
                <span className="text-[10px] font-bold text-blue-500 uppercase">Visitar Site →</span>
              </a>
            ))}
          </div>
        )}

        {active === "Infos" && (
          <div className="bg-white p-8 rounded-[3rem] border-2 border-yellow-50 max-w-2xl mx-auto shadow-sm">
             <div className="flex items-center gap-4 mb-6 text-yellow-500">
               <Plane size={32} />
               <h3 className="text-xl font-black uppercase">Guia Rápido</h3>
             </div>
             <div className="space-y-4 text-sm text-gray-500">
                <div className="p-4 bg-yellow-50 rounded-2xl">
                  <p className="font-bold text-yellow-700">📌 Dica de Ouro:</p>
                  <p>Sempre tire foto dos seus documentos antes de viajar!</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </ContainerPages>
  );
}