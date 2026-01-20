import {
  BookOpen,
  DollarSign,
  Dumbbell,
  Heart,
  House,
  Sparkles,
  Settings,
} from "lucide-react";
import { useState } from "react";

type MenuMobileProps = {
  onChangeSessao: (sessao: string) => void;
};

export default function MenuMobile({ onChangeSessao }: MenuMobileProps) {
  const [activeSessao, setActiveSessao] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: House },
    { id: "estudos", icon: BookOpen },
    { id: "treino", icon: Dumbbell },
    { id: "financas",  icon: DollarSign },
    { id: "saude", icon: Heart },
    { id: "beleza", icon: Sparkles  },
    
    
   
    { id: "Configuracao",  icon: Settings},
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
        {menuItems.map(({ id,  icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveSessao(id);
              onChangeSessao(id);
            }}
            className={`flex flex-col mt-[1em] items-center justify-center gap-1 px-6 transition
              ${
                activeSessao === id
                  ? "text-pink-500 font-semibold"
                  : "text-gray-700 hover:text-pink-500"
              }`}
            
          >
            <Icon size={25} />
            
          </button>
        ))}
      </div>
    </nav>
  );
}
