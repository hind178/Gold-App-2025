import { GoogleGenAI } from "@google/genai";
import type { NewsArticle, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you would want to handle this more gracefully.
  // For this example, we assume it is set.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const fetchGoldMarketNews = async (): Promise<{ analysis: string, articles: NewsArticle[] }> => {
  try {
    const prompt = `
      Provide a brief, one-paragraph market analysis for gold today. 
      Then, list the top 3 most relevant news headlines about the gold market from the last 24 hours. 
      For each headline, provide a one-sentence summary.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const analysis = response.text;
    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const articles: NewsArticle[] = groundingChunks.map(chunk => ({
        title: chunk.web.title || "Untitled Article",
        summary: "Source from Google Search.",
        url: chunk.web.uri,
    })).filter(article => article.url);

    // Deduplicate articles based on URL
    const uniqueArticles = Array.from(new Map(articles.map(item => [item['url'], item])).values());
    
    return { analysis, articles: uniqueArticles };

  } catch (error) {
    console.error("Error fetching gold market news:", error);
    throw new Error("Failed to fetch market analysis. Please check your API key and network connection.");
  }
};