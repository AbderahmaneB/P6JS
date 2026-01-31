"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between bg-black px-6 py-4">
        <Logo className="[&_rect]:fill-white [&_span]:text-white" />
        <nav className="flex gap-8 text-sm text-white">
          <span className="cursor-pointer hover:text-gray-300">Accueil</span>
          <span className="cursor-pointer hover:text-gray-300">Profil</span>
          <span className="cursor-pointer hover:text-gray-300">Réglages</span>
          <span className="cursor-pointer hover:text-gray-300">Communauté</span>
        </nav>
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark"
        >
          Déconnexion
        </button>
      </header>

      {/* Main content */}
      <main className="p-8">
        <h1 className="text-4xl font-medium text-text">
          Bienvenue sur votre tableau de bord
        </h1>
        <p className="mt-4 text-text-light">
          Le dashboard complet avec les graphiques Recharts sera implémenté prochainement.
        </p>
      </main>
    </div>
  );
}
