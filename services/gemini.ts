import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Declare process to avoid TypeScript "Cannot find name" error in browser/Vite environments
declare const process: any;

// Lazy initialization helper
let aiInstance: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
  if (aiInstance) return aiInstance;

  try {
    // Safely retrieve API key
    let apiKey = '';
    
    // 1. Check import.meta.env (Vite) - Primary for Vercel
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const env = (import.meta as any).env;
      // Prioritize VITE_API_KEY
      if (env.VITE_API_KEY) {
        apiKey = env.VITE_API_KEY;
      } else if (env.API_KEY) {
        apiKey = env.API_KEY;
      }
    }
    
    // 2. Fallback: Check process.env (Standard/Node) if not found yet
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY || process.env.VITE_API_KEY;
    }

    // Clean the key (remove whitespace)
    if (apiKey) apiKey = apiKey.trim();

    // If no key is found, return null to trigger Mock Mode
    if (!apiKey) {
      console.warn("Counsy: No API Key found. Running in Demo/Mock mode.");
      return null;
    }

    // Initialize client
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
    return null;
  }
};

// --- Helper: Mock Responses ---
const getMockChatResponse = async (userMessage: string, userName: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
      
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return `Hello ${userName}! I'm running in Demo Mode right now (connection issue), but I'm still here to listen. How are you feeling?`;
    } else if (lowerMsg.includes('sad') || lowerMsg.includes('depressed') || lowerMsg.includes('lonely')) {
      return "I'm sorry you're feeling this way. Remember, this feeling is temporary, and you are stronger than you know. (Demo Response)";
    } else if (lowerMsg.includes('anxious') || lowerMsg.includes('stress')) {
      return "Take a deep breath with me. Inhale... Exhale. Focus on this moment. You've got this. (Demo Response)";
    } else if (lowerMsg.includes('thank')) {
      return "You're very welcome! I'm glad I could help.";
    }
    return "I hear you, and I understand. I'm operating in offline mode currently, but I want you to know your feelings are valid. Tell me more?";
};

// --- Chat with Counselor ---
export const getCounselorResponse = async (history: ChatMessage[], userMessage: string, userName: string = 'Friend'): Promise<string> => {
  const ai = getAiClient();
  
  // MOCK MODE: If no client available
  if (!ai) {
    return getMockChatResponse(userMessage, userName);
  }

  try {
    // REAL AI MODE
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are a compassionate, empathetic, and professional student wellness counselor named "Counsy AI".
      Your goal is to provide emotional support, stress management tips, and academic motivation.
      
      The user's full name is "${userName}". Address them by their name occasionally to create a personal connection.
      
      User's message: "${userMessage}"
      
      Instructions:
      - Always identify yourself as "Counsy AI" if asked.
      - Keep responses warm, short (under 60 words), and conversational.
      - Validate feelings first.
      - Offer actionable advice if appropriate.
      - Do not diagnose medical conditions.
      - Use emojis sparingly but effectively to be friendly.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (!response.text) throw new Error("Empty response from AI");

    return response.text;
  } catch (error) {
    console.error("AI Chat Error (Falling back to Demo Mode):", error);
    // Graceful fallback to mock response if API fails (e.g., 401, Quota, Network)
    return getMockChatResponse(userMessage, userName);
  }
};

// --- Quick Mood Insight ---
export const getMoodInsight = async (mood: string): Promise<string> => {
  const ai = getAiClient();
  const mockResponse = "Remember to take care of yourself today. (Offline Tip)";
  
  if (!ai) return mockResponse;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user is feeling "${mood}". Give a 1-sentence supportive insight or micro-tip for a student.`,
    });
    return response.text || mockResponse;
  } catch (e) {
    console.error("Mood Insight Error:", e);
    return mockResponse;
  }
};

// --- Journal Analysis ---
export const analyzeJournalEntry = async (text: string) => {
  const ai = getAiClient();
  
  const mockAnalysis = {
    moodSummary: "Reflective (Demo Analysis - Connection Failed)",
    productivityInsight: "Writing helps clear the mind.",
    recommendations: ["Take a deep breath.", "Stay consistent."]
  };

  if (!ai) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return mockAnalysis;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this student journal entry: "${text}". 
      Return JSON with the following keys:
      1. moodSummary: A concise summary of the emotional tone.
      2. productivityInsight: An observation about productivity.
      3. recommendations: An array of 1-2 short, actionable wellness recommendations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            moodSummary: { type: Type.STRING },
            productivityInsight: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Journal Analysis Error:", error);
    return mockAnalysis;
  }
};