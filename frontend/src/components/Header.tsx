"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const linkClass = (href: string) =>
    `cursor-pointer text-[13px] font-medium transition-colors ${
      pathname === href
        ? "text-[#0B23F4]"
        : "text-[#20253A] hover:text-[#0B23F4]"
    }`;

  return (
    <header className="flex items-center justify-between px-[10%] py-5">
      <Logo />
      <nav className="flex items-center gap-6 rounded-full bg-white px-6 py-2.5">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/chat" className={linkClass("/chat")}>
          Coach AI
        </Link>
        <Link href="/profile" className={linkClass("/profile")}>
          Mon profil
        </Link>
        <span className="h-5 w-px bg-[#D9D9D9]" />
        <button
          onClick={handleLogout}
          className="cursor-pointer text-[13px] font-medium text-[#0B23F4] transition-colors hover:text-[#0919C5]"
        >
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
