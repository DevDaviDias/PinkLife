"use client";

import { useEffect, useState } from "react";
import { Pause, StopCircle, Play, AlertCircle } from "lucide-react";

// Definimos a interface aqui para evitar erros de importação circular
interface StudySession {
  id: string; // Alterado para string para bater com o backend
  materia: string;
  comentario: string;
  duracaoSegundos: number;
  data: string;
}

interface Props {
  materias?: string[];
  onFinalizar: (sessao: StudySession) => void;
}

export default function CronometroEstudos({
  materias = [],
  onFinalizar,
}: Props) {
  const [materia, setMateria] = useState("");
  const [comentario, setComentario] = useState("");
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    let intervalo: number | undefined;

    if (rodando) {
      intervalo = window.setInterval(() => {
        setTempo((t) => t + 1);
      }, 1000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [rodando]);

  function finalizar() {
    if (!materia || tempo === 0) return;

    // Criamos o objeto exatamente como o backend espera
    onFinalizar({
      id: crypto.randomUUID(), // Usando UUID para ser consistente
      materia,
      comentario,
      duracaoSegundos: tempo,
      data: new Date().toISOString(), // ISOString é melhor para salvar em bancos
    });

    setTempo(0);
    setComentario("");
    setRodando(false);
  }

  function formatar(seg: number) {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const cronometroBloqueado = materia === "";

  return (
    <div className="space-y-3"> {/* Ajustei o espaçamento */}
      {cronometroBloqueado && (
        <div className="flex items-center gap-2 text-xs text-pink-400 justify-center animate-pulse">
          <AlertCircle size={14} />
          <span>Selecione uma matéria para começar</span>
        </div>
      )}

      <div className={`text-center text-[2.5em] font-bold transition-colors ${cronometroBloqueado ? "text-gray-300" : "text-pink-500"}`}>
        {formatar(tempo)}
      </div>
      
      <select
        value={materia}
        onChange={(e) => setMateria(e.target.value)}
        className={`border p-2 w-full rounded focus:ring-2 focus:ring-pink-300 outline-none transition-all ${cronometroBloqueado ? "border-pink-200" : "border-pink-500"}`}
      >
        <option value="">Selecione a matéria</option>
        {materias.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="flex justify-center gap-4">
        {!rodando ? (
          <button
            onClick={() => setRodando(true)}
            disabled={cronometroBloqueado}
            className={`p-4 rounded-full transition-all ${
              cronometroBloqueado 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-pink-100 text-pink-500 hover:bg-pink-200"
            }`}
          >
            <Play size={28} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={() => setRodando(false)}
            className="bg-pink-500 text-white p-4 rounded-full hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
          >
            <Pause size={28} fill="currentColor" />
          </button>
        )}

        <button
          onClick={finalizar}
          disabled={cronometroBloqueado || tempo === 0}
          className={`p-4 rounded-full transition-all ${
            cronometroBloqueado || tempo === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-red-100 text-red-500 hover:bg-red-200"
          }`}
        >
          <StopCircle size={28} fill="currentColor" />
        </button>
      </div>
      
      <input
        placeholder="O que estudamos hoje?"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        disabled={cronometroBloqueado}
        className="border p-3 w-full rounded disabled:bg-gray-50 disabled:cursor-not-allowed focus:border-pink-400 outline-none transition-all"
      />
    </div>
  );
}