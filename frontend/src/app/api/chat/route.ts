import { NextRequest, NextResponse } from "next/server";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MAX_USER_MESSAGE_LENGTH = 1000;

function buildSystemPrompt(userData?: {
  firstName?: string;
  totalDistance?: number;
  recentSessions?: { date: string; distance: number; duration: number }[];
}): string {
  let prompt = `Tu es SportCoach, un coach sportif IA expert en course à pied et entraînement physique.
Tu donnes des conseils personnalisés, bienveillants et basés sur des données scientifiques.
Tu réponds toujours en français, de façon concise et pratique.
Tu ne traites que les sujets liés au sport, à la nutrition sportive, à la récupération et à la santé physique.
Si une question est hors sujet, redirige poliment l'utilisateur vers les sujets sportifs.`;

  if (userData?.firstName) {
    prompt += `\n\nTu parles à ${userData.firstName}.`;
  }

  if (userData?.totalDistance) {
    prompt += `\nDistance totale parcourue : ${userData.totalDistance} km.`;
  }

  if (userData?.recentSessions && userData.recentSessions.length > 0) {
    const last10 = userData.recentSessions.slice(0, 10);
    prompt += `\nSes 10 dernières séances :\n`;
    last10.forEach((s) => {
      prompt += `- ${s.date} : ${s.distance} km en ${s.duration} min\n`;
    });
  }

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey || apiKey === "your_mistral_api_key_here") {
      return NextResponse.json(
        { error: "Clé API Mistral non configurée." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, userData } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages invalides." }, { status: 400 });
    }

    const sanitized = messages
      .filter((m: { role: string; content: string }) =>
        ["user", "assistant"].includes(m.role) &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
      )
      .map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content.slice(0, MAX_USER_MESSAGE_LENGTH),
      }));

    const recentMessages = sanitized.slice(-10);

    const systemPrompt = buildSystemPrompt(userData);

    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages,
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[chat] Mistral error:", err);
      return NextResponse.json(
        { error: "Erreur de l'API Mistral." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] Unexpected error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
