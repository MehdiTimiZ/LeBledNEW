
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    // Safely access process.env to avoid ReferenceError in browsers that don't polyfill it
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
    
    if (!apiKey) {
      console.warn("API Key not found in environment variables");
      // Prevent crash if key is missing, though features will fail gracefully later
      throw new Error("API Key is missing");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const createChatSession = (): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({
      message: message
    });
    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export interface LocationResult {
  text: string;
  mapLink?: string;
  sourceTitle?: string;
}

export const searchLocation = async (query: string): Promise<LocationResult> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the specific location or address for: ${query}. Return a concise address.`,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join('') || "";
    
    // Extract map link from grounding metadata
    let mapLink: string | undefined;
    let sourceTitle: string | undefined;
    
    const chunks = candidate?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.maps?.uri) {
           mapLink = chunk.maps.uri;
           sourceTitle = chunk.maps.title;
           break; 
        }
      }
    }

    return { text: text.trim(), mapLink, sourceTitle };
  } catch (error) {
    console.error("Gemini Location Search Error:", error);
    // Return the original query as fallback text so the UI doesn't break
    return { text: query };
  }
};

export const findCharityEvents = async (location: string): Promise<any[]> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 3 recent or upcoming charity/volunteering events near ${location}. Return a JSON array where each object has: title, location, category (Environment, Charity, Medical), and a brief description.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    
    // Parse the JSON response
    try {
      const events = JSON.parse(text);
      return Array.isArray(events) ? events : [];
    } catch (e) {
      console.error("Failed to parse charity events JSON", e);
      return [];
    }
  } catch (error) {
    console.error("Gemini Charity Search Error:", error);
    return [];
  }
};
