"use client";

import { useState } from "react";
import Button from "@/componentes/ui/Button";
import {
  BookOpen,
  DollarSign,
  Dumbbell,
  Heart,
  House,
  Plane,
  Sparkles,
  Target,
  Utensils,
  Settings,
} from "lucide-react";
import Image from "next/image";

type MenuHamburguerProps = {
  onChangeSessao: (sessao: string) => void;
};

export default function MenuHamburguer({
  onChangeSessao,
}: MenuHamburguerProps) {
  const [activeSessao, setActiveSessao] = useState("dashboard");

  const handleClick = (sessao: string) => {
    setActiveSessao(sessao);
    onChangeSessao(sessao);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <House size={18} /> },
    { id: "estudos", label: "Estudos", icon: <BookOpen size={18} /> },
    { id: "treino", label: "Treino", icon: <Dumbbell size={18} /> },
    { id: "habitos", label: "Hábitos", icon: <Target size={18} /> },
    { id: "financas", label: "Finanças", icon: <DollarSign size={18} /> },
    { id: "beleza", label: "Beleza", icon: <Sparkles size={18} /> },
    { id: "viagens", label: "Viagens", icon: <Plane size={18} /> },
    { id: "casa_rotina", label: "Casa & Rotina", icon: <House size={18} /> },
    { id: "saude", label: "Saúde", icon: <Heart size={18} /> },
    { id: "alimentacao", label: "Alimentação", icon: <Utensils size={18} /> },
    { id: "Configuracao",label: "Configuração",icon: <Settings size={18} />,
    },
  ];

  return (
    <aside
      className="
        hidden lg:flex
        flex-col gap-6
        w-[17em]
        p-4
        bg-white
        h-screen
        border-r border-pink-300
        fixed left-0 top-0
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/hello-kitty-logo.png"
          alt="Logo"
          width={60}
          height={60}
        />
        <div>
          <h2 className="text-pink-400 text-2xl font-bold leading-tight">
            Hello Kitty
          </h2>
          <p className="text-sm text-gray-500">Organizador pessoal</p>
        </div>
      </div>

      <nav>
        <ul className="flex flex-col gap-2">
          {menuItems.map(({ id, label, icon }) => (
            <li key={id}>
              <Button
                label={label}
                onClick={() => handleClick(id)}
                icon={icon}
                className={
                  activeSessao === id
                    ? "bg-pink-400 text-white hover:text-amber-50"
                    : "bg-white text-black hover:bg-pink-300 hover:text-amber-50"
                }
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Frase */}
      <div className="mt-auto bg-gradient-to-r from-pink-300 to-pink-400 text-center p-3 rounded-md">
        <p className="text-white text-sm">
          “Você pode fazer qualquer coisa que quiser!”
        </p>
        <p className="text-white text-sm mt-2">– Hello Kitty 💕</p>
      </div>
    </aside>
  );
}
