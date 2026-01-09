import DateComponent from "../ui/date";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import CardAcoes from "../ui/CardAcoes";
import { BookOpen, Heart, Repeat, Target } from "lucide-react";
import Cabecalho from "../ui/Cabecalho";
import ContainerPages from "../ui/ContainerPages";
import { useEffect, useState } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

export default function Dashboard() {
   const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getLoggedUser();
        setUserName(user.name); // salva o nome do usuário no state
      } catch (err) {
        console.error("Erro ao buscar usuário logado", err);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      <ContainerPages>
         <Cabecalho
        title={`Olá, ${userName || "Bem-vinda"}! 🌸`}
        imageSrc={"/images/hello-kitty-dashboard.jpg"}
      >
          <DateComponent />
        </Cabecalho>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-4 aling-center gap-[0.6em] justify-center md:gap-4 ">
          <Cardprogresso
            title="Hábitos"
            progressoDodia="Progresso "
            progresso={70}
            barraDeProgresso={true}
            icon={<Target size={20} />}
          />

          <Cardprogresso
            title="Tarefas"
            progressoDodia="Progresso "
            progresso={70}
            barraDeProgresso={true}
            icon={<Repeat size={20} />}
          />

          <Cardprogresso
            title="Estudos"
            progressoDodia="3.5h"
            progresso={70}
            barraDeProgresso={true}
            icon={<BookOpen size={20} />}
          />

          <Cardprogresso
            title="Treino"
            progressoDodia="Concluido"
            progresso={100}
            barraDeProgresso={true}
            icon={<Heart size={20} />}
          />
        </div>

        <div className="flex-col mb-4 flex gap-4 mt-[1.2em] md:mb-0 md:mt-[2em] md:flex-row">
          <Agenda />
          <Conquistas />
        </div>
        <div className="hidden md:block">
          <CardAcoes title="Ações Rápidas"></CardAcoes>
        </div>
      </ContainerPages>
    </>
  );
}
