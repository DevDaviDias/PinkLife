interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      
      {/* Content - sem altura fixa, se ajusta ao conteúdo */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}