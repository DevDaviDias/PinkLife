import DateComponent from "../ui/date";
import Image from "next/image";

export default function Dashboard() {
  return (
  <div>
    <h2>Olá! Bem vindo de volta!🌸</h2>
    <DateComponent />
    <Image
      src="/images/hello-kitty-dashboard.jpg"
      alt="Dashboard Image"
      width={100}
      height={400}
    />

    
    </div>
)}