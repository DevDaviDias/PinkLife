type PropsProgresso = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  width?: string;
  headerAction?: React.ReactNode; // Adicionado como OPCIONAL (?)
}

export default function StatusCard({
  title,
  icon, 
  children, 
  width,
  headerAction // Destructuring aqui
}: PropsProgresso) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-2 border-pink-200 h-[18em] gap-4 flex flex-col hover:shadow-lg transition hover:border-pink-300 hover:scale-[1.0] hover:duration-300 hover:ease-in-out hover:z-10 hover:cursor-pointer hover:-translate-y-1 md:w-full ${width}`}>
      
      {/* Container do Título e Ícone */}
      <div className="flex text-pink-400 items-center justify-between"> 
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-pink-400 text-[1.2em] font-bold md:text-[1.4em]">{title}</h2>
        </div>

        {/* Se houver uma ação (botão), ela aparece aqui no canto direito */}
        {headerAction && <div>{headerAction}</div>}
      </div>

      {children}
    </div>
  );
}