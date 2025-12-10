import { GoogleGenAI } from "@google/genai";
import { ReflectionEntry, TriggerEntry, AccomplishmentEntry } from "../types";

const apiKey = process.env.API_KEY || '';

// Safely initialize API client
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateLeadershipInsights = async (
  reflections: ReflectionEntry[],
  triggers: TriggerEntry[],
  accomplishments: AccomplishmentEntry[]
): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please add your Gemini API key to the environment variables to generate insights.";
  }

  // Filter for last 30 days to keep context relevant
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentReflections = reflections.filter(r => new Date(r.date) > thirtyDaysAgo);
  const recentTriggers = triggers.filter(t => new Date(t.timestamp) > thirtyDaysAgo);
  const recentAccomplishments = accomplishments.filter(a => new Date(a.date) > thirtyDaysAgo);

  if (recentReflections.length === 0 && recentTriggers.length === 0 && recentAccomplishments.length === 0) {
    return "Please add some entries to generate insights.";
  }

  const prompt = `
    You are a leadership coach. Analyze the following entries from a user's leadership development log for the past 30 days.
    
    Reflections:
    ${JSON.stringify(recentReflections.map(r => ({ date: r.date, category: r.category, content: r.content })))}
    
    Emotional Triggers:
    ${JSON.stringify(recentTriggers.map(t => ({ date: t.timestamp, trigger: t.trigger, notes: t.notes })))}
    
    Accomplishments:
    ${JSON.stringify(recentAccomplishments.map(a => ({ date: a.date, title: a.title })))}

    Provide a brief, encouraging, and constructive summary (approx 150 words). 
    Highlight 1 key strength demonstrated and 1 area for growth.
    Format the response in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI service.";
  }
};