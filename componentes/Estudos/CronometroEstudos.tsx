import { useEffect, useState } from "react";
import { StudySession } from "./index";
import {Pause, StopCircle, Play} from "lucide-react"


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

  return (
    <div className="space-y-4 ">

       <div className="text-center text-pink-500 text-[2em] font-bold">
        {formatar(tempo)}
      </div>
      
      <select
        value={materia}
        onChange={(e) => setMateria(e.target.value)}
        className="border p-2 w-full rounded"
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
            className="bg-pink-400 text-pink-100 px-2 py-1 rounded"
          >
            <Play />
          </button>
        ) : (
          <button
            onClick={() => setRodando(false)}
            className="bg-pink-400 text-pink-100  px-2 py-1 rounded"
          >
            <Pause/>
          </button>
        )}

        <button
          onClick={finalizar}
          className="bg-pink-400 text-pink-100  px-2 py-1 rounded"
        >
          <StopCircle />
        </button>
      </div>
     
      <input
        placeholder="Anotações dos estudos de hoje:"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="border p-2 w-full rounded"
      />

     

     
    </div>
  );
}
