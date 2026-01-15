import StatusCard from "../ui/StatusCard";
import { Calendar } from "lucide-react";

const agenda = [{
    cor: "#FF69B4",
    descricao: "Estudar Matemática",
    horario: "10:00 - 12:00",
},{
    cor 
: "#98FB98",
    descricao: "Treinar na academia",
    horario: "14:00 - 15:30",
},
{
    cor: "#FFE4B5",
    descricao: "Skincare da Noturno",
    horario: "21:00 - 21:30",
}

];


export default function Agenda() {
    return (
        <>
        <StatusCard title="Agenda de Hoje" icon={<Calendar size={15}/>} >
        <div >
            {agenda.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-1 bg-pink-300/20 p-[0.4em] rounded-lg w-full">
                    <div className="w-[0.4em] h-6 rounded-full " style={{ backgroundColor: item.cor }}></div>
                    <div className="text-[0.8em] ">
                        <p className="font-semibold">{item.descricao}</p>
                        <p className=" text-gray-500">{item.horario}</p>
                    </div>
                </div>
            ))}
        </div>
        </StatusCard>
        
        </>
    );
}