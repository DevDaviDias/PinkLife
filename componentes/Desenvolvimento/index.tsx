import Image from "next/image";

export default function Desenvolvimento({}) {
  return (
    <div className="flex flex-col gap-4 ml-[17em] mt-8 text-center items-center justify-center">
        <Image src="/images/hello-kitty-dashboard_variant_1.jpg" alt="Logo" width={50} height={50} className="animate-bounce rounded-[50%]"/>
      <h2 className="text-pink-400 text-2xl font-bold">Em Desenvolvimento🌸</h2>
      <p className="w-[44em]">
        Estamos constantemente trabalhando para melhorar sua experiência no
        PinkLife. Novos recursos e melhorias estão a caminho!
      </p>
    </div>
  );
}