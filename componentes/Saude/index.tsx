/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, addDays, parseISO 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, X, Thermometer, Droplets, 
  Brain, Wind, Smile, Sparkles
} from "lucide-react";

import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import GrayMenu from "@/componentes/ui/GrayMenu";

const API_URL = "http://localhost:3001";

// --- Interfaces de Dados ---
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

// --- Interfaces de Props ---
interface CalendarioProps {
  currentMonth: Date;
  registros: Record<string, RegistroDia>;
  onSelect: (data: string) => void;
}

interface ModalSintomasProps {
  dia: string | null;
  registros: Record<string, RegistroDia>;
  onClose: () => void;
  onUpdate: (data: string, updates: Partial<RegistroDia>) => void;
}

interface SintomaBotaoProps {
  label: string;
  icon: ReactNode;
  active: boolean | undefined;
  onClick: () => void;
  color: "amber" | "purple" | "blue" | "green";
}

export default function Saude() {
  const [active, setActive] = useState("Calendário");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [registros, setRegistros] = useState<Record<string, RegistroDia>>({});
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const isLoaded = useRef(false);

  const [analisando, setAnalisando] = useState(false);
  const [relatorioIA, setRelatorioIA] = useState<string | null>(null);

  // --- CARREGAR DADOS DO BANCO ---
  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/saude`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistros(res.data || {});
        isLoaded.current = true;
      } catch (err) {
        console.error("Erro ao carregar saúde:", err);
      }
    };
    carregarDados();
  }, []);

  // --- ATUALIZAR DIA (SALVAR NO BANCO) ---
  const atualizarDia = async (data: string, updates: Partial<RegistroDia>) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const diaAtual = registros[data] || { 
      data, menstruando: false, notas: "", 
      sintomas: { dorDeCabeca: false, colica: false, inchaco: false, seiosSensiveis: false, humorInstavel: false } 
    };

    const novoRegistro = { ...diaAtual, ...updates };

    // Atualização Otimista (UI primeiro)
    setRegistros(prev => ({ ...prev, [data]: novoRegistro }));

    try {
      await axios.post(`${API_URL}/saude`, novoRegistro, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Erro ao salvar dia:", err);
    }
  };

  const gerarAnaliseIA = () => {
    setAnalisando(true);
    setTimeout(() => {
      const lista = Object.values(registros);
      let msg = "Ciclo estável. ";
      if (lista.filter(r => r.sintomas.colica).length > 3) msg += "Notei cólicas frequentes.";
      setRelatorioIA(msg);
      setAnalisando(false);
    }, 2000);
  };

  return (
    <ContainerPages>
      <div className="-mt-4">
        <Cabecalho title="Saúde Pro 🌸">
          <p className="text-sm">Seu diário inteligente</p>
        </Cabecalho>
      </div>

      <div className="mt-4">
        <GrayMenu items={[
          { title: "Calendário", onClick: () => setActive("Calendário"), active: active === "Calendário" },
          { title: "Histórico", onClick: () => setActive("Histórico"), active: active === "Histórico" },
          { title: "Análise IA", onClick: () => setActive("Análise"), active: active === "Análise" },
        ]} />
      </div>

      <div className="mt-6 mb-24">
        {active === "Calendário" && (
           <div className="max-w-xl mx-auto px-1">
             <div className="flex justify-between items-center mb-4">
               <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 text-pink-400"><ChevronLeft /></button>
               <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h3>
               <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 text-pink-400"><ChevronRight /></button>
             </div>
             <Calendario currentMonth={currentMonth} registros={registros} onSelect={setDiaSelecionado} />
           </div>
        )}

        {active === "Histórico" && (
          <div className="max-w-2xl mx-auto px-2 overflow-hidden">
            <div className="bg-white rounded-[2rem] border border-pink-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="p-4 text-[10px] font-black text-pink-400 uppercase">Data</th>
                    <th className="p-4 text-[10px] font-black text-pink-400 uppercase text-center">Fluxo</th>
                    <th className="p-4 text-[10px] font-black text-pink-400 uppercase">Sintomas/Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Object.values(registros)
                    .sort((a, b) => b.data.localeCompare(a.data))
                    .map((reg) => (
                      <tr key={reg.data} className="active:bg-gray-50 transition-colors cursor-pointer" onClick={() => setDiaSelecionado(reg.data)}>
                        <td className="p-4"><span className="text-xs font-bold text-gray-700">{format(parseISO(reg.data), "dd/MM")}</span></td>
                        <td className="p-4 text-center">{reg.menstruando && <Droplets size={16} className="text-pink-500 mx-auto" />}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {reg.sintomas.colica && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                            {reg.sintomas.dorDeCabeca && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                            {reg.sintomas.inchaco && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                            {reg.sintomas.humorInstavel && <div className="w-2 h-2 rounded-full bg-green-400" />}
                          </div>
                          {reg.notas && <p className="text-[10px] text-gray-400 italic line-clamp-1">{reg.notas}</p>}
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

function Calendario({ currentMonth, registros, onSelect }: CalendarioProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dStr = format(day, "yyyy-MM-dd");
      const reg = registros[dStr];
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <div key={dStr} onClick={() => onSelect(dStr)} className={`aspect-square p-0.5 relative cursor-pointer border-[0.5px] border-pink-50/30 flex flex-col items-center justify-center ${!isCurrentMonth ? "opacity-10" : "opacity-100"}`}>
          {reg?.menstruando && <div className="absolute inset-1.5 bg-pink-400 rounded-xl" />}
          <span className={`relative text-xs font-bold z-10 ${reg?.menstruando ? "text-white" : "text-gray-500"}`}>{format(day, "d")}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(<div className="grid grid-cols-7" key={day.getTime()}>{days}</div>);
    days = [];
  }
  return <div className="bg-white rounded-3xl overflow-hidden border border-pink-100">{rows}</div>;
}

function ModalSintomas({ dia, registros, onClose, onUpdate }: ModalSintomasProps) {
  if (!dia) return null;
  const reg = registros[dia] || { menstruando: false, notas: "", sintomas: { dorDeCabeca: false, colica: false, inchaco: false, humorInstavel: false, seiosSensiveis: false } };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black">{format(parseISO(dia), "dd 'de' MMMM", { locale: ptBR })}</h2>
            <button onClick={onClose} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button>
          </div>
          <div className="space-y-4">
             <button onClick={() => onUpdate(dia, { menstruando: !reg.menstruando })} className={`w-full p-4 rounded-2xl border-2 flex justify-between items-center ${reg.menstruando ? 'border-pink-400 bg-pink-50' : 'border-gray-50'}`}>
                <span className="font-bold text-sm flex items-center gap-2"><Droplets size={18} className="text-pink-500"/> Fluxo Menstrual</span>
                <div className={`w-4 h-4 rounded-full ${reg.menstruando ? 'bg-pink-400' : 'bg-gray-200'}`} />
             </button>
             <div className="grid grid-cols-2 gap-2">
                <SintomaBotao label="Cólica" icon={<Thermometer size={14}/>} active={reg.sintomas?.colica} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, colica: !reg.sintomas?.colica } })} color="amber" />
                <SintomaBotao label="Cabeça" icon={<Brain size={14}/>} active={reg.sintomas?.dorDeCabeca} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, dorDeCabeca: !reg.sintomas?.dorDeCabeca } })} color="purple" />
                <SintomaBotao label="Inchaço" icon={<Wind size={14}/>} active={reg.sintomas?.inchaco} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, inchaco: !reg.sintomas?.inchaco } })} color="blue" />
                <SintomaBotao label="Humor" icon={<Smile size={14}/>} active={reg.sintomas?.humorInstavel} onClick={() => onUpdate(dia, { sintomas: { ...reg.sintomas, humorInstavel: !reg.sintomas?.humorInstavel } })} color="green" />
             </div>
             <textarea placeholder="Notas..." value={reg.notas || ""} onChange={(e) => onUpdate(dia, { notas: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl text-xs min-h-[80px] outline-none" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SintomaBotao({ label, icon, active, onClick, color }: SintomaBotaoProps) {
  const colors = {
    amber: active ? "border-amber-400 bg-amber-50 text-amber-700" : "border-gray-100 text-gray-400",
    purple: active ? "border-purple-400 bg-purple-50 text-purple-700" : "border-gray-100 text-gray-400",
    blue: active ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-100 text-gray-400",
    green: active ? "border-green-400 bg-green-50 text-green-700" : "border-gray-100 text-gray-400",
  };
  return (
    <button onClick={onClick} className={`p-3 rounded-xl border-2 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${colors[color]}`}>
      {icon} {label}
    </button>
  );
}