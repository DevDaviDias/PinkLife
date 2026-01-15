import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";

export default function Beleza() {
  return (
    <>
      <ContainerPages>
       <Cabecalho
          title="Beleza 💄"
          imageSrc={"/images/hello-kitty-beauty.jpg"}
        >
          <p className="">Organize sua rotina de beleza e bem-estar</p>
        </Cabecalho>
        <Desenvolvimento /> 
        </ContainerPages>
    </>
  );
}