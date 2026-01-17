type PropsProgresso = {
    children?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  width?: string;
  
}

export default function StatusCard({
  title,
  icon, children, width
}: PropsProgresso) {
  return (
    <div className={` bg-white p-6 rounded-lg shadow-md  border-2  border-pink-200 h-[18em] gap-4 flex flex-col hover:shadow-lg transition hover:border-pink-300 hover:scale-[1.0] hover:duration-300 hover:ease-in-out hover:z-10 hover:cursor-pointer hover:-translate-y-1 md:w-full ${width} `}>
      <div className="flex text-pink-400 items-center gap-2">
        {icon}
        <h2 className="text-pink-400 text-[1.2em] font-bold md:text-[1.4em]">{title}</h2>
      </div>
      {children}
    </div>
  );
}
