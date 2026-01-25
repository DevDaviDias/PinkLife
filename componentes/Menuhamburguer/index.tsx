"use client";

import { useState, useEffect } from "react";
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

// --- Interface para garantir que o TypeScript não dê erro ---
interface FraseMotivacional {
  texto: string;
  autor: string;
}

type MenuHamburguerProps = {
  onChangeSessao: (sessao: string) => void;
};

export default function MenuHamburguer({
  onChangeSessao,
}: MenuHamburguerProps) {
  const [activeSessao, setActiveSessao] = useState("dashboard");

  // --- Lista de Frases Fofas ---
  const frases: FraseMotivacional[] = [
    { texto: "Você pode fazer qualquer coisa que quiser!", autor: "Hello Kitty 💕" },
    { texto: "Amigos nunca são demais!", autor: "Hello Kitty 🎀" },
    { texto: "O melhor acessório é um sorriso.", autor: "Pompompurin 🍮" },
    { texto: "Seja gentil com você mesma hoje.", autor: "My Melody 🌸" },
    { texto: "Pequenos passos levam a grandes sonhos.", autor: "Cinnamoroll ☁️" },
    { texto: "Transforme sua rotina em magia!", autor: "Kiki & Lala ✨" },
    { texto: "Sua determinação é sua maior força.", autor: "Kuromi 😈" },
    { texto: "Ame cada versão de quem você é.", autor: "Hello Kitty 💖" }
  ];

  // Estado da frase com tipagem explícita
  const [fraseAtiva, setFraseAtiva] = useState<FraseMotivacional>(frases[0]);

  // Efeito para sortear uma frase ao carregar o componente
  useEffect(() => {
    const indice = Math.floor(Math.random() * frases.length);
    const selecionada = frases[indice];
    if (selecionada) {
      setFraseAtiva(selecionada);
    }
  }, []);

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
    { id: "Configuracao", label: "Configuração", icon: <Settings size={18} /> },
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
        z-50
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/hello-kitty-logo.png"
          alt="Logo"
          width={60}
          height={60}
          priority
        />
        <div>
          <h2 className="text-pink-400 text-2xl font-bold leading-tight">
            Hello Kitty
          </h2>
          <p className="text-sm text-gray-500 font-medium">Organizador pessoal</p>
        </div>
      </div>

      {/* Navegação com Scroll customizado se necessário */}
      <nav className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-200">
        <ul className="flex flex-col gap-2">
          {menuItems.map(({ id, label, icon }) => (
            <li key={id}>
              <Button
                label={label}
                onClick={() => handleClick(id)}
                icon={icon}
                className={
                  activeSessao === id
                    ? "bg-pink-400 text-white shadow-md shadow-pink-100"
                    : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-500 border-transparent transition-all"
                }
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Card de Frase Interativo */}
      <div 
        onClick={() => {
          const novoIndice = Math.floor(Math.random() * frases.length);
          setFraseAtiva(frases[novoIndice]);
        }}
        className="mt-auto bg-gradient-to-br from-pink-300 to-pink-400 p-5 rounded-[2rem] text-center cursor-pointer hover:brightness-105 transition-all active:scale-95 shadow-lg shadow-pink-100 group"
      >
        <p className="text-white text-xs font-semibold leading-relaxed italic group-hover:scale-105 transition-transform">
          “{fraseAtiva.texto}”
        </p>
        <p className="text-pink-100 text-[10px] font-black mt-3 uppercase tracking-widest">
          – {fraseAtiva.autor}
        </p>
      </div>
    </aside>
  );
}