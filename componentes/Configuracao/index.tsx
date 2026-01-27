"use client";

import { Moon, Bell, Trash2, ShieldAlert, LogOut, User, Lock, Mail, Globe, Palette, Zap } from "lucide-react";
import { useState } from "react";
import ContainerPages from "@/componentes/ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import SettingsCard from "../ui/SettingsCard";
import { useRouter } from "next/navigation";
import TestApi from "@/componentes/testapi/testApi";

export default function Configuracoes() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const router = useRouter();

  // Logout function
  function handleLogout() {
    const confirmar = confirm("Tem certeza que deseja sair da sua conta?");
    if (confirmar) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      router.push("/login");
    }
  }

  // Reset cache function
  function resetarSistema() {
    const confirmar = confirm(
      "⚠️ ATENÇÃO: Isso apagará os dados locais do navegador. Para apagar dados do servidor, use as telas específicas. Deseja continuar?"
    );

    if (confirmar) {
      localStorage.clear();
      alert("✅ Cache limpo com sucesso! A página será recarregada.");
      window.location.reload();
    }
  }

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-rose-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:after:translate-x-full"></div>
    </label>
  );

  return (
    <ContainerPages>
      <Cabecalho 
        title="Configurações ⚙️" 
        imageSrc="/images/hello-kitty-dashboard.jpg"
      >
        <p className="text-gray-600">Personalize sua experiência e gerencie sua conta</p>
      </Cabecalho>

      <div className="mt-8 space-y-6">
        
        {/* Profile Section */}
        <SettingsCard title="👤 Perfil">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 rounded-xl flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Editar Perfil</p>
                  <p className="text-xs text-gray-500 truncate">Nome, foto e informações pessoais</p>
                </div>
              </div>
              <span className="text-gray-400 flex-shrink-0 ml-2">›</span>
            </div>

            <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-xl flex-shrink-0">
                  <Lock size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Alterar Senha</p>
                  <p className="text-xs text-gray-500 truncate">Atualize sua senha de acesso</p>
                </div>
              </div>
              <span className="text-gray-400 flex-shrink-0 ml-2">›</span>
            </div>

            <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 rounded-xl flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Email e Privacidade</p>
                  <p className="text-xs text-gray-500 truncate">Gerencie suas preferências de contato</p>
                </div>
              </div>
              <span className="text-gray-400 flex-shrink-0 ml-2">›</span>
            </div>
          </div>
        </SettingsCard>

        {/* Appearance Section */}
        <SettingsCard title="🎨 Aparência">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-xl flex-shrink-0">
                  <Moon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Modo Escuro</p>
                  <p className="text-xs text-gray-500">Tema escuro para seus olhos</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Em breve
                  </span>
                </div>
              </div>
              <ToggleSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 rounded-xl flex-shrink-0">
                  <Palette size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Tema de Cores</p>
                  <p className="text-xs text-gray-500">Personalize as cores do app</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Em breve
                  </span>
                </div>
              </div>
              <span className="text-gray-400 flex-shrink-0">›</span>
            </div>
          </div>
        </SettingsCard>

        {/* Notifications Section */}
        <SettingsCard title="🔔 Notificações">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-xl flex-shrink-0">
                  <Bell size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Notificações Push</p>
                  <p className="text-xs text-gray-500">Receba alertas em tempo real</p>
                </div>
              </div>
              <ToggleSwitch checked={notificacoes} onChange={() => setNotificacoes(!notificacoes)} />
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-sky-100 text-blue-600 rounded-xl flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Notificações por Email</p>
                  <p className="text-xs text-gray-500">Receba updates no seu email</p>
                </div>
              </div>
              <ToggleSwitch checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 rounded-xl flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Sons e Vibrações</p>
                  <p className="text-xs text-gray-500">Feedback sonoro nas ações</p>
                </div>
              </div>
              <ToggleSwitch checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
            </div>
          </div>
        </SettingsCard>

        {/* System Section */}
        <SettingsCard title="⚡ Sistema">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600 rounded-xl flex-shrink-0">
                  <Globe size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Idioma</p>
                  <p className="text-xs text-gray-500">Português (Brasil)</p>
                </div>
              </div>
              <span className="text-gray-400 flex-shrink-0 ml-2">›</span>
            </div>

            <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer border-t border-gray-100 mt-2 pt-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 rounded-xl flex-shrink-0">
                  <Trash2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">Limpar Cache</p>
                  <p className="text-xs text-gray-500">Limpa dados salvos no navegador</p>
                </div>
              </div>
              <button 
                onClick={resetarSistema}
                className="px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                Limpar
              </button>
            </div>
          </div>
        </SettingsCard>

        {/* Danger Zone */}
        <SettingsCard title="⚠️ Zona de Perigo">
          <div className="p-4 space-y-4">
            <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl flex-shrink-0">
                    <LogOut size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 mb-1 text-sm">Sair da Conta</p>
                    <p className="text-xs text-gray-600 mb-3">
                      Você será desconectado deste dispositivo. Seus dados permanecerão salvos.
                    </p>
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                    >
                      Sair Agora
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 text-gray-600 rounded-xl flex-shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 mb-1 text-sm">Excluir Conta</p>
                  <p className="text-xs text-gray-600">
                    Esta ação é permanente e não pode ser desfeita.
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                    Em breve
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Version Info */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">Pink Life v1.0.0</p>
          <p className="text-xs text-gray-300 mt-1">Made with 💓 by Pink Team</p>
        </div>
      </div>

      <TestApi />
    </ContainerPages>
  );
}