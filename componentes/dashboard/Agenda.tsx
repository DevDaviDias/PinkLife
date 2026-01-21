"use client";

import { useState, useEffect } from "react";
import StatusCard from "@/componentes/ui/StatusCard ";
import { Calendar, Plus, Trash2, X, BellRing } from "lucide-react";
import { getLoggedUser } from "@/componentes/services/APIservices";
import axios from "axios";

interface ItemAgenda {
  id: number;
  cor: string;
  descricao: string;
  horario: string;
  data: string;
}

export default function Agenda() {
  const [lembretes, setLembretes] = useState<ItemAgenda[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaDesc, setNovaDesc] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Carregar lembretes do backend
  useEffect(() => {
    async function fetchAgenda() {
      try {
        const user = await getLoggedUser();
        const agenda = user.progress?.agenda?.tarefas || [];
        setLembretes(agenda);
        localStorage.setItem("agenda_lembretes", JSON.stringify(agenda));
      } catch (err) {
        console.error("Erro ao buscar agenda", err);
        // fallback para localStorage
        const salvos = localStorage.getItem("agenda_lembretes");
        if (salvos) setLembretes(JSON.parse(salvos));
      }
    }
    fetchAgenda();
  }, []);

  // --- Atualiza localStorage e backend quando lembretes mudam
  useEffect(() => {
    localStorage.setItem("agenda_lembretes", JSON.stringify(lembretes));

    async function saveAgenda() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await axios.post(
          `${API_URL}/user/progress`,
          { module: "agenda", data: { tarefas: lembretes } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Erro ao salvar agenda no backend", err);
      }
    }

    saveAgenda();
  }, [lembretes]);

  function adicionarLembrete() {
    if (!novaDesc || !novaData || !novoHorario) return;

    const novoItem: ItemAgenda = {
      id: Date.now(),
      cor: "#FF5FA2",
      descricao: novaDesc,
      data: novaData,
      horario: novoHorario,
    };

    setLembretes((prev) => [novoItem, ...prev]);
    setNovaDesc("");
    setNovaData("");
    setNovoHorario("");
    setIsModalOpen(false);
  }

  function excluirLembrete(id: number) {
    setLembretes((prev) => prev.filter(item => item.id !== id));
  }

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
          {lembretes.length === 0 ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-lg border border-dashed border-gray-300 opacity-60">
                <div className="w-1 h-5 rounded-full bg-gray-300"></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ex: Estudar Química 🧪</p>
                  <p className="text-[10px] text-gray-400">Clique no + para adicionar o seu</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                 <BellRing size={20} className="text-pink-200 animate-bounce mb-1" />
                 <p className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">Deixe seu lembrete aqui</p>
              </div>
            </div>
          ) : (
            lembretes.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-3 bg-pink-300/10 rounded-lg hover:bg-pink-300/20 transition-all border border-pink-100/10">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: item.cor }}></div>
                  <div>
                    <p className="text-sm font-medium text-pink-600 dark:pink-gray-200">{item.descricao}</p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {item.data.split('-').reverse().join('/')} • {item.horario}
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
                  <input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="p-3 bg-pink-50 rounded-xl outline-none text-sm" />
                  <input type="time" value={novoHorario} onChange={(e) => setNovoHorario(e.target.value)} className="p-3 bg-pink-50 rounded-xl outline-none text-sm" />
                </div>
                <button onClick={adicionarLembrete} className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg hover:bg-pink-600 active:scale-95 transition-all">
                  Guardar na Agenda
                </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
