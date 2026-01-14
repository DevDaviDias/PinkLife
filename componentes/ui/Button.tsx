import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { useState, useEffect } from "react";


type ButtonProps = {
  icon?: React.ReactNode ;
  label: string;
  onClick?: () => void;
 
};

export default function Button({
  icon,
  label,
  onClick
}: ButtonProps) {
  return (
    <button onClick={onClick} className="bg-white text-black px-4 py-2  hover:bg-pink-300 hover:text-white transition flex items-center gap-2 rounded-[0.5em] w-full" >
     
      <span>{label} {icon} </span>
      
    </button>
  );
}
