"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react"; // Ícone de carregamento

export default function ConfirmarLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("validando"); // 'validando', 'sucesso', 'erro'

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      axios.post(`${API_URL}/auth/verify-magic-link`, { token, email })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          setStatus("sucesso");
          // Redireciona após 2 segundos para a pessoa ver o sucesso
          setTimeout(() => {
            window.location.href = "/"; // Ou sua rota de dashboard
          }, 2000);
        })
        .catch(() => {
          setStatus("erro");
        });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <h1 className="text-3xl font-extrabold text-pink-600 mb-6">Pink Life💓</h1>

        {status === "validando" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-pink-500" size={40} />
            <p className="text-gray-600">Validando seu acesso, aguarde...</p>
          </div>
        )}

        {status === "sucesso" && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">✅</div>
            <p className="text-green-600 font-bold">Acesso confirmado! Bem-vinda de volta. ✨</p>
          </div>
        )}

        {status === "erro" && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600">❌</div>
            <p className="text-red-600 font-bold">O link expirou ou é inválido.</p>
            <button 
              onClick={() => router.push("/login")}
              className="mt-4 text-pink-600 underline text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}