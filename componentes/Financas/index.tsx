import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso"
import Desenvolvimento from "../Desenvolvimento";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import GrayMenu from "@/componentes/ui/GrayMenu"
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/componentes/ui/card";
import { Tabs, TabsContent } from "@/componentes/ui/tabs";
import Button from "../ui/Button";
import { div } from "framer-motion/client";

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
    icon: <DollarSign size={22} />,
    valor: "R$ 2200",
    cor: "text-green-500",

  },
];


export default function Financas() {
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("0");
  const [active, setActive] = useState("Registrar")

  const handleCalc = (value: string) => {
    if (value === "C") {
      setCalcInput("");
      setCalcResult("0");
      return;
    }

    if (value === "=") {
      try {
        setCalcResult(String(eval(calcInput)));
      } catch {
        setCalcResult("Erro");
      }
      return;
    }

    setCalcInput((prev) => prev + value);
  };

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
              key={item.title}
              title={item.title}
              icon={item.icon}
              valor={item.valor}
              cor={item.cor}
            />
          ))}

        </div>

        <GrayMenu items={[
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
            title: "Calculardora",
            onClick: () => setActive("calculadora"),
            active: active === "calculadora"
          }
        ]}


        />
        < div className="mt-4">
          {/* ADICIONAR MATÉRIA */}
          {active === "Registrar" && (<p></p>

          )}

          {active === "Tabela" && (<p></p>

          )}

          {active === "Gráfico" && (<p>olá</p>

          )}
          {active === "calculadora" && (<div>
            <div>
              <Tabs defaultValue="calculadora">
                <TabsContent value="calculadora">
                  <Card className="kawaii-card max-w-md mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#FF69B4]">
                        {/* Ícone ou emoji no lugar do Calculator */}
                         Calculadora
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Display da calculadora */}
                        <div className="bg-gray-100 p-4 h-[5em] rounded-lg">
                          <div className="text-right text-sm text-gray-600">{calcInput}</div>
                          <div className="text-right text-2xl font-bold">{calcResult}</div>
                        </div>

                        {/* Botões da calculadora */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            "C", "/", "%", "/",
                            "7", "8", "9", "*",
                            "4", "5", "6", "-",
                            "1", "2", "3", "+",
                             "" , "0",  ".",  "="
                          ].map((btn, idx) => (
                            <Button
                              key={idx}
                              className={`
                  h-12
                  ${btn === '=' ? 'kawaii-button col-span-1' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                  ${btn === '0' && idx === 16 ? 'col-span-2' : ''}
                `}
                              onClick={() => handleCalc(btn)}
                            >
                              {btn}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

            </div>
            </div>

          )}
        </div>




        <Desenvolvimento />
      </ContainerPages>
    </>
  );
}
