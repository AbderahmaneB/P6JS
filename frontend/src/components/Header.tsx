"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between px-[10%] py-5">
      <Logo />
      <nav className="flex items-center gap-6 rounded-full bg-white px-6 py-2.5">
        <span className="cursor-pointer text-[13px] font-medium text-[#20253A] transition-colors hover:text-[#0B23F4]">
          Dashboard
        </span>
        <span className="cursor-pointer text-[13px] font-medium text-[#20253A] transition-colors hover:text-[#0B23F4]">
          Coach AI
        </span>
        <span className="cursor-pointer text-[13px] font-medium text-[#20253A] transition-colors hover:text-[#0B23F4]">
          Mon profil
        </span>
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
