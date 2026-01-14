import Dashboard from "@/componentes/dashboard";
import Menuhamburguer from "@/componentes/Menuhamburguer";
import Desenvolvimento from "@/componentes/Desenvolvimento";

export default function Home() {
  return (
    <>
    <div className="fixed top-0 left-0 h-full">
    <Menuhamburguer />
    </div>
      <Dashboard />
      <Desenvolvimento />
      
    </>
  );
}
