"use client";

import { useEffect, useState } from "react";
import { StudySession } from "./index";
import { Pause, StopCircle, Play, AlertCircle } from "lucide-react"; // Adicionei AlertCircle para um aviso

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

    onFinalizar({
      id: Date.now(),
      materia,
      comentario,
      duracaoSegundos: tempo,
      data: new Date().toLocaleString(),
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

  // Verifica se o cronômetro está bloqueado
  const cronometroBloqueado = materia === "";

  return (
    <div className="space-y-2">
      {/* Aviso caso não tenha matéria selecionada */}
      {cronometroBloqueado && (
        <div className="flex items-center gap-2 text-xs text-pink-400 justify-center animate-pulse">
          <AlertCircle size={14} />
          <span>Selecione uma matéria para começar</span>
        </div>
      )}

      <div className={`text-center text-[2em] font-bold transition-colors ${cronometroBloqueado ? "text-gray-300" : "text-pink-500"}`}>
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

      <div className="flex justify-center gap-2">
        {!rodando ? (
          <button
            onClick={() => setRodando(true)}
            disabled={cronometroBloqueado} // BOTÃO DESATIVADO
            className={`px-4 py-2 rounded transition-all ${
              cronometroBloqueado 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-pink-400 text-pink-100 hover:bg-pink-500"
            }`}
          >
            <Play size={24} />
          </button>
        ) : (
          <button
            onClick={() => setRodando(false)}
            className="bg-pink-400 text-pink-100 px-4 py-2 rounded hover:bg-pink-500 transition-all"
          >
            <Pause size={24} />
          </button>
        )}

        <button
          onClick={finalizar}
          disabled={cronometroBloqueado || tempo === 0} // SÓ PARA SE TIVER TEMPO
          className={`px-4 py-2 rounded transition-all ${
            cronometroBloqueado || tempo === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-pink-400 text-pink-100 hover:bg-pink-500"
          }`}
        >
          <StopCircle size={24} />
        </button>
      </div>
      
      <input
        placeholder="O que estudamos hoje:"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        disabled={cronometroBloqueado} // IMPEDE COMENTÁRIO SE NÃO TIVER MATÉRIA
        className="border p-2 pb-6 w-full rounded disabled:bg-gray-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}