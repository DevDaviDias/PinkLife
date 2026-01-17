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
  Utensils,Settings
} from "lucide-react";
import Image from "next/image";


type MenuHamburguerProps = {
  onChangeSessao: (sessao: string) => void;
};

export default function MenuHamburguer({
  onChangeSessao,
}: MenuHamburguerProps) {
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

      {/* Navegação */}
      <nav>
        <ul className="flex flex-col gap-2">
          <li>
            <Button
              label="Dashboard"
              onClick={() => onChangeSessao("dashboard")}
              icon={<House size={18} />}
            />
          </li>
          <li>
            <Button
              label="Estudos"
              onClick={() => onChangeSessao("estudos")}
              icon={<BookOpen size={18} />}
            />
          </li>
          <li>
            <Button
              label="Treino"
              onClick={() => onChangeSessao("treino")}
              icon={<Dumbbell size={18} />}
            />
          </li>
          <li>
            <Button
              label="Hábitos"
              onClick={() => onChangeSessao("habitos")}
              icon={<Target size={18} />}
            />
          </li>
          <li>
            <Button
              label="Finanças"
              onClick={() => onChangeSessao("financas")}
              icon={<DollarSign size={18} />}
            />
          </li>
          <li>
            <Button
              label="Beleza"
              onClick={() => onChangeSessao("beleza")}
              icon={<Sparkles size={18} />}
            />
          </li>
          <li>
            <Button
              label="Viagens"
              onClick={() => onChangeSessao("viagens")}
              icon={<Plane size={18} />}
            />
          </li>
          <li>
            <Button
              label="Casa & Rotina"
              onClick={() => onChangeSessao("casa_rotina")}
              icon={<House size={18} />}
            />
          </li>
          <li>
            <Button
              label="Saúde"
              onClick={() => onChangeSessao("saude")}
              icon={<Heart size={18} />}
            />
          </li>
          <li>
            <Button
              label="Alimentação"
              onClick={() => onChangeSessao("alimentacao")}
              icon={<Utensils size={18} />}
            />
          </li>
           <li>
            <Button
              label="Configurações"
              onClick={() => onChangeSessao("Configuracao")}
              icon={<Settings size={18} />}
            />
          </li>
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
