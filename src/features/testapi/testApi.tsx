"use client";

import { useEffect, useState } from "react";
import { getLoggedUser } from "@/src/services/APIservices";

// --- INTERFACES SINCRONIZADAS ---
interface EntradaDiario {
  id: string;
  data: string;
  texto: string;
  humor: string;
  destaque: string;
  fotoUrl: string;
}

interface UserProgress {
  materias?: any[];
  historicoEstudos?: any[];
  tarefas?: any[];
  treinos?: any[];
  diario?: EntradaDiario[]; // Adicionado o Diário aqui
}

interface User {
  name: string;
  email: string;
  progress: UserProgress;
}

export default function TestUser() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getLoggedUser();
        setUser(data);
      } catch (err: any) {
        setError(err.response?.data?.msg || err.message || "Erro de conexão");
      }
    }
    fetchUser();
  }, []);

  if (error) return (
    <div className="p-10 text-red-500 bg-red-50 rounded-xl m-4 border border-red-200 max-w-2xl mx-auto">
      <h1 className="font-bold text-xl mb-2">❌ Erro de Sincronização</h1>
      <p className="font-mono bg-white p-4 rounded border mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-bold">
        Tentar Novamente
      </button>
    </div>
  );

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      <p className="text-pink-500 font-medium italic">Consultando MongoDB Atlas...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      <header className="flex justify-between items-end border-b-2 border-gray-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Debug Panel 🛡️</h1>
          <p className="text-gray-400 text-sm mt-1">Inspeção técnica dos dados do Cloudinary & MongoDB</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Usuário Logado</p>
          <p className="font-bold text-pink-500">{user.name} <span className="text-gray-300 font-normal">({user.email})</span></p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* COLUNA 1: JSON RAW */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-black text-gray-400 uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Raw JSON Output
          </h2>
          <div className="bg-gray-900 text-green-400 p-6 rounded-[2rem] overflow-auto max-h-[700px] text-[10px] font-mono shadow-2xl border-4 border-gray-800">
            <pre>{JSON.stringify(user.progress, null, 2)}</pre>
          </div>
        </div>

        {/* COLUNA 2: LISTA RÁPIDA DO DIÁRIO (NOVIDADE) */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-black text-gray-400 uppercase mb-4">Fotos no Cloudinary</h2>
          <div className="space-y-4 overflow-y-auto max-h-[700px] pr-2">
            {user.progress.diario && user.progress.diario.length > 0 ? (
              user.progress.diario.map((post) => (
                <div key={post.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  <img 
                    src={post.fotoUrl} 
                    alt="Cloudinary" 
                    className="w-full h-32 object-cover rounded-xl mb-2 bg-gray-100"
                    onError={(e) => {(e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Erro+na+Imagem"}}
                  />
                  <p className="text-[10px] font-bold text-pink-500 uppercase">{post.humor} {post.destaque}</p>
                  <p className="text-[9px] text-gray-400 truncate">{post.fotoUrl}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs italic">Nenhuma foto encontrada no diário.</p>
            )}
          </div>
        </div>

        {/* COLUNA 3: STATS */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-gray-400 uppercase mb-4">Resumo</h2>
          
          {/* Card do Diário com destaque rosa */}
          <div className="bg-pink-500 p-5 rounded-3xl shadow-lg shadow-pink-200 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">📖</span>
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80">Diário Rosa</h3>
            </div>
            <p className="text-3xl font-black">{user.progress.diario?.length || 0} <span className="text-xs font-normal opacity-80">memórias</span></p>
          </div>

          <StatCard title="Matérias" icon="📚" value={user.progress.materias?.length || 0} unit="registros" />
          <StatCard title="Tarefas" icon="📅" value={user.progress.tarefas?.length || 0} unit="itens" />
          <StatCard title="Histórico" icon="🕒" value={user.progress.historicoEstudos?.length || 0} unit="sessões" />
          
          <div className="p-6 bg-blue-50 rounded-[2rem] border-2 border-blue-100 mt-6">
             <h3 className="font-bold text-blue-600 mb-2 text-xs">Status da API</h3>
             <p className="text-[10px] text-blue-400 leading-relaxed">
                Render: <span className="text-blue-600 font-bold">Online</span><br/>
                DB: <span className="text-blue-600 font-bold">MongoDB Atlas</span><br/>
                Assets: <span className="text-blue-600 font-bold">Cloudinary</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, icon, value, unit }: { title: string, icon: string, value: number, unit: string }) {
  return (
    <div className="bg-white border-2 border-gray-100 p-5 rounded-3xl hover:border-pink-200 transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-2xl font-black text-gray-800">{value} <span className="text-xs font-normal text-gray-400">{unit}</span></p>
    </div>
  );
}