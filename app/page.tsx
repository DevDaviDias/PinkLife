"use client";

import { useState } from "react";
import Dashboard from "@/componentes/dashboard";
import MenuHamburguer from "@/componentes/Menuhamburguer";
import MenuMobile from "@/componentes/ui/MenuMobile";
import Estudos from "@/componentes/Estudos";
import Saude from "@/componentes/Saude";
import Viagens from "@/componentes/Viagens";
import CasaERotina from "@/componentes/CasaERotina";
import Alimentacao from "@/componentes/Alimentacao";
import Treino from "@/componentes/Treino";
import Habitos from "@/componentes/Habitos";
import Financas from "@/componentes/Financas";
import Beleza from "@/componentes/Beleza";
import Configuracoes from "@/componentes/Configuracao";

export default function Home() {
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
        {sessao === "viagens" && <Viagens />}
        {sessao === "alimentacao" && <Alimentacao />}
        {sessao === "Configuracao" && <Configuracoes/>}
      </main>
    </>
  );
}
