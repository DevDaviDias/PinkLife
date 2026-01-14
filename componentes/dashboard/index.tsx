import DateComponent from "../ui/date";
import Image from "next/image";
import TitleSection from "@/componentes/ui/TitleSection"; 

export default function Dashboard() {
  return (
  <div>

    <TitleSection title="Olá! Bem-vinda de volta!" />
    <DateComponent />
    <Image
      src="/images/hello-kitty-dashboard.jpg"
      alt="Dashboard Image"
      width={100}
      height={400}
    />

    
    </div>
)}