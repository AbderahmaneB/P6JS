"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInfo, getUserActivity } from "@/services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Comment améliorer mon endurance ?",
  "Que signifie mon score de récupération ?",
  "Peux-tu m'expliquer mon dernier graphique ?",
];

const MAX_INPUT_LENGTH = 1000;

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5">
      <path d="M19 9L20.25 6.25L23 5L20.25 3.75L19 1L17.75 3.75L15 5L17.75 6.25L19 9Z" fill="#FF6B6B"/>
      <path d="M19 15L17.75 17.75L15 19L17.75 20.25L19 23L20.25 20.25L23 19L20.25 17.75L19 15Z" fill="#FF6B6B"/>
      <path d="M11.5 9.5L9 4L6.5 9.5L1 12L6.5 14.5L9 20L11.5 14.5L17 12L11.5 9.5Z" fill="#FF6B6B"/>
    </svg>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF4444] text-white text-[14px] font-bold shrink-0">
        +
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-[#74798C] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState("U");
  const [userData, setUserData] = useState<{ firstName?: string; totalDistance?: number; recentSessions?: { date: string; distance: number; duration: number }[] } | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (!user?.token) return;
    const token = user.token;
    getUserInfo(token).then(async (info) => {
      setProfilePicture(info.profile.profilePicture ?? null);
      setUserInitial(info.profile.firstName?.[0]?.toUpperCase() ?? "U");
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const start = threeMonthsAgo.toISOString().split("T")[0];
      const end = new Date().toISOString().split("T")[0];
      const sessions = await getUserActivity(token, start, end).catch(() => []);
      setUserData({
        firstName: info.profile.firstName,
        totalDistance: info.statistics.totalDistance,
        recentSessions: sessions.slice(0, 10).map((s) => ({ date: s.date, distance: s.distance, duration: s.duration })),
      });
    }).catch(() => {});
  }, [user?.token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userData }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Une erreur est survenue.");
        setIsLoading(false);
        return;
      }

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Erreur réseau, veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  }

  return (
    <div className="flex h-screen flex-col bg-white">

      <div className="flex items-center justify-end px-8 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[14px] text-[#74798C] hover:text-[#20253A]"
        >
          Fermer
          <span className="ml-1">{hasMessages ? "✕" : "›"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        {!hasMessages && !isLoading && (
          <div className="flex h-full items-start justify-center pt-16">
            <h1 className="max-w-lg text-center text-[22px] font-semibold text-[#0B23F4]">
              Posez vos questions sur votre programme,{" "}
              vos performances ou vos objectifs
            </h1>
          </div>
        )}

        <div className="mx-auto max-w-2xl flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
              {msg.role === "assistant" && (
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <span className="text-[11px] text-[#74798C] ml-1">Coach AI</span>
                  <div className="rounded-2xl rounded-tl-sm bg-[#F2F3F5] px-5 py-4 text-[14px] leading-relaxed text-[#20253A] whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              )}
              {msg.role === "user" && (
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="rounded-2xl rounded-tr-sm bg-[#FFE8E8] px-5 py-3 text-[14px] text-[#20253A]">
                    {msg.content}
                  </div>
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#C9CBFF] flex items-center justify-center text-[11px] text-[#0B23F4] font-bold">
                    {profilePicture ? (
                      <img src={profilePicture} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      userInitial
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <LoadingDots />
            </div>
          )}

          {error && (
            <p className="text-center text-[13px] text-red-500">{error}</p>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="px-8 pb-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[#E8E8F0] bg-white px-4 py-3 shadow-sm">
            <div className="flex items-start gap-3">
              <SparkleIcon />
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Comment puis-je vous aider ?"
                maxLength={MAX_INPUT_LENGTH}
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none bg-transparent text-[14px] text-[#20253A] outline-none placeholder:text-[#74798C] disabled:opacity-50"
                style={{ minHeight: "24px", maxHeight: "160px" }}
              />
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B23F4] text-white hover:bg-[#0919C5] disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={isLoading}
                className="rounded-xl border border-[#E8E8F0] bg-[#F2F3FF] px-3 py-3 text-left text-[12px] text-[#74798C] hover:border-[#0B23F4] hover:text-[#0B23F4] disabled:opacity-50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
