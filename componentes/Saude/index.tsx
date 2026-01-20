/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "@/componentes/ui/GrayMenu";
import { 
  Droplets, 
  Calendar as CalendarIcon, 
  Activity, 
  Heart, 
  Plus, 
  Trash2 
} from "lucide-react";

interface RegistroCiclo {
  id: string;
  dataInicio: string;
  duracao: number;
  sintomas: string[];
}

export default function Saude() {
  const [active, setActive] = useState("Ciclo");
  const isLoaded = useRef(false); // Nosso "cadeado" para o salvamento

  const [registros, setRegistros] = useState<RegistroCiclo[]>([]);
  const [coposAgua, setCoposAgua] = useState(0);

  // Estados para novo registro
  const [dataInicio, setDataInicio] = useState("");
  const [duracao, setDuracao] = useState("5");

  // 1. CARREGAR DADOS (Executa apenas 1 vez ao abrir a página)
  useEffect(() => {
    const savedCiclo = localStorage.getItem("saude_ciclo");
    const savedAgua = localStorage.getItem("saude_agua_hoje");
    
    if (savedCiclo) setRegistros(JSON.parse(savedCiclo));
    if (savedAgua) setCoposAgua(parseInt(savedAgua));
    
    // Após carregar tudo, abrimos o cadeado para permitir salvamentos
    isLoaded.current = true;
  }, []);

  // 2. SALVAR DADOS (Executa sempre que registros ou coposAgua mudarem)
  useEffect(() => {
    // SÓ SALVA SE O CARREGAMENTO JÁ TIVER SIDO CONCLUÍDO
    if (isLoaded.current) {
      localStorage.setItem("saude_ciclo", JSON.stringify(registros));
      localStorage.setItem("saude_agua_hoje", coposAgua.toString());
    }
  }, [registros, coposAgua]);

  const adicionarCiclo = () => {
    if (!dataInicio) return;
    const novo: RegistroCiclo = {
      id: Date.now().toString(),
      dataInicio,
      duracao: parseInt(duracao),
      sintomas: []
    };
    setRegistros([novo, ...registros]);
    setDataInicio("");
  };

  const deletarCiclo = (id: string) => {
    setRegistros(registros.filter(r => r.id !== id));
  };

  return (
    <ContainerPages>
      <Cabecalho title="Saúde 🩺" imageSrc="/images/hello-kitty-health.jpg">
        <p>Cuide de você com carinho e organização ✨</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Cardprogresso 
          title="Água" 
          icon={<Droplets size={20} className="text-blue-400" />} 
          progressoDodia={`${coposAgua}/8 copos`} 
          progresso={(coposAgua / 8) * 100}
          barraDeProgresso={true}
        />
        <Cardprogresso 
          title="Último Ciclo" 
          icon={<CalendarIcon size={20} className="text-pink-400" />} 
          porcentagem={registros[0]?.dataInicio.split('-').reverse().slice(0,2).join('/') || "--"} 
        />
        <Cardprogresso 
          title="Status" 
          icon={<Heart size={20} className="text-red-400" />} 
          porcentagem="Bem-estar" 
        />
      </div>

      <GrayMenu items={[
        { title: "Ciclo", onClick: () => setActive("Ciclo"), active: active === "Ciclo" },
        { title: "Hidratação", onClick: () => setActive("Agua"), active: active === "Agua" },
        { title: "Sintomas", onClick: () => setActive("Sintomas"), active: active === "Sintomas" },
      ]} />

      <div className="mt-6">
        {active === "Ciclo" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border-2 border-pink-50 shadow-sm">
              <h3 className="font-bold text-pink-500 mb-4 flex items-center gap-2 uppercase text-sm">
                <Plus size={18} /> Registrar Período
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Data de Início</label>
                  <input 
                    type="date" 
                    value={dataInicio} 
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full p-3 bg-pink-50/50 rounded-xl outline-none border border-pink-100 mt-1" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Duração (dias)</label>
                  <input 
                    type="number" 
                    value={duracao} 
                    onChange={(e) => setDuracao(e.target.value)}
                    className="w-full p-3 bg-pink-50/50 rounded-xl outline-none border border-pink-100 mt-1" 
                  />
                </div>
                <button 
                  onClick={adicionarCiclo}
                  className="w-full py-4 bg-pink-400 text-white rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-500 transition-all"
                >
                  Salvar Registro 🌸
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border-2 border-pink-50 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 uppercase text-sm">
                <Activity size={18} className="text-pink-400" /> Histórico
              </h3>
              <div className="space-y-3">
                {registros.map(reg => (
                  <div key={reg.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-700">{reg.dataInicio.split('-').reverse().join('/')}</p>
                      <p className="text-xs text-gray-400">{reg.duracao} dias de duração</p>
                    </div>
                    <button onClick={() => deletarCiclo(reg.id)} className="text-gray-300 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === "Agua" && (
          <div className="bg-white p-10 rounded-[3rem] border-2 border-blue-50 text-center max-w-md mx-auto shadow-sm">
             <div className="relative inline-block mb-6">
                <Droplets size={80} className="text-blue-400 animate-bounce" />
             </div>
             <h3 className="text-2xl font-black text-blue-500 mb-2">Bebeu água hoje?</h3>
             <p className="text-gray-400 text-sm mb-8">Mantenha sua pele e saúde radiantes! 💎</p>
             
             <div className="flex justify-center gap-4 mb-8">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCoposAgua(i + 1)}
                    className={`w-8 h-12 rounded-b-lg border-2 cursor-pointer transition-all ${i < coposAgua ? 'bg-blue-400 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                  ></div>
                ))}
             </div>

             <div className="flex gap-4">
               <button onClick={() => setCoposAgua(0)} className="flex-1 py-3 bg-gray-100 text-gray-400 rounded-xl font-bold">Zerar</button>
               <button onClick={() => setCoposAgua(prev => Math.min(prev + 1, 8))} className="flex-2 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-100">+ 1 Copo</button>
             </div>
          </div>
        )}

        {active === "Sintomas" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {["Cólica", "Dor de Cabeça", "Inchaço", "Cansaço", "Humor Instável", "Pele Oleosa", "Desejo Doces", "Sono"].map(sintoma => (
               <button key={sintoma} className="p-6 bg-white border-2 border-pink-50 rounded-[2rem] hover:border-pink-300 transition-all text-center group">
                  <div className="w-12 h-12 bg-pink-50 rounded-full mx-auto mb-3 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                    <Heart size={20} />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{sintoma}</span>
               </button>
             ))}
          </div>
        )}
      </div>
    </ContainerPages>
  );
}