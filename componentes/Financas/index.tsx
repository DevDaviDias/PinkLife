import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso"
import Desenvolvimento from "../Desenvolvimento";
import { info } from "console";
import { TrendingUp,TrendingDown,DollarSign  } from "lucide-react";
import GrayMenu from "@/componentes/ui/GrayMenu"
import { title } from "process";
import { useState } from "react";
const conteudo = [
  
  {
    title: "Receitas",
    progressoDodia: "cadastradas",
    icon: <TrendingUp size={22} />,
    valor: "R$ 3000", 
    cor: "text-green-500",
  },
  {
    title: "Despesas",
    progressoDodia: "estudadas",
    icon: <TrendingDown size={22} />,
    valor: "R$ 800",
    cor: "text-red-500",
  },
  {
    title: "Saldo",
    progressoDodia: "realizadas",
    icon: <DollarSign  size={22} />,
    valor: "R$ 2200",
    cor: "text-green-500",

  },
];


export default function Financas() {
  const [active, setActive] = useState("Registrar")
  return (
    <>
      <ContainerPages>
        <Cabecalho
          title="Finanças 💰"
          imageSrc={"/images/hello-kitty-finance.jpg"}
        >
          <p className="">Controle suas receitas e despesas</p>
        </Cabecalho>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
       {conteudo.map((item) => (
         <Cardprogresso
         key = {item.title}
         title ={item.title}
         icon ={item.icon}
         valor= {item.valor}
         cor={item.cor}
         />
       ))}

      </div>
      
      <GrayMenu items ={[
         {
           title: "Registrar",
            onClick: () => setActive("Registrar"),
                  active: active === "Registrar"
           
         },
         {
           title: "Tabela",
            onClick: () => setActive("Tabela"),
                  active: active === "Tabela"
         },
         {
           title: "Gráfico",
            onClick: () => setActive("Gráfico"),
                  active: active === "Gráfico"
         },
         {
           title: "Calculadora",
            onClick: () => setActive("Calculadora"),
                  active: active === "HoCalculadoraje"
         }
      ]}
       
      
      />
     

        
        <Desenvolvimento />
      </ContainerPages>
    </>
  );
}
