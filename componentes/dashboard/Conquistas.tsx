"use client";

import { useEffect, useState } from "react";
import StatusCard from "../ui/StatusCard ";
import { Star } from "lucide-react";

// --- Definição das Interfaces para tirar o erro de 'any' ---
interface Materia {
  metaHoras: number;
  horasEstudadas: number;
}

interface Transacao {
  valor: number;
  tipo: "Receita" | "Despesa";
}

interface Treino {
  id: string;
}

export default function Conquistas() {
  const [statusText, setStatusText] = useState({
    treino: "Carregando...",
    estudo: "Carregando...",
    financas: "Carregando..."
  });

  useEffect(() => {
    const verificar = () => {
      // 1. Lógica para Treino
      const sTreinos = localStorage.getItem("fichas_treino_v2");
      const treinos: Treino[] = sTreinos ? JSON.parse(sTreinos) : [];
      const treinoMsg = treinos.length > 0 ? "Fichas de exercícios ativas!" : "Crie sua primeira ficha";

      // 2. Lógica para Estudos
      const sMaterias = localStorage.getItem("materias");
      const materias: Materia[] = sMaterias ? JSON.parse(sMaterias) : [];
      const tHoras = materias.reduce((acc, m) => acc + (m.horasEstudadas || 0), 0);
      const tMeta = materias.reduce((acc, m) => acc + (m.metaHoras || 0), 0);
      const estudoMsg = (tMeta > 0 && tHoras >= tMeta) ? "Meta de estudos atingida" : "Complete suas horas de estudo";

      // 3. Lógica para Finanças
      const mesAno = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
      const sFinancas = localStorage.getItem(`financas_${mesAno}`);
      const financas: Transacao[] = sFinancas ? JSON.parse(sFinancas) : [];
      const saldo = financas.reduce((acc, t) => t.tipo === "Receita" ? acc + t.valor : acc - t.valor, 0);
      const financasMsg = (saldo >= 0 && financas.length > 0) ? "Orçamento mensal controlado" : "Mantenha o saldo positivo";

      setStatusText({
        treino: treinoMsg,
        estudo: estudoMsg,
        financas: financasMsg
      });
    };

    verificar();
    window.addEventListener("storage", verificar);
    return () => window.removeEventListener("storage", verificar);
  }, []);

  // SEU ARRAY ORIGINAL DE CORES E ESTILO
  const conquistas = [
    {
      cor: "#95F695",
      descricao: statusText.treino,
      corLetras: "white"
    },
    {
      cor: "#FFA0BD",
      descricao: statusText.estudo,
      corLetras: "white"
    },
    {
      cor: "#F9E5A4",
      descricao: statusText.financas,
      corLetras: "black"
    },
  ];

  return (
    <StatusCard title="Conquistas da Semana" icon={<Star size={20} />}>
      <div>
        {conquistas.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 mb-2 h-[3.4em] p-[0.5em] rounded-lg w-full"
            style={{ backgroundColor: item.cor, color: item.corLetras }}
          >
            <div className="h-4 rounded-full md:h-7"></div>
            <Star size={20} />
            <div className="text-[0.9em] md:text-[1em]">
              <p className="font-semibold">{item.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </StatusCard>
  );
}