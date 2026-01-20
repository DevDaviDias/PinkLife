"use client";

import { useState, useEffect } from "react";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import StatusCard from "../ui/StatusCard ";
import GrayMenu from "../ui/GrayMenu";
import { Target, Dumbbell, FireExtinguisherIcon, Plus, Trash2, CheckCircle, Clock, Dumbbell as Muscle, X } from "lucide-react";

interface Treino {
  id: string;
  nome: string;
  categoria: string;
  duracao: string;
  exercicios: string[];
}

const TREINOS_PADRAO: Treino[] = [
  {
    id: "template-1",
    nome: "Treino de Pernas 🦵",
    categoria: "Musculação",
    duracao: "60 min",
    exercicios: ["Agachamento", "Leg Press", "Cadeira Extensora", "Cadeira Flexora", "Panturrilha"]
  },
  {
    id: "template-2",
    nome: "Cardio Matinal 🏃‍♀️",
    categoria: "Cardio",
    duracao: "30 min",
    exercicios: ["Corrida", "Bicicleta", "Elíptico"]
  }
];

export default function Treino() {
  const [active, setActive] = useState("Hoje");
  const [fichas, setFichas] = useState<Treino[]>([]);
  const [novoNomeTreino, setNovoNomeTreino] = useState("");
  const [novoExercicio, setNovoExercicio] = useState("");
  const [listaTempExercicio, setListaTempExercicio] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("fichas_treino");
    if (saved && JSON.parse(saved).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFichas(JSON.parse(saved));
    } else {
      setFichas(TREINOS_PADRAO);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fichas_treino", JSON.stringify(fichas));
  }, [fichas]);

  const adicionarExercicioParaLista = () => {
    if (!novoExercicio.trim()) return;
    setListaTempExercicio([...listaTempExercicio, novoExercicio]);
    setNovoExercicio("");
  };

  const salvarNovoTreino = () => {
    if (!novoNomeTreino || listaTempExercicio.length === 0) {
      alert("Dê um nome ao treino e adicione pelo menos um exercício! ✨");
      return;
    }
    const novaFicha: Treino = {
      id: Date.now().toString(),
      nome: novoNomeTreino,
      categoria: "Musculação",
      duracao: "45 min",
      exercicios: listaTempExercicio
    };
    setFichas([novaFicha, ...fichas]);
    setNovoNomeTreino("");
    setListaTempExercicio([]);
    setActive("MeusTreinos");
  };

  return (
    <ContainerPages>
      <Cabecalho title="Treino 💪" imageSrc="/images/hello-kitty-fitness.jpg">
        <p>Acompanhe seu progresso e queime calorias ✨</p>
      </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
        <Cardprogresso title="Fichas" progressoDodia="ativas" porcentagem={fichas.length} icon={<Dumbbell size={15} />} />
        <Cardprogresso title="Hoje" progressoDodia="status" porcentagem="Pendente" icon={<Target size={15} />} />
        <Cardprogresso title="Sequência" progressoDodia="dias" porcentagem="12" icon={<FireExtinguisherIcon size={15} />} />
        <Cardprogresso title="Kcal" progressoDodia="estimadas" porcentagem="320" icon={<Clock size={15} />} />
      </div>

      <div className="mt-6">
        <GrayMenu items={[
          { title: "Hoje", onClick: () => setActive("Hoje"), active: active === "Hoje" },
          { title: "Meus Treinos", onClick: () => setActive("MeusTreinos"), active: active === "MeusTreinos" },
          { title: "Criar Treino", onClick: () => setActive("CriarTreinos"), active: active === "CriarTreinos" },
        ]} />
      </div>

      <div className="mt-6">
        {active === "Hoje" && (
          <div className="space-y-4">
            <h2 className="text-pink-500 font-bold flex items-center gap-2 px-1"><Clock size={18} /> Treinos de Hoje</h2>
            <div className="grid gap-4">
              {fichas.map((treino) => (
                <div key={treino.id} className="bg-white border-2 border-pink-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{treino.nome}</h3>
                      <p className="text-xs text-pink-400 font-medium">{treino.categoria} • {treino.duracao}</p>
                    </div>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-pink-100">Concluir</button>
                  </div>
                  <div className="bg-pink-50/50 rounded-xl p-3 flex flex-wrap gap-x-4 gap-y-1">
                    {treino.exercicios.map((ex, i) => (
                      <span key={i} className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-pink-400 rounded-full"></span> {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "MeusTreinos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fichas.map((treino) => (
              <div key={treino.id} className="bg-white p-5 rounded-2xl border-2 border-pink-100 relative group">
                <button onClick={() => setFichas(fichas.filter(f => f.id !== treino.id))} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-pink-100 text-pink-500 rounded-xl"><Muscle size={24} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{treino.nome}</h3>
                    <p className="text-xs text-gray-400">{treino.duracao}utos totais</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {treino.exercicios.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg"><CheckCircle size={14} className="text-pink-300" />{ex}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "CriarTreinos" && (
          <StatusCard title="Novo Treino Customizado" icon={<Plus size={20} />}>
            <div className="space-y-5">
              <input placeholder="Ex: Treino de Braços" value={novoNomeTreino} onChange={(e) => setNovoNomeTreino(e.target.value)} className="w-full p-3 bg-pink-50/50 border-2 border-pink-100 rounded-xl outline-none focus:border-pink-400" />
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="flex gap-2">
                  <input placeholder="Nome do exercício" value={novoExercicio} onChange={(e) => setNovoExercicio(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && adicionarExercicioParaLista()} className="flex-1 p-2 rounded-lg border border-gray-200 outline-none" />
                  <button onClick={adicionarExercicioParaLista} className="bg-pink-500 text-white p-2 rounded-lg"><Plus size={20} /></button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {listaTempExercicio.map((ex, index) => (
                    <span key={index} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-pink-200 text-sm text-pink-600 font-medium">
                      {ex} <X size={14} className="cursor-pointer" onClick={() => setListaTempExercicio(listaTempExercicio.filter((_, i) => i !== index))} />
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={salvarNovoTreino} className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-100">Criar Treino Agora 💪</button>
            </div>
          </StatusCard>
        )}
      </div>
    </ContainerPages>
  );
}