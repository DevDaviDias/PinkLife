// pages/testUser.tsx
import { useEffect, useState } from "react";
import { getLoggedUser } from "@/componentes/services/APIservices"; // ajuste o caminho se necessário

// --- TIPAGENS ---
interface UserProgress {
    dashboard?: {
        treino?: {
            exercicios?: string[];
            duracao?: string;
            dias?: string[];
        };
        agenda?: {
            tarefas?: { titulo: string; horario: string }[];
        };
        habitos?: {
            agua?: string;
            sono?: string;
            meditacao?: string;
        };
        metas?: { titulo: string; prazo: string }[];
        refeicoes?: {
            cafe?: string[];
            almoco?: string[];
            jantar?: string[];
        };
    };
}

interface User {
    name: string;
    email: string;
    progress: UserProgress;
}

// --- COMPONENTE ---
export default function TestUser() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");

   useEffect(() => {
  async function fetchUser() {
    try {
      const data: User = await getLoggedUser();
      setUser(data);
    } catch (err) {
      // Aqui garantimos que err é um Error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao buscar usuário");
      }
    }
  }

  fetchUser();
}, []);

    if (error) return <p>Erro: {error}</p>;
    if (!user) return <p>Carregando...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dados do Usuário</h1>
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <h2>Progresso</h2>
            <pre>{JSON.stringify(user.progress, null, 2)}</pre>
        </div>
    );
}
