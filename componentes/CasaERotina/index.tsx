import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";

export default function CasaERotina() {
  return (
    <>
      <ContainerPages>
        <Cabecalho
          title="Casa e Rotina 🏠"
          imageSrc={"/images/hello-kitty-home.jpg"}
        >
          <p className="">Organize sua rotina doméstica e bem-estar</p>
        </Cabecalho>
        <Desenvolvimento />
      </ContainerPages>
    </>
  );
}
