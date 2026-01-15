import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";
import Cardprogresso from "../ui/Cardprogresso";
import { Target, Repeat, BookOpen, Heart,Dumbbell, FireExtinguisherIcon, Hourglass } from "lucide-react";
  

export default function Estudos() {
  return (
    <>
      <ContainerPages>
       <Cabecalho
          title="Seção de Estudos 📚"
          imageSrc={"/images/hello-kitty-study.jpg"}
        >
          <p className="">Organize seus estudos e acompanhe o progresso</p>
        </Cabecalho>
         <div className="mt-6 flex gap-4">
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
                        

     
        <Desenvolvimento />

      </ContainerPages>
    </>
  );
}