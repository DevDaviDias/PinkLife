import StatusCard from "../ui/StatusCard ";
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
        <StatusCard title="Agenda de Hoje" icon={<Calendar size={20}/>} >
        <div >
            {agenda.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-2 h-14 bg-pink-300/20 p-[0.8em] rounded-lg w-full md:h14">
                    <div className="w-[0.4em] h-4 rounded-full md:h5 " style={{ backgroundColor: item.cor }}></div>
                    <div className="text-[1em] md:text-[1.1em] ">
                        <p className="font-extralight">{item.descricao}</p>
                        <p className=" text-gray-500">{item.horario}</p>
                    </div>
                </div>
            ))}
        </div>
        </StatusCard>
        
        </>
    );
}