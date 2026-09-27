import {
  BookOpen,
  DollarSign,
  Dumbbell,
  Heart,
  House,
  Sparkles,
  Settings,
  BookAIcon,
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
    { id: "financas", label: "Finanças", icon: DollarSign },
    { id: "saude", label: "Saúde", icon: Heart },
    { id: "beleza", label: "Beleza", icon: Sparkles },
    { id: "diario", label: "Diário", icon: BookAIcon },
    { id: "Configuracao", label: "Config", icon: Settings },
  ];

  return (
    <nav
      className="
        fixed bottom-4 left-4 right-4 z-50
        rounded-[2rem] border border-pink-100 bg-white
        shadow-lg shadow-pink-200/60
        lg:hidden
      "
    >
      <div className="flex overflow-x-auto whitespace-nowrap px-2 py-2">
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSessao === id;
          return (
            <button
              key={id}
              onClick={() => {
                setActiveSessao(id);
                onChangeSessao(id);
              }}
              className="flex shrink-0 flex-col items-center justify-center gap-1 px-3.5 py-1 transition"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  isActive
                    ? "bg-pink-500 shadow-md shadow-pink-300"
                    : "bg-fuchsia-50"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-purple-400"} />
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "font-bold text-pink-500" : "text-purple-400"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
