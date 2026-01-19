"use client";



import { useState } from "react";
import axios from "axios";
import { loginUser } from "@/componentes/services/APIservices";
import { User as IconUser, Lock as IconLock } from "lucide-react";


interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      onLoginSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.msg || "Erro ao tentar logar");
      } else {
        setError("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      
      
   

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm z-10"
      >
        {/* Título */}
        <h1 className="text-4xl font-extrabold text-pink-600 text-center mb-1">
          Pink Life💓
        </h1>
        <p className="text-xs uppercase tracking-widest text-gray-400 text-center mb-6">
          Acesse sua conta
        </p>

        {/* Erro */}
        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        {/* Input Email */}
        <div className="relative w-full mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconUser size={20} />
          </span>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
            required
          />
        </div>

        {/* Input Senha */}
        <div className="relative w-full mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconLock size={20} />
          </span>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
            required
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 hover:text-pink-100 active:bg-pink-700 active:scale-95 transition duration-200 ease-in-out shadow-md disabled:opacity-60 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {/* Link de registro */}
        <p className="text-center text-sm">
          Não tem cadastro?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  );
}
