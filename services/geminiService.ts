
import { VerificationResult, GroundingSource } from "../types";

export const verifyText = async (text: string): Promise<VerificationResult> => {
  const API_KEY = process.env.VITE_API_KEY || process.env.API_KEY;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "VeriAI Fact Checker",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001", // Verified ID from OpenRouter
      messages: [
        {
          role: "system",
          content: `You are a fact-checking assistant. Analyze the text for factual accuracy.
          Extract claims and categorize them as 'verified', 'uncertain', or 'hallucination'.
          Return the response strictly in JSON format with the following structure:
          {
            "overallScore": number (0-100),
            "claims": [
              {
                "text": "the claim",
                "status": "verified" | "uncertain" | "hallucination",
                "explanation": "why",
                "confidence": number (0-1),
                "supportingEvidence": "optional source info"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `TEXT TO VERIFY:\n"${text}"`
        }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch (e) {
      // Fallback if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "OpenRouter returned an error");
  }

  const choice = data.choices?.[0];
  if (!choice || !choice.message?.content) {
    throw new Error("No response content from OpenRouter");
  }

  const parsed = JSON.parse(choice.message.content);

  // Note: OpenRouter's standard response doesn't include the same grounding metadata as Gemini SDK's native search tool.
  // We will assume sources are provided in the explanation or supportingEvidence if available, 
  // or leave them empty for now since we're switching backends.
  const sources: GroundingSource[] = [];

  return {
    originalText: text,
    overallScore: parsed.overallScore,
    claims: parsed.claims.map((c: any, i: number) => ({ ...c, id: `claim-${i}` })),
    sources: sources
  };
};
