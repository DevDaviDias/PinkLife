"use client";

import { useState, useEffect, useRef } from "react";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "@/componentes/ui/GrayMenu";
import { Sparkles, Sun, Moon, Flower2, Scissors, CheckCircle2 } from "lucide-react";

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
  const [active, setActive] = useState("Skincare");
  const isLoaded = useRef(false); // Garante que não vamos salvar por cima antes de carregar

  const [skincareManha, setSkincareManha] = useState<SkincareManha>({ 
    limpador: false, tonico: false, hidratante: false, protetor: false 
  });
  
  const [skincareNoite, setSkincareNoite] = useState<SkincareNoite>({ 
    demaquilante: false, limpador: false, serum: false, hidratante: false 
  });
  
  const [cronogramaCapilar, setCronogramaCapilar] = useState("Hidratação");

  // 1. CARREGAR (Corre apenas uma vez ao montar)
  useEffect(() => {
    const savedManha = localStorage.getItem("beleza_manha");
    const savedNoite = localStorage.getItem("beleza_noite");
    const savedCabelo = localStorage.getItem("beleza_cabelo");
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedManha) setSkincareManha(JSON.parse(savedManha));
    if (savedNoite) setSkincareNoite(JSON.parse(savedNoite));
    if (savedCabelo) setCronogramaCapilar(savedCabelo);
    
    isLoaded.current = true; // Agora podemos salvar com segurança
  }, []);

  // 2. SALVAR (Corre sempre que um estado muda, mas só se já tiver carregado)
  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem("beleza_manha", JSON.stringify(skincareManha));
    }
  }, [skincareManha]);

  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem("beleza_noite", JSON.stringify(skincareNoite));
    }
  }, [skincareNoite]);

  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem("beleza_cabelo", cronogramaCapilar);
    }
  }, [cronogramaCapilar]);

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
          barraDeProgresso={true}
        />
        <Cardprogresso 
          title="Skin Noite" 
          icon={<Moon size={20} className="text-purple-400" />} 
          progressoDodia={`${totalNoite}/4 etapas`} 
          progresso={(totalNoite / 4) * 100}
          barraDeProgresso={true}
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
        { title: "Dicas", onClick: () => setActive("Dicas"), active: active === "Dicas" },
      ]} />

      <div className="mt-6">
        {active === "Skincare" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border-2 border-orange-50 shadow-sm">
              <h3 className="font-bold text-orange-400 mb-6 flex items-center gap-2 uppercase text-sm">
                <Sun size={20} /> Rotina Diurna
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(skincareManha) as Array<keyof SkincareManha>).map((item) => (
                  <button
                    key={item}
                    onClick={() => setSkincareManha(prev => ({ ...prev, [item]: !prev[item] }))}
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

            <div className="bg-white p-6 rounded-[2rem] border-2 border-purple-50 shadow-sm">
              <h3 className="font-bold text-purple-400 mb-6 flex items-center gap-2 uppercase text-sm">
                <Moon size={20} /> Rotina Noturna
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(skincareNoite) as Array<keyof SkincareNoite>).map((item) => (
                  <button
                    key={item}
                    onClick={() => setSkincareNoite(prev => ({ ...prev, [item]: !prev[item] }))}
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
                  onClick={() => setCronogramaCapilar(tipo)}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all border-2 ${
                    cronogramaCapilar === tipo 
                    ? 'bg-pink-500 border-pink-200 text-white' 
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