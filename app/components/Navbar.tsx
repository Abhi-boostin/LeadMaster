"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === href ? "bg-black/10 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
    }`;

  return (
    <nav className="w-full sticky top-0 z-30 border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          LeadMaster
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/auth/login" className={linkClass("/auth/login")}>Login</Link>
          <Link href="/auth/signup" className={linkClass("/auth/signup")}>Sign up</Link>
          <Link href="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
        </div>
      </div>
    </nav>
  );
} 