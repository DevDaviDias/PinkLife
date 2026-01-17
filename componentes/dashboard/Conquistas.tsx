import StatusCard from "../ui/StatusCard ";
import { Icon, Star } from "lucide-react";

const conquistas = [
  {
    cor: "#95F695",
    descricao: "7 dias consecutivos de exercícios!",
    corLetras: "white"
  },
  {
    cor: "#FFA0BD",
    descricao: "Meta de estudos atingida",
    corLetras: "white"
  },
  {
    cor: "#F9E5A4",
    descricao: "Orçamento mensal controlado",
    corLetras: "black"
  },
];
export default function Conquistas() {
  return (
    <>
      <StatusCard title="Conquistas da Semana" icon={<Star size={20} />}>
        <div>
          {conquistas.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mb-2 h-[3.4em]  p-[0.5em] rounded-lg w-full"
              style={{ backgroundColor: item.cor, color:item.corLetras }}
            >
              <div className="h-4 rounded-full md:h-7 "></div>
              <Star size={20}  />
              <div className=" text-[0.9em] md:text-[1em] ">
                <p className="font-semibold ">{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </StatusCard>
    </>
  );
}
