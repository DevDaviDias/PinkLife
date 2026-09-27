type PropsProgresso = {
  icon?: React.ReactNode;
  title: string;
  porcentagem?: number | string;
  progressoDodia?: string;
  progresso?: number | string;
  barraDeProgresso?: boolean | string;
  className?: string;
  valor?: string | number;
  cor?: string;
};

export default function Cardprogresso({
  title,
  progressoDodia,
  progresso,
  barraDeProgresso,
  icon,
  porcentagem,
  className,
  valor,
  cor = "#ec4899", // rosa padrão, igual ao app mobile
}: PropsProgresso) {
  const progressoNumber = Math.min(Math.max(Number(progresso) || 0, 0), 100);

  return (
    <div
      className="
        group w-full rounded-[1.25rem] border-[1.5px] border-pink-100
        bg-white p-4 shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg md:p-5
      "
      style={{ boxShadow: "0 4px 14px -6px rgba(236, 72, 153, 0.15)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.6rem]"
          style={{ backgroundColor: `${cor}20` }}
        >
          {icon}
        </span>
        <h2
          className="text-[1.05em] font-extrabold md:text-[1.2em]"
          style={{ color: cor }}
        >
          {title}
        </h2>
      </div>

      {(porcentagem !== undefined || valor !== undefined) && (
        <div className="mt-2 font-bold">
          {porcentagem !== undefined && (
            <p className={className} style={!className ? { color: cor } : undefined}>
              {porcentagem}
            </p>
          )}
          {valor !== undefined && <p style={{ color: cor }}>{valor}</p>}
        </div>
      )}

      {progressoDodia && (
        <p className="mb-1 mt-2 text-[0.9em] font-medium text-gray-400">
          {progressoDodia}
        </p>
      )}

      {barraDeProgresso && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-pink-100">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressoNumber}%`, backgroundColor: cor }}
          />
        </div>
      )}
    </div>
  );
}
