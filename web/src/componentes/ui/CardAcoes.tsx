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
      <div className="bg-white  rounded-lg shadow-md w-full border-2  border-pink-200 h-40 mt-6 hover:shadow-lg transition hover:border-pink-300 hover:scale-[1.0] hover:duration-300 hover:ease-in-out hover:z-10 hover:cursor-pointer hover:-translate-y-1 md:p-4" >
        <h2 className="text-pink-400 text-[1.4em] font-bold">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {Acoes.map((acao, index) => (
            <div
              key={index}
              className="flex mt-2 flex-col items-center justify-center bg-pink-500 hover:bg-pink-300 text-pink-100 hover:text-white rounded-lg  w-full h-10 cursor-pointer transition md:mt-4 md:h-14"
            >
              <acao.Icon size={20} />
              <p className="mt-2 text-center text-[0.9em]">{acao.title}</p>
            </div>
          ))} 
        </div>
      </div>
    </>
  );
}
