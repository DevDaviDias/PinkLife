"use client";

import { useState } from "react";
import axios from "axios";
import { User as IconUser, Mail as IconMail, Lock as IconLock, Eye, EyeOff } from "lucide-react";

interface RegisterProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function Register({
  onRegisterSuccess,
  onSwitchToLogin,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmpassword) {
      setError("As senhas não conferem");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        confirmpassword,
      });

      setSuccess(response.data.msg || "Cadastro realizado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.msg || "Erro ao tentar cadastrar");
      } else {
        setError("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-4xl font-extrabold text-pink-600 text-center mb-1">Cadastro🎀</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400 text-center mb-6">
         Crie sua conta Pink Life
        </p>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-sm">{success}</p>}
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconUser size={20} />
          </span>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
           className="w-full mb-5 pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
          required
        />
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconUser size={20} />
          </span>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full  mb-5 pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
          required
        />
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconUser size={20} />
          </span>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full  mb-5 pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
          required
        />
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconUser size={20} />
          </span>
        <input
          type="password"
          placeholder="Confirme a senha"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full  mb-5 pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
        />

        <button
          type="submit"
          disabled={loading}
         className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 hover:text-pink-100 active:bg-pink-700 active:scale-95 transition duration-200 ease-in-out shadow-md disabled:opacity-60 disabled:cursor-not-allowed mb-1"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        {onSwitchToLogin && (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full mt-4 text-sm text-blue-600 hover:underline"
          >
            Já tenho conta
          </button>
        )}
      </form>
    </div>
  );
}