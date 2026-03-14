import { NextRequest, NextResponse } from "next/server";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface TrainingSession {
  day: string;
  name: string;
  description: string;
  duration: number;
}

export interface TrainingWeek {
  week: number;
  sessions: TrainingSession[];
}

export interface TrainingPlan {
  weeks: TrainingWeek[];
}

function buildPrompt(objective: string, startDate: string): string {
  return `Tu es un coach sportif expert en course à pied. Génère un programme d'entraînement de 6 semaines.

Objectif de l'utilisateur : ${objective}
Date de début : ${startDate}

Génère un plan structuré avec 3 à 4 séances par semaine réparties sur différents jours (ex: Lundi, Mercredi, Vendredi, Dimanche).
Chaque séance doit avoir un nom d'exercice, une description courte (techniques, postures) et une durée en minutes.

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après, respectant exactement ce format :
{
  "weeks": [
    {
      "week": 1,
      "sessions": [
        {
          "day": "Lundi",
          "name": "Nom de l'exercice",
          "description": "description courte",
          "duration": 30
        }
      ]
    }
  ]
}

Génère exactement 6 semaines. Progressive en intensité. Adapté à l'objectif fourni.`;
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
    const { objective, startDate } = body;

    if (!objective || typeof objective !== "string" || objective.trim().length === 0) {
      return NextResponse.json({ error: "Objectif manquant." }, { status: 400 });
    }

    if (!startDate || typeof startDate !== "string") {
      return NextResponse.json({ error: "Date de début manquante." }, { status: 400 });
    }

    const prompt = buildPrompt(
      objective.slice(0, 200),
      startDate
    );

    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[training-plan] Mistral error:", err);
      return NextResponse.json(
        { error: "Erreur de l'API Mistral." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";

    let plan: TrainingPlan;
    try {
      plan = JSON.parse(content) as TrainingPlan;
      if (!plan.weeks || !Array.isArray(plan.weeks)) {
        throw new Error("Format invalide");
      }
    } catch {
      console.error("[training-plan] Invalid JSON from Mistral:", content);
      return NextResponse.json(
        { error: "Le plan généré est invalide, réessayez." },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("[training-plan] Unexpected error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
