type PropsProgresso = {
    title: string;
    progressoDodia?: string;
    task?: string;
}

export default function StatusCard({ title,progressoDodia, task }: PropsProgresso) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-[44em] border-2 border-pink-200 h-[12em] gap-4 flex flex-col">

            <h2 className="text-pink-400 text-lg font-bold">{title}</h2>
            <p text-lg>{progressoDodia}</p>
            <p className="text-pink-400 text-lg font-bold">{task}</p>
        </div>
    )
}