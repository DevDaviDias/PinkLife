import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Desenvolvimento from "../Desenvolvimento";

export default function Financas() {
  return (
    <>
      <ContainerPages>
        <Cabecalho
          title="Finanças 💰"
          imageSrc={"/images/hello-kitty-finance.jpg"}
        >
          <p className="">Controle suas receitas e despesas</p>
        </Cabecalho>
        <Desenvolvimento />
      </ContainerPages>
    </>
  );
}
