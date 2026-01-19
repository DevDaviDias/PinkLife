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
  Settings,
} from "lucide-react";
import { useState } from "react";

type MenuMobileProps = {
  onChangeSessao: (sessao: string) => void;
};

export default function MenuMobile({ onChangeSessao }: MenuMobileProps) {
  const [activeSessao, setActiveSessao] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Início", icon: House },
    { id: "estudos", label: "Estudos", icon: BookOpen },
    { id: "treino", label: "Treino", icon: Dumbbell },
    { id: "habitos", label: "Hábitos", icon: ClipboardList },
    { id: "financas", label: "Finanças", icon: DollarSign },
    { id: "beleza", label: "Beleza", icon: Sparkles },
    { id: "viagens", label: "Viagens", icon: Plane },
    { id: "casa", label: "CasaERotina", icon: House },
    { id: "saude", label: "Saúde", icon: Heart },
    { id: "alimentacao", label: "Alimentação", icon: Utensils },
    { id: "Configuracao", label: "Configuracao", icon: Settings},
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
            onClick={() => {
              setActiveSessao(id);
              onChangeSessao(id);
            }}
            className={`flex flex-col mt-[1em] items-center justify-center gap-1 px-4 transition
              ${
                activeSessao === id
                  ? "text-pink-500 font-semibold"
                  : "text-gray-700 hover:text-pink-500"
              }`}
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
