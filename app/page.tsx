"use client";
import Dashboard from "@/componentes/dashboard";
import Menuhamburguer from "@/componentes/Menuhamburguer";
import Desenvolvimento from "@/componentes/Desenvolvimento";
 import { useState } from "react";

export default function Home() {
  const [sessao , setSessao] = useState("dashboard");

  function headlessChangeSessao(sessaoEscolhida: string) {
    setSessao(sessaoEscolhida);
  }
  return (
    <>

   
    <div className="fixed top-0 left-0 h-full">
    <Menuhamburguer onChangeSessao={headlessChangeSessao} />

    </div>
    {sessao === "dashboard" && <Dashboard />}
    {sessao === "desenvolvimento" && <Desenvolvimento />}
    {sessao === "estudos" && <Desenvolvimento />}
    {sessao === "treino" && <Desenvolvimento />}
    {sessao === "habitos" && <Desenvolvimento />}
    {sessao === "financas" && <Desenvolvimento />}
    {sessao === "beleza" && <Desenvolvimento />}
    {sessao === "casa_rotina" && <Desenvolvimento />}
    {sessao === "saude" && <Desenvolvimento />}
    {sessao === "alimentacao" && <Desenvolvimento />}

      
    </>
  );
}
