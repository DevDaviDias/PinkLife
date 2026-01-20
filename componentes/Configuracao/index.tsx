"use client";

import { Moon, Bell, Trash2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import ContainerPages from "@/componentes/ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import StatusCard from "../ui/StatusCard ";

export default function Configuracoes() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);

  // Função para limpar tudo do LocalStorage
  function resetarSistema() {
    const confirmar = confirm(
      "⚠️ ATENÇÃO: Isso apagará todas as suas matérias, histórico e hábitos. Deseja continuar?"
    );

    if (confirmar) {
      localStorage.clear(); // Apaga tudo
      alert("Todos os dados foram removidos. A página será recarregada.");
      window.location.reload(); // Recarrega para limpar os estados da tela
    }
  }

  return (
    <ContainerPages>
      <Cabecalho 
        title="Configurações ⚙️" 
        imageSrc="/images/hello-kitty-dashboard.jpg" // Use a mesma imagem padrão ou uma de engrenagens
      >
        <p>Personalize sua experiência e gerencie seus dados</p>
      </Cabecalho>

      <div className="mt-6 space-y-4">
        <StatusCard title="Preferências de Interface">
          <div className="space-y-6 p-2">
            
            {/* Tema Escuro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Tema Escuro</p>
                  <p className="text-xs text-gray-400">Ativar modo noturno (Em breve)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            {/* Notificações */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Notificações</p>
                  <p className="text-xs text-gray-400">Alertas de metas de estudo</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificacoes}
                  onChange={() => setNotificacoes(!notificacoes)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

          </div>
        </StatusCard>

        <StatusCard title="Zona de Perigo">
          <div className="p-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Resetar Todo o Aplicativo</p>
                  <p className="text-xs text-gray-400">Apaga permanentemente matérias, histórico e progresso.</p>
                </div>
              </div>
              
              <button 
                onClick={resetarSistema}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium"
              >
                <Trash2 size={18} />
                Limpar Todos os Dados
              </button>
            </div>
          </div>
        </StatusCard>
      </div>
    </ContainerPages>
  );
}