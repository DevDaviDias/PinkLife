"use client";

import { useState } from "react";
import axios from "axios";
import ContainerPages from "@/src/componentes/ui/ContainerPages";
import Cabecalho from "@/src/componentes/ui/Cabecalho";
import Cardprogresso from "@/src/componentes/ui/Cardprogresso";
import GrayMenu from "@/src/componentes/ui/GrayMenu";
import { Sparkles, Sun, Moon, Flower2, Scissors, CheckCircle2 } from "lucide-react";
import { useUser } from "@/src/context/UserContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Interfaces locais para garantir que o mapeamento de chaves funcione
interface SkincareManha {
  limpador: boolean;
  tonico: boolean;
  hidratante: boolean;
  protetor: boolean;
}

interface SkincareNoite {
  demaquilante: boolean;
  limpador: boolean;
  serum: boolean;
  hidratante: boolean;
}

export default function Beleza() {
  const { user, refreshUser } = useUser();
  const [active, setActive] = useState("Skincare");

  // Puxa os dados do contexto com valores padrão de segurança
  const belezaData = user?.progress?.beleza || {
    skincareManha: { limpador: false, tonico: false, hidratante: false, protetor: false },
    skincareNoite: { demaquilante: false, limpador: false, serum: false, hidratante: false },
    cronogramaCapilar: "Hidratação"
  };

  const { skincareManha, skincareNoite, cronogramaCapilar } = belezaData;

  // Função para salvar qualquer alteração de beleza no banco de dados
  const atualizarBeleza = async (novosDados: typeof belezaData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/progress/beleza`, novosDados, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshUser(); // Recarrega os dados globais para refletir a mudança
    } catch (error) {
      console.error("Erro ao salvar rotina de beleza:", error);
    }
  };

  const totalManha = Object.values(skincareManha).filter(Boolean).length;
  const totalNoite = Object.values(skincareNoite).filter(Boolean).length;

  return (
    <ContainerPages>
      <Cabecalho title="Beleza 💄" imageSrc="/images/hello-kitty-beauty.jpg">
        <p>Sua rotina de autocuidado em um só lugar ✨</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Cardprogresso 
          title="Skin Manhã" 
          icon={<Sun size={20} className="text-orange-400" />} 
          progressoDodia={`${totalManha}/4 etapas`} 
          progresso={(totalManha / 4) * 100} 
          barraDeProgresso 
        />
        <Cardprogresso 
          title="Skin Noite" 
          icon={<Moon size={20} className="text-purple-400" />} 
          progressoDodia={`${totalNoite}/4 etapas`} 
          progresso={(totalNoite / 4) * 100} 
          barraDeProgresso 
        />
        <Cardprogresso 
          title="Cabelo" 
          icon={<Scissors size={20} className="text-pink-400" />} 
          progressoDodia={cronogramaCapilar} 
        />
      </div>

      <GrayMenu items={[
        { title: "Skincare", onClick: () => setActive("Skincare"), active: active === "Skincare" },
        { title: "Cabelo", onClick: () => setActive("Cabelo"), active: active === "Cabelo" },
      ]} />

      <div className="mt-6 pb-10">
        {active === "Skincare" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ROTINA MANHÃ */}
            <div className="bg-white p-6 rounded-[2rem] border-2 border-orange-50 shadow-sm">
              <h3 className="font-bold text-orange-400 mb-6 flex items-center gap-2 uppercase text-sm font-sans">
                <Sun size={20} /> Rotina Diurna
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(skincareManha) as Array<keyof SkincareManha>).map((item) => (
                  <button 
                    key={item}
                    onClick={() => atualizarBeleza({ 
                      ...belezaData, 
                      skincareManha: { ...skincareManha, [item]: !skincareManha[item] } 
                    })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      skincareManha[item] 
                      ? 'bg-orange-50 border-orange-200 text-orange-600' 
                      : 'bg-gray-50 border-transparent text-gray-300'
                    }`}
                  >
                    <CheckCircle2 size={24} className={skincareManha[item] ? "opacity-100" : "opacity-20"} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ROTINA NOITE */}
            <div className="bg-white p-6 rounded-[2rem] border-2 border-purple-50 shadow-sm">
              <h3 className="font-bold text-purple-400 mb-6 flex items-center gap-2 uppercase text-sm font-sans">
                <Moon size={20} /> Rotina Noturna
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(skincareNoite) as Array<keyof SkincareNoite>).map((item) => (
                  <button 
                    key={item}
                    onClick={() => atualizarBeleza({ 
                      ...belezaData, 
                      skincareNoite: { ...skincareNoite, [item]: !skincareNoite[item] } 
                    })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      skincareNoite[item] 
                      ? 'bg-purple-50 border-purple-200 text-purple-600' 
                      : 'bg-gray-50 border-transparent text-gray-300'
                    }`}
                  >
                    <Sparkles size={24} className={skincareNoite[item] ? "opacity-100" : "opacity-20"} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{item}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {active === "Cabelo" && (
          <div className="bg-white p-8 rounded-[3rem] border-2 border-pink-50 text-center max-w-2xl mx-auto shadow-sm">
            <Flower2 size={50} className="text-pink-300 mx-auto mb-4" />
            <div className="flex flex-wrap justify-center gap-4">
              {["Hidratação", "Nutrição", "Reconstrução", "Umectação"].map((tipo) => (
                <button 
                  key={tipo}
                  onClick={() => atualizarBeleza({ ...belezaData, cronogramaCapilar: tipo })}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all border-2 ${
                    cronogramaCapilar === tipo 
                    ? 'bg-pink-500 border-pink-200 text-white shadow-lg' 
                    : 'bg-gray-50 border-transparent text-gray-400'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ContainerPages>
  );
}