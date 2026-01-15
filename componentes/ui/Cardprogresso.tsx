type PropsProgresso = {
    icon?: React.ReactNode ;
    title: string;
    porcentagem?: number | string;
    progressoDodia?: string;
    progresso?: number | string;
    barraDeProgresso?: boolean | string;
    
}

export default function Cardprogresso({ title,progressoDodia, progresso, barraDeProgresso,icon,porcentagem }: PropsProgresso) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full border-2 border-pink-200 h-24 hover:shadow-lg transition hover:border-pink-300 hover:scale-[1.0] hover:duration-300 hover:ease-in-out hover:z-10 hover:cursor-pointer hover:-translate-y-1">
            <div className="flex items-center gap-2 text-pink-400">
                {icon}
                <h2 className="text-pink-400 text-lg font-bold">{title}</h2>
            </div>
            <div className="text-pink-400 text-[0.9em] font-bold" >
                <p>{porcentagem}</p>
            </div>
            <p className="text-[0.7em] mt-1 mb-1">{progressoDodia}</p>
            {barraDeProgresso && (
                <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-pink-200">
                    <div className="bg-pink-600 h-1 rounded-full" style={{ width: `${progresso}%` }}></div>
                </div>
            )}
        </div>
    )
}