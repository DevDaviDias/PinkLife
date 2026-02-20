"use client";

import { useEffect, useState } from "react";
import StatusCard from "@/src/componentes/ui/StatusCard ";
import { Star } from "lucide-react";
import { useUser } from "@/src/context/UserContext";

// --- 1. Interfaces Estritas para evitar erros de 'any' ---
interface Materia {
  metaHoras: number;
  horasEstudadas: number;
}

interface Transacao {
  valor: number;
  tipo: "receita" | "despesa" | "Receita" | "Despesa";
}

interface StatusMessages {
  treino: string;
  estudo: string;
  financas: string;
}

export default function Conquistas() {
  const { user } = useUser();

  // Definindo o estado com o tipo estrito da interface StatusMessages
  const [statusText, setStatusText] = useState<StatusMessages>({
    treino: "Carregando...",
    estudo: "Carregando...",
    financas: "Carregando..."
  });

  useEffect(() => {
    // Se o usuário ou o progresso não existirem ainda, não faz nada
    if (!user?.progress) return;

    const { progress } = user;

    // --- Lógica para Treino ---
    const treinos = progress.treinos || [];
    const treinoMsg = treinos.length > 0 
      ? "Fichas de exercícios ativas!" 
      : "Crie sua primeira ficha";

    // --- Lógica para Estudos ---
    const materias = (progress.materias as Materia[]) || [];
    const tHoras = materias.reduce((acc, m) => acc + (Number(m.horasEstudadas) || 0), 0);
    const tMeta = materias.reduce((acc, m) => acc + (Number(m.metaHoras) || 0), 0);
    
    const estudoMsg = (tMeta > 0 && tHoras >= tMeta) 
      ? "Meta de estudos atingida 🏆" 
      : "Complete suas horas de estudo";

    // --- Lógica para Finanças ---
    const financas = (progress.financas as Transacao[]) || [];
    const saldo = financas.reduce((acc, t) => {
      const valor = Number(t.valor) || 0;
      // Normalizamos para minúsculo para evitar erro de comparação
      const tipoNormalizado = t.tipo?.toLowerCase();
      return tipoNormalizado === "receita" ? acc + valor : acc - valor;
    }, 0);
    
    const financasMsg = (financas.length > 0) 
      ? (saldo >= 0 ? "Orçamento sob controle" : "Atenção ao saldo negativo") 
      : "Registre suas finanças";

    // Atualizando o estado com as mensagens processadas
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatusText({
      treino: treinoMsg,
      estudo: estudoMsg,
      financas: financasMsg
    });

  }, [user]); // Re-executa sempre que os dados do usuário mudarem no contexto

  // Definição das cores e estilos dos cards
  const conquistas = [
    {
      cor: "#95F695",
      descricao: statusText.treino,
      corLetras: "#1a471a"
    },
    {
      cor: "#FFA0BD",
      descricao: statusText.estudo,
      corLetras: "white"
    },
    {
      cor: "#F9E5A4",
      descricao: statusText.financas,
      corLetras: "#4d3d00"
    },
  ];

  return (
    <StatusCard title="Conquistas da Semana" icon={<Star size={20} />}>
      <div className="flex flex-col gap-2">
        {conquistas.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-xl w-full transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: item.cor, color: item.corLetras }}
          >
            <Star size={20} fill="currentColor" />
            <div className="flex-1">
              <p className="font-bold text-sm md:text-base leading-tight">
                {item.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </StatusCard>
  );
}