"use client";

import { useState } from "react";
import axios from "axios";
import { User as IconUser, Mail as IconMail, Lock as IconLock, Eye, EyeOff } from "lucide-react";

interface RegisterProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!API_URL) {
      setError("URL da API não configurada");
      return;
    }

    if (password !== confirmpassword) {
      setError("As senhas não conferem");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      setSuccess(response.data.msg || "Cadastro realizado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      onRegisterSuccess?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.msg || `Erro ${err.response?.status || ""}: não foi possível cadastrar`);
      } else {
        setError("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  // Input de senha com olho
  const PasswordInput = ({
    value,
    onChange,
    placeholder,
    show,
    toggleShow,
    icon,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    show: boolean;
    toggleShow: () => void;
    icon: React.ReactNode;
  }) => (
    <div className="relative w-full mb-4">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">{icon}</span>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out pr-12"
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600"
        tabIndex={-1}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm z-10">
        <h1 className="text-4xl font-extrabold text-pink-600 text-center mb-1">Cadastro 🎀</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400 text-center mb-6">Crie sua conta Pink Life</p>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-sm">{success}</p>}

        {/* Nome */}
        <div className="relative w-full mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconUser size={20} />
          </span>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
            required
          />
        </div>

        {/* Email */}
        <div className="relative w-full mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500">
            <IconMail size={20} />
          </span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 p-3 border-2 border-pink-400 rounded-xl text-gray-800 placeholder:text-gray-400 placeholder:italic focus:border-pink-600 focus:text-pink-600 focus:placeholder-pink-300 hover:border-pink-500 outline-none shadow-sm focus:shadow-md transition duration-300 ease-in-out"
            required
          />
        </div>

        {/* Senha */}
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          show={showPassword}
          toggleShow={() => setShowPassword(!showPassword)}
          icon={<IconLock size={20} />}
        />

        {/* Confirmação de senha */}
        <PasswordInput
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a senha"
          show={showConfirmPassword}
          toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          icon={<IconLock size={20} />}
        />

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 hover:text-pink-100 active:bg-pink-700 active:scale-95 transition duration-200 ease-in-out shadow-md disabled:opacity-60 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        {/* Link para login */}
        {onSwitchToLogin && (
          <p className="text-center text-sm">
            Já tem conta?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
              Entre aqui
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
