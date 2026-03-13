import type { Context } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const prompt = body.contents?.[0]?.parts?.[0]?.text;
    const systemInstruction = body.systemInstruction?.parts?.[0]?.text;
    const schema = body.generationConfig?.responseSchema;
    const model = body.model || 'gemini-2.5-pro';

    if (!prompt) {
      return new Response('Missing prompt', { status: 400 });
    }

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (schema) {
      config.responseMimeType = "application/json";
      config.responseSchema = schema;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });

    // Match the response shape the client expects:
    // data.candidates[0].content.parts[0].text
    return Response.json({
      candidates: [{
        content: {
          parts: [{ text: response.text }]
        }
      }]
    });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export const config = {
  path: '/api/gemini',
};