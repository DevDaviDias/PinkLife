"use client";

import { useEffect, useState } from "react";
import { Pause, StopCircle, Play, AlertCircle } from "lucide-react";

// Mantemos a interface alinhada com o seu arquivo principal de estudos
interface StudySession {
  id?: string; // Tornamos opcional aqui pois o backend pode gerar
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
      // Dica: Remova o crypto.randomUUID() daqui e deixe o backend (seu index.js) 
      // gerar o ID com crypto.randomUUID() lá, é mais seguro para produção.
      materia,
      comentario,
      duracaoSegundos: tempo,
      data: new Date().toISOString(),
    });

    setTempo(0);
    setComentario("");
    setRodando(false);
    setMateria(""); // Limpa a matéria após finalizar
  }

  function formatar(seg: number) {
    const h = Math.floor(seg / 3600);
    const m = Math.floor((seg % 3600) / 60);
    const s = seg % 60;
    
    // Formatação melhorada: se tiver mais de uma hora, mostra horas também
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const cronometroBloqueado = materia === "";

  return (
    <div className="space-y-3 w-full max-w-sm mx-auto"> 
      {cronometroBloqueado && (
        <div className="flex items-center gap-2 text-xs text-pink-400 justify-center animate-pulse">
          <AlertCircle size={14} />
          <span>Selecione uma matéria para começar</span>
        </div>
      )}

      <div className={`text-center text-[3rem] font-mono font-bold transition-colors ${cronometroBloqueado ? "text-gray-300" : "text-pink-500"}`}>
        {formatar(tempo)}
      </div>
      
      <select
        value={materia}
        onChange={(e) => setMateria(e.target.value)}
        className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-pink-300 outline-none transition-all ${cronometroBloqueado ? "border-pink-200" : "border-pink-500"}`}
      >
        <option value="">Selecione a matéria</option>
        {materias.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="flex justify-center gap-4 py-2">
        {!rodando ? (
          <button
            onClick={() => setRodando(true)}
            disabled={cronometroBloqueado}
            className={`p-5 rounded-full shadow-md transition-all ${
              cronometroBloqueado 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-pink-100 text-pink-500 hover:scale-105 active:scale-95"
            }`}
          >
            <Play size={24} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={() => setRodando(false)}
            className="bg-pink-500 text-white p-5 rounded-full hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 hover:scale-105 active:scale-95"
          >
            <Pause size={24} fill="currentColor" />
          </button>
        )}

        <button
          onClick={finalizar}
          disabled={cronometroBloqueado || tempo === 0}
          className={`p-5 rounded-full shadow-md transition-all ${
            cronometroBloqueado || tempo === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-red-100 text-red-500 hover:bg-red-200 hover:scale-105 active:scale-95"
          }`}
        >
          <StopCircle size={24} fill="currentColor" />
        </button>
      </div>
      
      <input
        placeholder="O que estudamos hoje?"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        disabled={cronometroBloqueado}
        className="border p-3 w-full rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:border-pink-400 outline-none transition-all"
      />
    </div>
  );
}