import Button from "@/componentes/ui/Button";
import { Icon } from "lucide-react";

export default function Menuhamburguer() {
  return (
    <div className="flex flex-col gap-10 w-[15em] p-4 bg-white h-full border-r-2 border-pink-300">
      <div >
        <h2 className="text-pink-400 text-2xl font-bold" >hello kitty</h2>
        <p>Organizador pessoal</p>
      </div>
      <div className="gap-8">
        <ul >
          <li>
            <Button label="Dashboard"   />
          </li>
          <li>
            <Button label="Estudos" />
          </li>
          <li>
            <Button label="Treino" />
          </li>
          <li>
            <Button label="Hábitos" />
          </li>
          <li>
            <Button label="Finanças" />
          </li>
          <li>
            <Button label="Beleza" />
          </li>
          <li>
            <Button label="Casa & Rotina" />
          </li>
          <li>
            <Button label="Saúde" />
          </li>
          <li>
            <Button label="Alimentação" />
          </li>
        </ul>
      </div>
      <div className="bg-linear-to-r from-pink-300   to-pink-400 text-center p-2 rounded-md ">
        <p className="text-white text-[0.9em] "> `Você pode fazer qualquer coisa que quiser!`</p>
        <p className="text-white [0.9em]"> - Hello Kitty 💕</p>
      </div>
    </div>
  );
}
