import StatusCard from "../ui/StatusCard";
import { Icon, Star } from "lucide-react";

const conquistas = [
  {
    cor: "#95F695",
    descricao: "7 dias consecutivos de exercícios!",
  },
  {
    cor: "#FFA0BD",
    descricao: "Meta de estudos atingida"
  },
  {
    cor: "#F9E5A4",
    descricao: "Orçamento mensal controlado"
  },
];
export default function Conquistas() {
  return (
    <>
      <StatusCard title="Conquistas da Semana" icon={<Star size={15} />}>
        <div>
          {conquistas.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mb-1  p-[0.4em] rounded-lg w-full"
              style={{ backgroundColor: item.cor }}
            >
              <div className="h-6 rounded-full  "></div>
              <Star size={15} color="white" />
              <div className="text-[0.8em] ">
                <p className="font-semibold text-white">{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </StatusCard>
    </>
  );
}
