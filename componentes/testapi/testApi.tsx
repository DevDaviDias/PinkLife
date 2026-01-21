// pages/testUser.tsx
import { useEffect, useState } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices";

// --- DEFINIÇÃO DE TIPOS PRECISOS (Substituindo o 'any') ---
interface Tarefa {
  titulo: string;
  horario: string;
}

interface Materia {
  id: string;
  nome: string;
  metaHoras: number;
  horasEstudadas: number;
}

interface Historico {
  id: string;
  materia: string;
  duracaoSegundos: number;
  data: string;
}

interface UserProgress {
  estudos?: {
    materias: Materia[];
    historico: Historico[];
  };
  treinos?: Array<{
    id: string;
    nome: string;
    exercicios: string[];
  }>;
  dashboard?: {
    agenda?: { tarefas: Tarefa[] };
    habitos?: Record<string, string>;
  };
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
      } catch (err: unknown) {
        // Tratamento correto do erro sem usar 'any' no catch
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response: { data: { msg: string } } };
          setError(axiosError.response.data.msg);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido ao buscar usuário");
        }
      }
    }
    fetchUser();
  }, []);

  if (error) return (
    <div className="p-10 text-red-500 bg-red-50 rounded-xl m-4 border border-red-200">
      <h1 className="font-bold text-xl mb-2">❌ Erro de Autenticação</h1>
      <p className="text-sm font-mono bg-white p-2 rounded border">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all font-bold"
      >
        Tentar novamente
      </button>
    </div>
  );

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      <p className="text-pink-500 font-medium animate-pulse">Sincronizando com MongoDB Atlas...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans bg-white min-h-screen">
      <header className="flex justify-between items-end border-b-2 border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Debug Panel 🛡️</h1>
          <p className="text-gray-400 text-sm mt-1">Verificando integridade dos dados no Banco de Dados</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Usuário Ativo</p>
          <p className="font-bold text-pink-500">{user.name} <span className="text-gray-300 font-normal">({user.email})</span></p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: JSON Visualizador */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-black text-gray-400 uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Live Database Snapshot
          </h2>
          <div className="bg-gray-900 text-pink-300 p-6 rounded-[2rem] overflow-auto max-h-[600px] text-xs font-mono shadow-2xl border-4 border-gray-800">
            <pre>{JSON.stringify(user.progress, null, 2)}</pre>
          </div>
        </div>

        {/* Lado Direito: Resumo de Módulos */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-gray-400 uppercase mb-4">Estatísticas de Cache</h2>
          
          <StatCard title="Estudos" icon="📚" value={user.progress.estudos?.materias?.length || 0} unit="matérias" />
          <StatCard title="Treinos" icon="🏋️" value={user.progress.treinos?.length || 0} unit="fichas" />
          <StatCard title="Histórico" icon="🕒" value={user.progress.estudos?.historico?.length || 0} unit="sessões" />
          
          <div className="mt-8 p-6 bg-pink-50 rounded-[2rem] border-2 border-pink-100">
             <h3 className="font-bold text-pink-600 mb-2">Status do Atlas</h3>
             <p className="text-xs text-pink-400 leading-relaxed">
               Os dados exibidos acima estão persistidos no Cluster 0. O reinício do servidor Node não afetará esses valores.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente interno para os cards de estatística
function StatCard({ title, icon, value, unit }: { title: string, icon: string, value: number, unit: string }) {
  return (
    <div className="bg-white border-2 border-gray-50 p-6 rounded-3xl hover:border-pink-100 transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-3xl font-black text-gray-800">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
    </div>
  );
}