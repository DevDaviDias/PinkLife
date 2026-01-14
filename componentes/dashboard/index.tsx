import DateComponent from "../ui/date";
import Image from "next/image";
import TitleSection from "@/componentes/ui/Title";
import Cardprogresso from "../ui/Cardprogresso";
import StatusCard from "../ui/StatusCard";
import CardAcoes from "../ui/CardAcoes";

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
      <Cardprogresso title="Hábitos" progressoDodia="Progresso do dia" progresso={70} barraDeProgresso={true} />
     
      <Cardprogresso title="Tarefas" progressoDodia="Progresso do dia" progresso={70} barraDeProgresso={true} />
     
      <Cardprogresso title="Estudos" progressoDodia="3.5h" progresso={70} barraDeProgresso={true} />
     
      <Cardprogresso title="Treino" progressoDodia="Concluido" progresso={100} barraDeProgresso={true} />
     </div>

     <div className="flex gap-4 mt-[2em]">
      <StatusCard title="Agenda de Hoje" progressoDodia="Progresso do dia"  ></StatusCard>
      <StatusCard title="Conquistas da Semana" progressoDodia="Progresso do dia"  ></StatusCard>
     </div>

     <div>
    <CardAcoes title="Ações Rápidas" progressoDodia="Progresso do dia"  ></CardAcoes>
    
     </div>


    </div>
  );
}
