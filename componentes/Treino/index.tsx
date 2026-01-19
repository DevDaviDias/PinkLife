import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";
import Cardprogresso from "../ui/Cardprogresso";
import { Target, Repeat, Dumbbell,  FireExtinguisherIcon } from "lucide-react";

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
        

         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4  aling-center gap-[0.6em] justify-center md:gap-4">
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
                 <GrayMenu items ={[
                         {
                           title: "Hoje",
                            onClick: () => setActive("Hoje"),
                                  active: active === "Hoje"
                           
                         },
                         {
                           title: "Meus Treinos",
                            onClick: () => setActive("MeusTreinos"),
                                  active: active === "MeusTreinos"
                         },
                         {
                           title: "Criar Treinos",
                            onClick: () => setActive("CriarTreinos"),
                                  active: active === "CriarTreinos"
                         },
                         {
                           title: "Histórico",
                            onClick: () => setActive("Historico"),
                                  active: active === "Historico"
                         }
                      ]}
                       
                      
                      />
                
<Desenvolvimento />
      </ContainerPages>
    </>
  );
}