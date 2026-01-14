type PropsProgresso = {
    title: string;
    progressoDodia?: string;
    progresso?: number | string;
    barraDeProgresso?: boolean;
    
}

export default function Cardprogresso({ title,progressoDodia, progresso, barraDeProgresso }: PropsProgresso) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-70 border-2 border-pink-200 h-24">
            <h2 className="text-pink-400 text-lg font-bold">{title}</h2>
            <p text-lg>{progressoDodia}</p>
            {barraDeProgresso && (
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-pink-200">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${progresso}%` }}></div>
                </div>
            )}
        </div>
    )
}