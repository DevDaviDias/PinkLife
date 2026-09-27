import Image from "next/image";
import TitleSection from "./Title";
import { ReactNode } from "react";

interface HeaderSectionProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode;
}

export default function Cabecalho({
  title,
  imageSrc = "/images/hello-kitty-dashboard.jpg",
  imageAlt = "Dashboard Image",
  children,
}: HeaderSectionProps) {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-[2rem] border border-pink-100
        bg-white/70 backdrop-blur-sm
        px-5 py-4 md:px-8 md:py-6
        shadow-sm shadow-pink-100
      "
    >
      <div>
        <TitleSection title={title} />

        {/* Aqui fica dinâmico */}
        {children && (
          <div className="mt-1 text-sm font-medium text-pink-400">
            {children}
          </div>
        )}
      </div>

      <div>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={90}
          height={90}
          className="animate-pulse-soft h-[70px] w-[70px] rounded-full border-4 border-pink-400 object-cover shadow-md shadow-pink-200 md:h-[90px] md:w-[90px]"
        />
      </div>
    </div>
  );
}
