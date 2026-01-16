import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";
import Cardprogresso from "../ui/Cardprogresso";
import { Target, Repeat, BookOpen, Heart, Dumbbell, FireExtinguisher, FireExtinguisherIcon } from "lucide-react";
import { Figtree } from "next/font/google";
import { useState } from "react";
import GrayMenu from "../ui/GrayMenu";

export default function Treino() {
  const [active,setActive] = useState("Hoje");

  return (
    <>
      <ContainerPages>
       <Cabecalho
          title="Treino 💪"
          imageSrc={"/images/hello-kitty-fitness.jpg"}
        >
          <p className="">Planeje e acompanhe seus treinos</p>
        </Cabecalho>
        

         <div className="mt-6 flex gap-4">
                  <Cardprogresso
                    title="Treinos"
                    progressoDodia="cadastrados"
                    porcentagem="2"
                    icon={<Dumbbell size={15} />}
                  />
        
                  <Cardprogresso
                    title="Esta Semana"
                    progressoDodia="treinos feitos"
                    porcentagem="0"
                    icon={<Repeat size={15} />}
                  />
        
                  <Cardprogresso
                    title="Sequência"
                    progressoDodia="dias seguidos"
                    porcentagem="12"
                    icon={<FireExtinguisherIcon size={15} />}
                  />
        
                  <Cardprogresso
                    title="Hoje"
                   progressoDodia="concluido"
                    porcentagem="0"
                    icon={<Target size={15} />}
                  />
                </div>
                
<Desenvolvimento />
      </ContainerPages>
    </>
  );
}