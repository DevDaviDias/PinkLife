import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";

export default function Estudos() {
  return (
    <>
      <ContainerPages>
       <Cabecalho
          title="Seção de Estudos 📚"
          imageSrc={"/images/hello-kitty-dashboard.jpg"}
        >
          <p className="">Organize seus estudos e acompanhe o progresso</p>
        </Cabecalho>

      </ContainerPages>
    </>
  );
}