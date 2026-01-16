import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import GrayMenu from "../ui/GrayMenu";
import { useState } from "react";

export default function Alimentacao() {
  const [active, setActive] = useState("Hoje");
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
