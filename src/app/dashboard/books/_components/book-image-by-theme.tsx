"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

export default function BookImageByTheme() {
  const { theme } = useTheme();

  const themeMode = theme;

  if (themeMode === "dark") {
    return (
      <Image
        src={"/book-default-icon-white.png"}
        alt="Book icon"
        width={300}
        height={300}
      />
    );
  }
  return (
    <Image
      src={"/book-default-icon.png"}
      alt="Book icon"
      width={300}
      height={300}
    />
  );
}
