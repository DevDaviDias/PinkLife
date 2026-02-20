"use client";

import { useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, addDays, parseISO 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, X, Thermometer, Droplets, 
  Brain, Wind, Smile
} from "lucide-react";

import ContainerPages from "@/src/componentes/ui/ContainerPages";
import Cabecalho from "@/src/componentes/ui/Cabecalho";
import GrayMenu from "@/src/componentes/ui/GrayMenu";
import { useUser } from "@/src/context/UserContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// --- 1. Definições de Tipos Estritos (Sem ANY) ---

interface Sintomas {
  dorDeCabeca: boolean;
  colica: boolean;
  inchaco: boolean;
  seiosSensiveis: boolean;
  humorInstavel: boolean;
}

interface RegistroDia {
  data: string;
  menstruando: boolean;
  sintomas: Sintomas;
  notas: string;
}

// Representa a estrutura crua que vem do MongoDB/Contexto
type SaudeRawData = Record<string, {
  data?: string;
  menstruando?: boolean;
  notas?: string;
  sintomas?: Partial<Sintomas>;
}>;

interface SintomaBotaoProps {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  color: "amber" | "purple" | "blue" | "green";
}

// --- 2. Componente Principal ---

export default function Saude() {
  const { user, refreshUser } = useUser();
  const [active, setActive] = useState("Calendário");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Estado tipado corretamente
  const [registros, setRegistros] = useState<Record<string, RegistroDia>>({});
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  // --- 3. Sincronização de Dados ---
useEffect(() => {
    // 1. Verificamos se os dados existem e os tratamos como um objeto de chaves string
    const rawSaude = user?.progress?.saude as Record<string, any> | undefined;

    if (rawSaude) {
      // 2. AQUI ESTÁ O SEGREDO: Definimos explicitamente que 'formatados' 
      // é um registro de RegistroDia. Isso elimina o erro no setRegistros.
      const formatados: Record<string, RegistroDia> = {};

      Object.keys(rawSaude).forEach((key) => {
        const item = rawSaude[key];
        
        // 3. Garantimos que cada campo obrigatório da interface existe
        formatados[key] = {
          data: item.data || key,
          menstruando: !!item.menstruando,
          notas: item.notas || "",
          sintomas: {
            dorDeCabeca: !!item.sintomas?.dorDeCabeca,
            colica: !!item.sintomas?.colica,
            inchaco: !!item.sintomas?.inchaco,
            seiosSensiveis: !!item.sintomas?.seiosSensiveis,
            humorInstavel: !!item.sintomas?.humorInstavel,
          },
        };
      });

      // Agora o TypeScript entende que o objeto inteiro é compatível
      setRegistros(formatados);
    }
  }, [user]);

  // --- 4. Função de Salvar ---
  const atualizarDia = async (data: string, updates: Partial<RegistroDia>) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const diaAtual = registros[data] || { 
      data, 
      menstruando: false, 
      notas: "", 
      sintomas: { dorDeCabeca: false, colica: false, inchaco: false, seiosSensiveis: false, humorInstavel: false } 
    };

    const novoRegistro: RegistroDia = { 
        ...diaAtual, 
        ...updates,
        sintomas: { ...diaAtual.sintomas, ...(updates.sintomas || {}) }
    };

    try {
      await axios.post(`${API_URL}/saude`, novoRegistro, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshUser();
    } catch (err) {
      console.error("Erro ao salvar dados de saúde:", err);
    }
  };

  return (
    <ContainerPages>
      <div className="-mt-4">
        <Cabecalho title="Minha Saúde 🌸">
          <p className="text-sm opacity-70">Acompanhe seu ciclo e bem-estar</p>
        </Cabecalho>
      </div>

      <div className="mt-4">
        <GrayMenu items={[
          { title: "Calendário", onClick: () => setActive("Calendário"), active: active === "Calendário" },
          { title: "Histórico", onClick: () => setActive("Histórico"), active: active === "Histórico" },
        ]} />
      </div>

      <div className="mt-6 mb-24">
        {active === "Calendário" && (
           <div className="max-w-xl mx-auto px-1">
             <div className="flex justify-between items-center mb-6 px-2">
               <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 text-pink-500 hover:bg-pink-50 rounded-full transition-all"><ChevronLeft /></button>
               <h3 className="font-bold text-gray-700 uppercase text-xs tracking-[0.2em]">
                 {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
               </h3>
               <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 text-pink-500 hover:bg-pink-50 rounded-full transition-all"><ChevronRight /></button>
             </div>
             
             <CalendarioComp currentMonth={currentMonth} registros={registros} onSelect={setDiaSelecionado} />
           </div>
        )}

        {active === "Histórico" && (
          <div className="max-w-2xl mx-auto px-2">
            <div className="bg-white rounded-[2.5rem] border border-pink-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-pink-50/30">
                  <tr>
                    <th className="p-5 text-[10px] font-black text-pink-500 uppercase">Data</th>
                    <th className="p-5 text-[10px] font-black text-pink-500 uppercase text-center">Fluxo</th>
                    <th className="p-5 text-[10px] font-black text-pink-500 uppercase">Sintomas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {Object.values(registros)
                    .sort((a, b) => b.data.localeCompare(a.data))
                    .map((reg) => (
                      <tr key={reg.data} className="hover:bg-pink-50/20 transition-colors cursor-pointer" onClick={() => setDiaSelecionado(reg.data)}>
                        <td className="p-5 font-bold text-gray-600 text-xs">{format(parseISO(reg.data), "dd/MM/yy")}</td>
                        <td className="p-5 text-center">{reg.menstruando && <Droplets size={18} className="text-pink-500 mx-auto" />}</td>
                        <td className="p-5">
                          <div className="flex flex-wrap gap-1">
                            {reg.sintomas.colica && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                            {reg.sintomas.dorDeCabeca && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                            {reg.sintomas.inchaco && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                            {reg.sintomas.humorInstavel && <div className="w-2 h-2 rounded-full bg-green-400" />}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ModalSintomas 
        dia={diaSelecionado} 
        registros={registros} 
        onClose={() => setDiaSelecionado(null)} 
        onUpdate={atualizarDia} 
      />
    </ContainerPages>
  );
}

// --- SUBCOMPONENTES ---

function CalendarioComp({ currentMonth, registros, onSelect }: { currentMonth: Date, registros: Record<string, RegistroDia>, onSelect: (d: string) => void }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows: ReactNode[] = [];
  let days: ReactNode[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dStr = format(day, "yyyy-MM-dd");
      const reg = registros[dStr];
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <div 
          key={dStr} 
          onClick={() => isCurrentMonth && onSelect(dStr)} 
          className={`aspect-square p-1 relative cursor-pointer border-[0.5px] border-pink-50/20 flex flex-col items-center justify-center transition-all ${!isCurrentMonth ? "opacity-10 pointer-events-none" : "hover:bg-pink-50"}`}
        >
          {reg?.menstruando && (
            <motion.div layoutId="menstru" className="absolute inset-1.5 bg-pink-400 rounded-2xl shadow-inner" />
          )}
          <span className={`relative text-xs font-bold z-10 ${reg?.menstruando ? "text-white" : "text-gray-500"}`}>
            {format(day, "d")}
          </span>
          <div className="flex gap-0.5 mt-0.5 relative z-10">
             {reg?.sintomas.colica && <div className="w-1 h-1 rounded-full bg-amber-400" />}
             {reg?.sintomas.dorDeCabeca && <div className="w-1 h-1 rounded-full bg-purple-400" />}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(<div className="grid grid-cols-7" key={day.getTime()}>{days}</div>);
    days = [];
  }
  return <div className="bg-white rounded-[2.5rem] overflow-hidden border border-pink-100 shadow-sm">{rows}</div>;
}

function ModalSintomas({ dia, registros, onClose, onUpdate }: { dia: string | null, registros: Record<string, RegistroDia>, onClose: () => void, onUpdate: (d: string, u: Partial<RegistroDia>) => Promise<void> }) {
  if (!dia) return null;
  const reg = registros[dia] || { 
    menstruando: false, 
    notas: "", 
    sintomas: { dorDeCabeca: false, colica: false, inchaco: false, humorInstavel: false, seiosSensiveis: false } 
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-gray-800">{format(parseISO(dia), "dd 'de' MMMM", { locale: ptBR })}</h2>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20}/></button>
          </div>
          
          <div className="space-y-6">
             <button 
                onClick={() => onUpdate(dia, { menstruando: !reg.menstruando })} 
                className={`w-full p-5 rounded-[2rem] border-2 flex justify-between items-center transition-all ${reg.menstruando ? 'border-pink-400 bg-pink-50' : 'border-gray-50 bg-gray-50'}`}
             >
                <span className="font-bold text-pink-600 flex items-center gap-3"><Droplets size={22}/> Fluxo Menstrual</span>
                <div className={`w-6 h-6 rounded-full border-2 ${reg.menstruando ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-200'}`} />
             </button>
             
             <div className="grid grid-cols-2 gap-3">
                <SintomaBotao label="Cólica" icon={<Thermometer size={16}/>} active={reg.sintomas.colica} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, colica: !reg.sintomas.colica } })} color="amber" />
                <SintomaBotao label="Cabeça" icon={<Brain size={16}/>} active={reg.sintomas.dorDeCabeca} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, dorDeCabeca: !reg.sintomas.dorDeCabeca } })} color="purple" />
                <SintomaBotao label="Inchaço" icon={<Wind size={16}/>} active={reg.sintomas.inchaco} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, inchaco: !reg.sintomas.inchaco } })} color="blue" />
                <SintomaBotao label="Humor" icon={<Smile size={16}/>} active={reg.sintomas.humorInstavel} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, humorInstavel: !reg.sintomas.humorInstavel } })} color="green" />
             </div>
             
             <textarea 
               placeholder="Notas sobre o dia..." 
               value={reg.notas} 
               onChange={(e) => onUpdate(dia, { notas: e.target.value })} 
               className="w-full p-5 bg-gray-50 rounded-[2rem] text-sm min-h-[100px] outline-none border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all" 
             />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SintomaBotao({ label, icon, active, onClick, color }: SintomaBotaoProps) {
  const colors = {
    amber: active ? "border-amber-400 bg-amber-50 text-amber-700 shadow-sm" : "border-gray-50 bg-gray-50 text-gray-400",
    purple: active ? "border-purple-400 bg-purple-50 text-purple-700 shadow-sm" : "border-gray-50 bg-gray-50 text-gray-400",
    blue: active ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-50 bg-gray-50 text-gray-400",
    green: active ? "border-green-400 bg-green-50 text-green-700 shadow-sm" : "border-gray-50 bg-gray-50 text-gray-400",
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all active:scale-95 ${colors[color]}`}
    >
      {icon} {label}
    </button>
  );
}