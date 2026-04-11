import { NextResponse } from "next/server";
import type { AIInsightSections } from "@/lib/dashboardTypes";

type GeminiPart = {
  text?: string;
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[];
  };
  finishReason?: string;
};

type GeminiPromptFeedback = {
  blockReason?: string;
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
};

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const fallbackInsights: AIInsightSections = {
  summary: "AI insights are temporarily unavailable.",
  trends: [],
  keyObservations: [],
  recommendations: [],
};

const safeParseJson = <T,>(value: string): T => {
  const normalizedValue = value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(normalizedValue) as T;
};

const getCandidateText = (payload: GeminiResponse) =>
  payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim() ?? "";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "API is not configured. Add it to your environment to enable AI insights.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as {
      datasetSummary?: unknown;
      question?: string;
    };

    if (!body.datasetSummary) {
      return NextResponse.json(
        { error: "datasetSummary is required." },
        { status: 400 }
      );
    }

    const schema = body.question
      ? {
          type: "OBJECT",
          properties: {
            answer: {
              type: "STRING",
            },
          },
          required: ["answer"],
        }
      : {
          type: "OBJECT",
          properties: {
            summary: {
              type: "STRING",
            },
            trends: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },
            keyObservations: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },
            recommendations: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },
          },
          required: [
            "summary",
            "trends",
            "keyObservations",
            "recommendations",
          ],
        };

    const prompt = body.question
      ? [
          "You are an analytics copilot for a SaaS dashboard.",
          "Answer the user's question using only the provided dataset summary.",
          "Keep the answer concise, specific, and actionable.",
          `Question: ${body.question}`,
          `Dataset summary: ${JSON.stringify(body.datasetSummary)}`,
        ].join("\n\n")
      : [
          "You are an analytics copilot for a SaaS dashboard.",
          "Review the dataset summary and return a concise business readout.",
          "Focus on summary, trends, key observations, and recommendations.",
          `Dataset summary: ${JSON.stringify(body.datasetSummary)}`,
        ].join("\n\n");

    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "AI request failed.",
          details: responseText,
        },
        { status: 500 }
      );
    }

    const payload = JSON.parse(responseText) as GeminiResponse;

    if (payload.promptFeedback?.blockReason) {
      return NextResponse.json(
        {
          error: `Gemini blocked the request: ${payload.promptFeedback.blockReason}.`,
        },
        { status: 500 }
      );
    }

    const content = getCandidateText(payload);

    if (!content) {
      return NextResponse.json(
        {
          error:
            payload.candidates?.[0]?.finishReason === "SAFETY"
              ? "AI did not return content because the response was blocked."
              : "AI did not return any content.",
        },
        { status: 500 }
      );
    }

    if (body.question) {
      const parsed = safeParseJson<{ answer: string }>(content);

      return NextResponse.json({
        answer: parsed.answer,
      });
    }

    const parsed = safeParseJson<AIInsightSections>(content);

    return NextResponse.json({
      insights: {
        summary: parsed.summary ?? fallbackInsights.summary,
        trends: parsed.trends ?? [],
        keyObservations: parsed.keyObservations ?? [],
        recommendations: parsed.recommendations ?? [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while generating AI insights.",
      },
      { status: 500 }
    );
  }
}
