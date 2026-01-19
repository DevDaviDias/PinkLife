import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import { Target, Repeat, BookOpen, Heart } from "lucide-react";
import GrayMenu from "../ui/GrayMenu";
import { useState } from "react";

export default function Habitos() {
  const [active,setActive]= useState("Historico")
  return (
    <>
      <ContainerPages>
        <Cabecalho
          title="Hábitos 🎯"
          imageSrc={"/images/hello-kitty-habits.jpg"}
        >
          <p className="">Construa hábitos saudáveis dia a dia</p>
        </Cabecalho>

  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4  aling-center gap-[0.6em] justify-center md:gap-4">
          <Cardprogresso
            title="Hoje"
            progressoDodia="concluido"
            porcentagem="2/3"
            icon={<Target size={15} />}
          />

          <Cardprogresso
            title="Taxa"
            progressoDodia="concluido"
            porcentagem="67%"
            icon={<Repeat size={15} />}
          />

          <Cardprogresso
            title="Maior Streak"
            progressoDodia="concluido"
            porcentagem="12"
            icon={<BookOpen size={15} />}
          />

          <Cardprogresso
            title="Total"
           progressoDodia="concluido"
            porcentagem="3"
            icon={<Heart size={15} />}
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
                                   title: "Hitórico",
                                    onClick: () => setActive("Historico"),
                                          active: active === "Historico"
                                 }
                              ]}
                               
                              
                              />

                              {active === "Hoje" && (<p>Aqui iram ficar os registros de hoje.</p>)}
                              {active === "MeusTreinos" && (<p>Meus treinos</p>)}
                              {active === "CriarTreinos" && (<p>Criação de treinos</p>)}
                              {active === "Historico" && (<p>Histórico dos treinos</p>)}

         

        
      </ContainerPages>
    </>
  );
}
