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
      <div className="flex w-full flex-col bg-[#ECEDF9] px-10 py-8 lg:w-1/2">
        <Logo />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px] rounded-2xl bg-white px-10 py-14">
            <h1 className="text-[28px] font-semibold leading-[1] text-[#0B23F4]">
              Transformez
              <br />
              vos stats en résultats
            </h1>

            <h2 className="mb-10 mt-10 text-[18px] font-semibold text-[#20253A]">
              Se connecter
            </h2>

            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-[13px] text-[#74798C]"
                >
                  Adresse email
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-[#DEDEDE] bg-white px-4 py-3.5 text-[14px] text-[#20253A] outline-none transition-colors focus:border-[#0B23F4]"
                  required
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] text-[#74798C]"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#DEDEDE] bg-white px-4 py-3.5 text-[14px] text-[#20253A] outline-none transition-colors focus:border-[#0B23F4]"
                  required
                />
              </div>

              {error && (
                <p className="mt-4 text-[13px] text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-10 w-full cursor-pointer rounded-[10px] bg-[#0B23F4] py-4 text-[14px] font-medium text-white transition-colors hover:bg-[#0919C5] disabled:opacity-60"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="mt-10 cursor-pointer text-[13px] text-[#74798C] transition-colors hover:text-[#0B23F4]">
              Mot de passe oublié ?
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="/marathon.jpg"
          alt="Coureurs de marathon"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-8 right-8 max-w-[280px] rounded-full bg-white/80 px-6 py-3 text-[11px] leading-[1.5] text-[#20253A] backdrop-blur-sm">
          Analysez vos performances en un clin d&apos;oeil, suivez vos progrès
          et atteignez vos objectifs.
        </div>
      </div>
    </div>
  );
}
