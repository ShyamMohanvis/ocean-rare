import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: 'A cinematic ocean scene',
    });
    console.log(response);
  } catch(e) {
    console.error("Error generating video:", e);
  }
}
test();
