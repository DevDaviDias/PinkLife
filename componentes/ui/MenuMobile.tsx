import {
  BookOpen,
  DollarSign,
  Dumbbell,
  Heart,
  House,
  Utensils,
} from "lucide-react";

type MenuMobileProps = {
  onChangeSessao: (sessao: string) => void;
};

export default function MenuMobile({ onChangeSessao }: MenuMobileProps) {
  return (
    <nav
      className="
        fixed bottom-0 left-0 z-50
        flex justify-around items-center
        h-[5.2em] w-full
        bg-white
        border-t-2 border-pink-400
        shadow-lg
        lg:hidden
      "
    >
      <button
        onClick={() => onChangeSessao("dashboard")}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-pink-500 transition"
        aria-label="Dashboard"
      >
        <House size={22} />
        <span className="text-[0.7em]">Início</span>
      </button>

      <button
        onClick={() => onChangeSessao("estudos")}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-pink-500 transition"
        aria-label="Estudos"
      >
        <BookOpen size={22} />
        <span className="text-[0.7em]">Estudos</span>
      </button>

      <button
        onClick={() => onChangeSessao("treino")}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-pink-500 transition"
        aria-label="Treino"
      >
        <Dumbbell size={22} />
        <span className="text-[0.7em]">Treino</span>
      </button>

      <button
        onClick={() => onChangeSessao("financas")}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-pink-500 transition"
        aria-label="financas"
      >
        <DollarSign size={22} />
        <span className="text-[0.7em]">Finanças</span>
      </button>

      <button
        onClick={() => onChangeSessao("saude")}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-pink-500 transition"
        aria-label="Saúde"
      >
        <Heart size={22} />
        <span className="text-[0.7em]">Saúde</span>
      </button>
    </nav>
  );
}
