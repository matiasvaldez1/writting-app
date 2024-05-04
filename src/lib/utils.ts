import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeUsername(username: string): string {
  const words = username.split(' ');
  
  const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return capitalizedWords.join(' ');
}
