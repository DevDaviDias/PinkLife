import DateComponent from "../ui/date";
import Image from "next/image";
import TitleSection from "@/componentes/ui/Title";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import CardAcoes from "../ui/CardAcoes";
import { BookOpen, Heart, Repeat, Target, Calendar, Star } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="m-2 ml-[17em]">
      <div className="flex flex-start items-center justify-between">
        <div>
          <TitleSection title="Olá! Bem-vinda de volta! 🌸" />
          <DateComponent />
        </div>
        <div>
          <Image
            src="/images/hello-kitty-dashboard.jpg"
            alt="Dashboard Image"
            width={50}
            height={200}
            className="rounded-[50%] mt-4 mb-4 animate-bounce"
          />
        </div>
      </div>

     <div className="mt-6 flex gap-4">
      <Cardprogresso title="Hábitos" progressoDodia="Progresso do dia" progresso={70} barraDeProgresso={true} icon={<Target size={15}/>} />
     
      <Cardprogresso title="Tarefas" progressoDodia="Progresso do dia" progresso={70} barraDeProgresso={true} icon={<Repeat size={15}/>} />
     
      <Cardprogresso title="Estudos" progressoDodia="3.5h" progresso={70} barraDeProgresso={true} icon={<BookOpen size={15}/>} />
     
      <Cardprogresso title="Treino" progressoDodia="Concluido" progresso={100} barraDeProgresso={true} icon={<Heart size={15}/>} />
     </div>


     <div className="flex gap-4 mt-[2em]">
     <Agenda/>
     <Conquistas/>
     </div>


    <CardAcoes title="Ações Rápidas" ></CardAcoes>
    </div>
  );
}
