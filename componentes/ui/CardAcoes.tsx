import { BadgeCheck, Calendar, Heart, Icon, TrendingUp } from "lucide-react";
import { actionAsyncStorage } from "next/dist/server/app-render/action-async-storage.external";

const Acoes = [
  {
    Icon: BadgeCheck,
    title: "Marcar TarefaS",
  },

  {
    Icon: TrendingUp,
    title: "Registrar tudo",
  },
  {
    Icon: Heart,
    title: "Registrar treino",
  },
  {
    Icon: Calendar,
    title: "Ver agenda ",
  },
];

type PropsProgresso = {
  title: string;
  progressoDodia?: string;
};

export default function CardAcoes({ title, progressoDodia }: PropsProgresso) {
  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md w-[89em] border-2  border-pink-200 h-36 mt-8">
        <h2 className="text-pink-400 text-lg font-bold">{title}</h2>
        <div className="flex gap-4">
          {Acoes.map((acao, index) => (
            <div
              key={index}
              className="flex mt-4 flex-col items-center justify-center bg-pink-400 hover:bg-pink-300 text-pink-100 hover:text-white rounded-lg  w-[28em] h-15 cursor-pointer transition text-["
            >
              <acao.Icon size={20} />
              <p className="mt-2 text-center text-[0.7em]">{acao.title}</p>
            </div>
          ))} 
        </div>
      </div>
    </>
  );
}
