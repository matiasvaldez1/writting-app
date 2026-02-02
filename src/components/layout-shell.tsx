"use client";

import { usePathname } from "next/navigation";

export default function LayoutShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditor = pathname.includes("/editor");

  if (isEditor) {
    return <main className="min-h-svh">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="min-h-[80svh] pt-6 md:pt-10">{children}</main>
      {footer}
    </>
  );
}
