"use client";

import { useEffect, useState } from "react";
import Login from "@/componentes/Login";
import Register from "@/componentes/Login/register";
import DashboardModule from "@/componentes/DashboardModule";

type AuthState = "checking" | "login" | "register" | "authenticated";

export default function AuthGate() {
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
  async function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthState("login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Token inválido");
      }

      setAuthState("authenticated");
    } catch (error) {
      localStorage.removeItem("token");
      setAuthState("login");
    }
  }

  checkAuth();
}, []);


  if (authState === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (authState === "login") {
    return (
      <Login
        onLoginSuccess={() => setAuthState("authenticated")}
        onSwitchToRegister={() => setAuthState("register")}
      />
    );
  }

  if (authState === "register") {
    return (
      <Register
        onRegisterSuccess={() => setAuthState("login")}
        onSwitchToLogin={() => setAuthState("login")}
      />
    );
  }

  return <DashboardModule />;
}

