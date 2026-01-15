import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";

export default function Viagens() {
  return (
    <>
      <ContainerPages>
       <Cabecalho
          title="Viagens 🧳"
          imageSrc={"/images/hello-kitty-travel.jpg"}
        >
          <p className="">Planeje suas viagens e organize sua rotina</p>
        </Cabecalho>

        <Desenvolvimento />

      </ContainerPages>
    </>
  );
}