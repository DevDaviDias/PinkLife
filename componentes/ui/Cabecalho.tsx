import Image from "next/image";
import TitleSection from "./Title";
import { ReactNode } from "react";

interface HeaderSectionProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode; // 👈 conteúdo variável
}

export default function Cabecalho({
  title,
  imageSrc = "/images/hello-kitty-dashboard.jpg",
  imageAlt = "Dashboard Image",
  children,
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <TitleSection title={title} />

        {/* Aqui fica dinâmico */}
        {children && <div className="mt-1">{children}</div>}
      </div>

      <div>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={50}
          height={200}
          className="rounded-full mt-4 mb-4 animate-bounce"
        />
      </div>
    </div>
  );
}
