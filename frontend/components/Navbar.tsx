"use client";
import { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed font-mono top-10 inset-x-0 max-w-2xl mx-auto z-50")}
    >
      <Menu setActive={setActive}>
        <Link href={"/"}>
          <MenuItem
            setActive={setActive}
            item="Home"
            active={active}
          ></MenuItem>
        </Link>
        <MenuItem setActive={setActive} item="Features" active={active}>
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/courses">Generate Password</HoveredLink>
            <HoveredLink href="/courses">Show all Passwords</HoveredLink>
            <HoveredLink href="/courses">Save a new Password</HoveredLink>
          </div>
        </MenuItem>
        <Link href={"/Profile"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Profile"
          ></MenuItem>
        </Link>
      </Menu>
    </div>
  );
}
