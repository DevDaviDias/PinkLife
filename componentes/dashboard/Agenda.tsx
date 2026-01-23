"use client";

import { useState, useEffect } from "react";
import StatusCard from "@/componentes/ui/StatusCard ";
import { Calendar, Plus, Trash2, X, BellRing } from "lucide-react";
import { useUser } from "@/componentes/context/UserContext"; // Importando seu contexto
import axios from "axios";

// Interface alinhada com o que o Backend espera e o Contexto define
interface ItemAgenda {
  id: string | number;
  descricao: string;
  horario: string;
  data: string;
  concluida: boolean;
}

export default function Agenda() {
  const { user, refreshUser, loading: contextLoading } = useUser();
  const [lembretes, setLembretes] = useState<ItemAgenda[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaDesc, setNovaDesc] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // --- 1. SINCRONIZAR ESTADO LOCAL COM O CONTEXTO ---
  useEffect(() => {
    if (user?.progress?.tarefas) {
      // Convertemos o tipo do backend para o tipo ItemAgenda que o componente usa
      const tarefasFormatadas = (user.progress.tarefas as unknown as ItemAgenda[]);
      setLembretes(tarefasFormatadas);
    }
  }, [user]);

  // --- 2. FUNÇÃO PARA SALVAR NO BACKEND ---
  const adicionarLembrete = async () => {
    if (!novaDesc || !novaData || !novoHorario) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSaving(true);
    try {
      // Enviamos para a rota que você criou no index.js
      await axios.post(
        `${API_URL}/agenda/tarefas`,
        {
          descricao: novaDesc, // Nome do campo deve bater com o que você usa no JSX
          data: novaData,
          horario: novoHorario,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o contexto global (isso fará o useEffect ali de cima rodar)
      await refreshUser();
      
      // Limpa o formulário
      setNovaDesc("");
      setNovaData("");
      setNovoHorario("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err);
      alert("Erro ao salvar. Verifique a conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. EXCLUIR (Usando a rota genérica que você criou!) ---
  const excluirLembrete = async (id: string | number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const novaLista = lembretes.filter(item => item.id !== id);
      
      // Aqui usamos sua rota genérica /progress/:modulo que é ótima para deletar itens de listas
      await axios.put(
        `${API_URL}/progress/tarefas`,
        novaLista,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshUser();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  return (
    <>
      <StatusCard 
        title="Sua agenda" 
        icon={<Calendar size={20}/>} 
        headerAction={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-1 hover:bg-pink-100 rounded-full text-pink-500 transition-colors"
          >
            <Plus size={24} />
          </button>
        }
      >
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
          {contextLoading ? (
            <p className="text-center text-xs text-gray-400 animate-pulse">Carregando...</p>
          ) : lembretes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
               <BellRing size={24} className="text-pink-200 mb-2" />
               <p className="text-[11px] text-pink-300 font-bold uppercase">Nada agendado</p>
            </div>
          ) : (
            lembretes.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-3 bg-pink-300/10 rounded-lg hover:bg-pink-300/20 transition-all border border-pink-100/10">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full bg-pink-400"></div>
                  <div>
                    <p className="text-sm font-medium text-pink-600">{item.descricao}</p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {item.data?.split('-').reverse().join('/')} • {item.horario}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => excluirLembrete(item.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </StatusCard>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-pink-500">Novo Lembrete 🎀</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="O que vais fazer?"
                  value={novaDesc}
                  onChange={(e) => setNovaDesc(e.target.value)}
                  className="w-full p-3 bg-pink-50 rounded-xl outline-none border border-transparent focus:border-pink-300"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="p-3 bg-pink-50 rounded-xl outline-none text-sm text-gray-700" />
                  <input type="time" value={novoHorario} onChange={(e) => setNovoHorario(e.target.value)} className="p-3 bg-pink-50 rounded-xl outline-none text-sm text-gray-700" />
                </div>
                <button 
                  disabled={isSaving}
                  onClick={adicionarLembrete} 
                  className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? "Guardando..." : "Guardar na Agenda"}
                </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}