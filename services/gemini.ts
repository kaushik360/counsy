import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Lazy initialization helper
let aiInstance: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
  if (aiInstance) return aiInstance;

  try {
    // Safely retrieve API key
    let apiKey = '';
    
    // Check process.env (Standard/Node/Webpack)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    } 
    // Check import.meta.env (Vite)
    else if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_KEY) {
      apiKey = (import.meta as any).env.VITE_API_KEY;
    }
    
    // Initialize client (even with empty key, though calls might fail later)
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
    return null;
  }
};

// --- Chat with Counselor ---
export const getCounselorResponse = async (history: ChatMessage[], userMessage: string, userName: string = 'Friend'): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) return "I'm having trouble connecting right now. Please try again later.";

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

    return response.text || "I'm here for you. Could you tell me more?";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm having a little trouble connecting right now. But I'm listening—how are you?";
  }
};

// --- Quick Mood Insight ---
export const getMoodInsight = async (mood: string): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) return "Remember to take care of yourself today.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user is feeling "${mood}". Give a 1-sentence supportive insight or micro-tip for a student.`,
    });
    return response.text || "Take a deep breath and keep going.";
  } catch (e) {
    return "Remember to take care of yourself today.";
  }
};

// --- Journal Analysis ---
export const analyzeJournalEntry = async (text: string) => {
  try {
    const ai = getAiClient();
    if (!ai) throw new Error("AI Client not initialized");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this student journal entry: "${text}". 
      Return JSON with the following keys:
      1. moodSummary: A concise summary of the emotional tone (e.g., 'Feeling generally positive with some notes of stress').
      2. productivityInsight: An observation about productivity based on the text (e.g., 'You seem most productive on days you focus on Routine tasks').
      3. recommendations: An array of 1-2 short, actionable wellness or study recommendations.`,
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
    console.error("Journal Analysis Error", error);
    return {
      moodSummary: "Entry saved.",
      productivityInsight: "Keep tracking your thoughts to spot patterns.",
      recommendations: ["Take a deep breath.", "Stay consistent."]
    };
  }
};