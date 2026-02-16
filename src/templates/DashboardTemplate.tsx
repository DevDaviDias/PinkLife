"use client";
import MenuHamburguer from "@/src/features/Menuhamburguer";
import MenuMobile from "@/src/componentes/ui/MenuMobile";

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
 
  return (
    <>
      <MenuHamburguer onChangeSessao={(s) => console.log(s)} />
      <MenuMobile onChangeSessao={(s) => console.log(s)} />

      <main className="lg:ml-[17em] pb-[5.5em] p-6">
        {children} 
      </main>
    </>
  );
}