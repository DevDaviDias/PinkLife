"use client";

import { useEffect, useState } from "react";
import Login from "@/src/features/Login"
import Register from "@/src/features/Login/register";
import DashboardModule from "@/src/features/DashboardModule";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg animate-pulse">
            <span className="text-3xl">💓</span>
          </div>
          <p className="text-pink-600 font-bold text-lg">Carregando Pink Life...</p>
        </div>
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