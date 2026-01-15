type PropsProgresso = {
    children?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
}

export default function StatusCard({
  title,
  icon, children
}: PropsProgresso) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[44em] border-2  border-pink-200 h-[15em] gap-4 flex flex-col hover:shadow-lg transition hover:border-pink-300 hover:scale-[1.0] hover:duration-300 hover:ease-in-out hover:z-10 hover:cursor-pointer hover:-translate-y-1 ">
      <div className="flex text-pink-400 items-center gap-2">
        {icon}
        <h2 className="text-pink-400 text-[1em] font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
