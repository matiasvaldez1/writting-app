import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="flex flex-col text-center md:text-inherit md:flex-row md:justify-evenly p-32">
      <div className="flex flex-col gap-8">
        <Link href={"/"}>
          <Button variant="link">How it works</Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">FAQ</Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">Contact</Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">Terms of Service</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-8">
        <Link href={"/"}>
          <Button variant="link">Lorem ipsum dolor sit </Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">Lorem ipsum dolor sit amet.</Button>
        </Link>
      </div>
    </div>
  );
}
