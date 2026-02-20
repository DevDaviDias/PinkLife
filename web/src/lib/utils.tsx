import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina múltiplas classes do Tailwind de forma segura,
 * evitando conflitos e duplicações de classes.
 *
 * @param inputs - array de classes ou expressões condicionais
 * @returns string com as classes mescladas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
