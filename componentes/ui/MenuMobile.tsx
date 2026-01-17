import {
  BookOpen,
  DollarSign,
  Dumbbell,
  Heart,
  House,
  Utensils,
  Sparkles,
  Plane,
  ClipboardList,
} from "lucide-react";

type MenuMobileProps = {
  onChangeSessao: (sessao: string) => void;
};

export default function MenuMobile({ onChangeSessao }: MenuMobileProps) {
  const menuItems = [
    { id: "dashboard", label: "Início", icon: House },
    { id: "estudos", label: "Estudos", icon: BookOpen },
    { id: "treino", label: "Treino", icon: Dumbbell },
    { id: "habitos", label: "Hábitos", icon: ClipboardList },
    { id: "financas", label: "Finanças", icon: DollarSign },
    { id: "beleza", label: "Beleza", icon: Sparkles },
    { id: "viagens", label: "Viagens", icon: Plane },
    { id: "casa", label: "Casa & Rotina", icon: House },
    { id: "saude", label: "Saúde", icon: Heart },
    { id: "alimentacao", label: "Alimentação", icon: Utensils },
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-0 z-50
        h-[5.2em] w-full
        bg-white
        border-t-2 border-pink-400
        shadow-lg
        lg:hidden
        overflow-x-auto
        whitespace-nowrap
      "
    >
      <div className="flex">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChangeSessao(id)}
            className="flex flex-col items-center justify-center gap-1 px-4 text-gray-700 hover:text-pink-500 transition"
            aria-label={label}
          >
            <Icon size={22} />
            <span className="text-[0.7em]">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
