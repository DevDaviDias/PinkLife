"use client";

import { useState } from "react";
import Dashboard from "@/src/features/dashboard";
import MenuHamburguer from "@/src/features/Menuhamburguer";
import MenuMobile from "@/src/componentes/ui/MenuMobile";
import Estudos from "@/src/features/Estudos";
import Saude from "@/src/features/Saude";
import Diario from "@/src/features/Diario";
import CasaERotina from "@/src/features/CasaERotina";
import Alimentacao from "@/src/features/Alimentacao";
import Treino from "@/src/features/Treino";
import Habitos from "@/src/features/Habitos";
import Financas from "@/src/features/Financas";
import Beleza from "@/src/features/Beleza";
import Configuracao from "@/src/features/Configuracao";

export default function DashboardModule() {
  const [sessao, setSessao] = useState("dashboard");

  function headlessChangeSessao(sessaoEscolhida: string) {
    setSessao(sessaoEscolhida);
  }

  return (
    <>
      {/* Menu Desktop */}
      <MenuHamburguer onChangeSessao={headlessChangeSessao} />

      {/* Menu Mobile */}
      <MenuMobile onChangeSessao={headlessChangeSessao} />

      {/* Conteúdo */}
      <main className="lg:ml-[17em] pb-[5.5em]">
        {sessao === "dashboard" && <Dashboard />}
        {sessao === "estudos" && <Estudos />}
        {sessao === "treino" && <Treino />}
        {sessao === "habitos" && <Habitos />}
        {sessao === "financas" && <Financas />}
        {sessao === "beleza" && <Beleza />}
        {sessao === "casa_rotina" && <CasaERotina />}
        {sessao === "saude" && <Saude />}
        {sessao === "diario" && <Diario />}
        {sessao === "alimentacao" && <Alimentacao />}
        {sessao === "Configuracao" && <Configuracao/>}
      </main>
    </>
  );
}
