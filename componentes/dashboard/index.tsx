import DateComponent from "../ui/date";
import Cardprogresso from "../ui/Cardprogresso";
import Conquistas from "./Conquistas";
import Agenda from "./Agenda";
import CardAcoes from "../ui/CardAcoes";
import { BookOpen, Heart, Repeat, Target, Calendar, Star } from "lucide-react";
import Cabecalho from "../ui/Cabecalho";
import ContainerPages from "../ui/ContainerPages";

export default function Dashboard() {
  return (
    <>
      <ContainerPages>
        <Cabecalho
          title="Olá! Bem-vinda de volta! 🌸"
          imageSrc={"/images/hello-kitty-dashboard.jpg"}
        >
          <DateComponent />
        </Cabecalho>

        <div className="mt-6 flex gap-4">
          <Cardprogresso
            title="Hábitos"
            progressoDodia="Progresso do dia"
            progresso={70}
            barraDeProgresso={true}
            icon={<Target size={15} />}
          />

          <Cardprogresso
            title="Tarefas"
            progressoDodia="Progresso do dia"
            progresso={70}
            barraDeProgresso={true}
            icon={<Repeat size={15} />}
          />

          <Cardprogresso
            title="Estudos"
            progressoDodia="3.5h"
            progresso={70}
            barraDeProgresso={true}
            icon={<BookOpen size={15} />}
          />

          <Cardprogresso
            title="Treino"
            progressoDodia="Concluido"
            progresso={100}
            barraDeProgresso={true}
            icon={<Heart size={15} />}
          />
        </div>

        <div className="flex gap-4 mt-[2em]">
          <Agenda />
          <Conquistas />
        </div>

        <CardAcoes title="Ações Rápidas"></CardAcoes>
      </ContainerPages>
    </>
  );
}
