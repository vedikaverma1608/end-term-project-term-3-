import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "dummy");

export const generateEventDescription = async (title, category) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY.includes('your_')) {
    throw new Error('Gemini API key is not configured. Please add it to your .env file.');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Write a compelling, engaging, and professional event description for an event titled "${title}" in the "${category}" category. The description should be 2 to 3 paragraphs long, highlight the value of attending, and be suitable for a community hub platform. Do not include placeholder brackets like [Date] or [Location], keep it general. Output plain text, no markdown.`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
