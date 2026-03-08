
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCandidateAnalysis(candidate: Candidate) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Berikan analisis singkat dan motivasi dalam Bahasa Indonesia untuk kandidat ketua himpunan teknik berikut:
      Nama: ${candidate.name}
      Visi: ${candidate.vision}
      Misi: ${candidate.mission}
      
      Berikan respon dalam bentuk paragraf singkat (maks 50 kata) yang menyemangati pemilih.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Analisis tidak tersedia saat ini.";
  }
}
