"use client";

import { useState, useEffect } from "react";
import StatusCard from "@/src/componentes/ui/StatusCard ";
import { Calendar, Plus, Trash2, X, BellRing } from "lucide-react";
import { useUser } from "@/src/context/UserContext"; 
import axios from "axios";

// Interface rigorosamente alinhada ao UserContext e Backend
interface ItemAgenda {
  id: string;
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

  // --- 1. SINCRONIZAR COM O CONTEXTO GLOBAL ---
  useEffect(() => {
    if (user?.progress?.tarefas) {
      // Garantimos que os dados do progresso sejam tratados como ItemAgenda[]
      setLembretes(user.progress.tarefas as unknown as ItemAgenda[]);
    }
  }, [user]);

  // --- 2. ADICIONAR NOVA TAREFA ---
  const adicionarLembrete = async () => {
    if (!novaDesc || !novaData || !novoHorario) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSaving(true);
    try {
      // Usamos a rota específica do app.js que faz o push automático
      await axios.post(
        `${API_URL}/agenda/tarefas`,
        {
          descricao: novaDesc,
          data: novaData,
          horario: novoHorario,
          concluida: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refreshUser() chama a rota /user/me que você criou e atualiza o estado global
      await refreshUser(); 
      
      // Reset de campos e fechar modal
      setNovaDesc("");
      setNovaData("");
      setNovoHorario("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. EXCLUIR TAREFA ---
  const excluirLembrete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Filtramos a lista localmente para enviar a versão atualizada
    const novaLista = lembretes.filter(item => item.id !== id);

    try {
      // Usamos a rota genérica PUT do seu app.js para sobrescrever o módulo 'tarefas'
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
            <div className="flex justify-center py-10">
               <div className="w-6 h-6 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
          ) : lembretes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
               <BellRing size={24} className="text-pink-200 mb-2" />
               <p className="text-[11px] text-pink-300 font-bold uppercase">Nada agendado</p>
            </div>
          ) : (
            lembretes.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-3 bg-pink-300/10 rounded-lg hover:bg-pink-300/20 transition-all border border-pink-100/10">
                <div className="flex items-center gap-3">
                  {/* Visual dinâmico baseado no status 'concluida' */}
                  <div className={`w-1 h-5 rounded-full ${item.concluida ? 'bg-gray-300' : 'bg-pink-400'}`}></div>
                  <div>
                    <p className={`text-sm font-medium ${item.concluida ? 'text-gray-400 line-through' : 'text-pink-600'}`}>
                      {item.descricao}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {item.data?.split('-').reverse().join('/')} • {item.horario}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => excluirLembrete(item.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </StatusCard>

      {/* MODAL PARA NOVA TAREFA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
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
                  <input 
                    type="date" 
                    value={novaData} 
                    onChange={(e) => setNovaData(e.target.value)} 
                    className="p-3 bg-pink-50 rounded-xl outline-none text-sm text-gray-700" 
                  />
                  <input 
                    type="time" 
                    value={novoHorario} 
                    onChange={(e) => setNovoHorario(e.target.value)} 
                    className="p-3 bg-pink-50 rounded-xl outline-none text-sm text-gray-700" 
                  />
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