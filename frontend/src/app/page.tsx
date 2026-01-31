"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { token, userId } = await loginUser(username, password);
      login(token, userId);
      router.push("/dashboard");
    } catch {
      setError("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex w-full flex-col bg-[#f8f8fb] px-8 py-6 lg:w-1/2">
        {/* Logo */}
        <Logo />

        {/* Form container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
            <h1 className="mb-1 text-2xl font-bold leading-tight text-primary">
              Transformez
              <br />
              vos stats en résultats
            </h1>

            <h2 className="mb-8 mt-6 text-lg font-semibold text-text">
              Se connecter
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm text-text-light"
                >
                  Adresse email
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-text outline-none transition-colors focus:border-primary"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm text-text-light"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-text outline-none transition-colors focus:border-primary"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer rounded-full bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="mt-6 text-sm text-text-light cursor-pointer hover:text-primary transition-colors">
              Mot de passe oublié ?
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="/marathon.jpg"
          alt="Coureurs de marathon"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay bubble */}
        <div className="absolute bottom-8 right-8 max-w-xs rounded-full bg-white/80 px-6 py-3 text-xs text-text backdrop-blur-sm">
          Analysez vos performances en un clin d&apos;oeil, suivez vos progrès
          et atteignez vos objectifs.
        </div>
      </div>
    </div>
  );
}
