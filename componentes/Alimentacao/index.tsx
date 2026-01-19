import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";


export default function Alimentacao() {
  
  return (
    <>
      <ContainerPages>
        <Cabecalho
          title="Alimentação 📚"
          imageSrc={"/images/hello-kitty-study.jpg"}
        >
          <p className="">Organize seus estudos e acompanhe o progresso</p>
        </Cabecalho>

      

      </ContainerPages>
    </>
  );
}
