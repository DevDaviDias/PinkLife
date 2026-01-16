import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";
import Cardprogresso from "../ui/Cardprogresso";
import { Target, Repeat, BookOpen, Heart,Dumbbell, FireExtinguisherIcon, Hourglass } from "lucide-react";
import GrayMenu from "../ui/GrayMenu";
import { useState } from "react";

export default function Estudos() {
    const [active,setActive] = useState("Hoje");
  return (
    <>
      <ContainerPages>
       <Cabecalho
          title="Seção de Estudos 📚"
          imageSrc={"/images/hello-kitty-study.jpg"}
        >
          <p className="">Organize seus estudos e acompanhe o progresso</p>
        </Cabecalho>
         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4  aling-center gap-[0.6em] justify-center md:gap-4 ">
                          <Cardprogresso
                            title="Matérias"
                            progressoDodia="cadastradas"
                            porcentagem="4"
                            icon={<BookOpen size={15} />}
                          />
                
                          <Cardprogresso
                            title="Horas Totais"
                            progressoDodia="estudadas"
                            porcentagem="55.0h"
                            icon={<Hourglass size={15} />}
                          />
                
                          <Cardprogresso
                            title="Sessões"
                           progressoDodia="realizadas"
                            porcentagem="2"
                            icon={<Target size={15} />}
                          />
                        </div>
                        
        <GrayMenu items={[
            { title: "Matéria", onClick: () => setActive("Hoje"), active: active === "Hoje" },
            { title: "Cronõmetro", onClick: () => setActive("Semana"), active: active === "Semana" },
            { title: "Histórico", onClick: () => setActive("Historico"), active: active === "Historico" }
        ]} />

        <div className="mt-4">
            {active === "Hoje" && <p>Conteúdo da seção Hoje</p>}
            {active === "Semana" && <p>Conteúdo da seção Semana</p>}
            {active === "Historico" && <p>Conteúdo da seção Histórico</p> }           
        </div>
     
        <Desenvolvimento />

      </ContainerPages>
    </>
  );
}