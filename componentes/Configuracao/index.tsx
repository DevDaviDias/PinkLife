import { Moon, Bell, User, Trash, Settings } from "lucide-react";
import { useState } from "react";
import ContainerPages from "@/componentes/ui/ContainerPages"

export default function Configuracoes() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);

  return (
    <ContainerPages>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Configurações ⚙️</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Moon size={18} /> Tema Escuro
          </span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell size={18} /> Notificações
          </span>
          <input
            type="checkbox"
            checked={notificacoes}
            onChange={() => setNotificacoes(!notificacoes)}
          />
        </div>

        <button className="flex items-center gap-2 text-red-500 hover:text-red-700">
          <Trash size={18} /> Limpar dados
        </button>
      </div>
    </div>
    </ContainerPages>
  );
}
