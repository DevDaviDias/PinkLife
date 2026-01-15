import Home from "@/app/page";
import Button from "@/componentes/ui/Button";
import { BookOpen, DollarSign, Dumbbell, Heart, Icon, LayoutDashboard, Plane, Repeat, Sparkles, Target, Utensils, House   } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";


export default function MenuHamburguer({ onChangeSessao }: { onChangeSessao: (sessao: string) => void }) {

  return (
    <div className="flex flex-col gap-10 w-[15em] p-4 bg-white h-full border-r-2 border-pink-300">
      <div>
        <div className="flex">
          
         <Image src="/images/hello-kitty-logo.png" alt="Logo" width={50} height={50} />
          <div className="flex-col">
          <h2 className="text-pink-400 text-2xl  font-bold">hello kitty</h2> 
          <p className="text-sm">Organizador pessoal</p>
          </div>
        </div>
       
      </div>
      <div className="gap-8">
        <ul>
          <li className="flex aling-center gap-2 justify-center">
            <Button label="Dashboard" onClick={() => onChangeSessao("dashboard")} icon={<House size={17}/>} />
          </li>             
          <li>
            <Button label="Estudos" onClick={() => onChangeSessao("estudos")} icon={<BookOpen size={17}/>} />
          </li>
          <li>
            <Button label="Treino" onClick={() => onChangeSessao("treino")} icon={<Dumbbell size={17}/>} />
          </li>
          <li>
            <Button label="Hábitos" onClick={() => onChangeSessao("habitos")} icon={<Target size={17}/>} />
          </li>
          <li>
            <Button label="Finanças" onClick={() => onChangeSessao("financas")} icon={<DollarSign size={17}/>} />
          </li>
          <li>
            <Button label="Beleza" onClick={() => onChangeSessao("beleza")} icon={<Sparkles size={17}/>} />
          </li>
          <li>
            <Button label="Casa & Rotina" onClick={() => onChangeSessao("casa_rotina")} icon={<Plane size={17}/>} />
          </li>
          <li>
            <Button label="Saúde" onClick={() => onChangeSessao("saude")} icon={<Heart size={17}/>} />
          </li>
          <li>
            <Button label="Alimentação" onClick={() => onChangeSessao("alimentacao")} icon={<Utensils size={17}/>} />
          </li>
        </ul>
      </div>
      <div className="bg-linear-to-r from-pink-300   to-pink-400 text-center p-2 rounded-md ">
        <p className="text-white text-[0.9em] ">
          {" "}
          `Você pode fazer qualquer coisa que quiser!`
        </p>
        <p className="text-white [0.9em]"> - Hello Kitty 💕</p>
      </div>
    </div>
  );
}
