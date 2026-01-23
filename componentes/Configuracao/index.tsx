"use client";

import { Moon, Bell, Trash2, ShieldAlert, LogOut } from "lucide-react";
import { useState } from "react";
import ContainerPages from "@/componentes/ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import StatusCard from "../ui/StatusCard "; // Verifique se o arquivo tem esse espaço no final "StatusCard .tsx"
import { useRouter } from "next/navigation";

export default function Configuracoes() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const router = useRouter();

  // 1. Função de Logout (Nova)
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/login"); // Certifique-se de que sua rota de login é esta
  }

  // 2. Função para Resetar (Ajustada para o Banco de Dados)
  function resetarSistema() {
    const confirmar = confirm(
      "⚠️ ATENÇÃO: Isso apagará os dados locais. Para apagar os dados do servidor, use as telas específicas. Deseja continuar?"
    );

    if (confirmar) {
      localStorage.clear();
      alert("Cache limpo. A página será recarregada.");
      window.location.reload();
    }
  }

  return (
    <ContainerPages>
      <Cabecalho 
        title="Configurações ⚙️" 
        imageSrc="/images/hello-kitty-dashboard.jpg"
      >
        <p>Personalize sua experiência e gerencie sua conta</p>
      </Cabecalho>

      <div className="mt-6 space-y-4">
        {/* Preferências */}
        <StatusCard title="Preferências de Interface">
          <div className="space-y-6 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Tema Escuro</p>
                  <p className="text-xs text-gray-400">Em breve</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>
        </StatusCard>

        {/* Gerenciamento da Conta */}
        <StatusCard title="Conta e Dados">
          <div className="p-2 space-y-4">
            {/* Logout */}
            <div className="flex items-center justify-between border-b pb-4 border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <LogOut size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Sair da Conta</p>
                  <p className="text-xs text-gray-400">Desconectar deste dispositivo</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Zona de Perigo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Resetar Cache</p>
                  <p className="text-xs text-gray-400">Limpa dados salvos no navegador</p>
                </div>
              </div>
              <button 
                onClick={resetarSistema}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium"
              >
                <Trash2 size={18} />
                Limpar Cache
              </button>
            </div>
          </div>
        </StatusCard>
      </div>
    </ContainerPages>
  );
}