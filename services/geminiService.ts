import { GoogleGenAI, Type } from "@google/genai";
import { type DrugMonograph } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    drugName: { type: Type.STRING },
    drugClassAndCategory: {
      type: Type.OBJECT,
      properties: {
        pharmacologicalClass: { type: Type.STRING },
        therapeuticCategory: { type: Type.STRING },
      },
      required: ['pharmacologicalClass', 'therapeuticCategory']
    },
    introduction: { type: Type.STRING },
    mechanismOfAction: { type: Type.ARRAY, items: { type: Type.STRING } },
    therapeuticUses: {
      type: Type.OBJECT,
      properties: {
        fdaApproved: { type: Type.ARRAY, items: { type: Type.STRING } },
        globalGuidelines: { type: Type.ARRAY, items: { type: Type.STRING } },
        offLabel: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['fdaApproved', 'globalGuidelines', 'offLabel']
    },
    adverseDrugReactions: {
      type: Type.OBJECT,
      properties: {
        common: { type: Type.ARRAY, items: { type: Type.STRING } },
        serious: { type: Type.ARRAY, items: { type: Type.STRING } },
        rare: { type: Type.ARRAY, items: { type: Type.STRING } },
        blackBoxWarning: { type: Type.STRING, nullable: true },
      },
      required: ['common', 'serious', 'rare', 'blackBoxWarning']
    },
    interactions: {
      type: Type.OBJECT,
      properties: {
        drugDrug: { type: Type.ARRAY, items: { type: Type.STRING } },
        drugFood: { type: Type.ARRAY, items: { type: Type.STRING } },
        drugHerbal: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['drugDrug', 'drugFood', 'drugHerbal']
    },
    pharmacokinetics: {
      type: Type.OBJECT,
      properties: {
        absorption: { type: Type.STRING },
        distribution: { type: Type.STRING },
        metabolism: { type: Type.STRING },
        excretion: { type: Type.STRING },
        halfLife: { type: Type.STRING },
        bioavailability: { type: Type.STRING },
      },
      required: ['absorption', 'distribution', 'metabolism', 'excretion', 'halfLife', 'bioavailability']
    },
    pharmacodynamics: {
      type: Type.OBJECT,
      properties: {
        pathway: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ['pathway']
    },
    dosageInformation: {
      type: Type.OBJECT,
      properties: {
        adult: { type: Type.STRING },
        pediatric: { type: Type.STRING },
        adjustments: { type: Type.STRING },
      },
       required: ['adult', 'pediatric', 'adjustments']
    },
    routesOfAdministration: { type: Type.ARRAY, items: { type: Type.STRING } },
    commonBrandsInPakistan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          company: { type: Type.STRING },
          strengths: { type: Type.STRING },
        },
        required: ['brandName', 'company', 'strengths']
      },
    },
    clinicalCases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          case: { type: Type.STRING },
          solution: { type: Type.STRING },
        },
        required: ['case', 'solution'],
      },
    },
    counsellingTips: {
        type: Type.OBJECT,
        properties: {
            generalTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            timeOfAdministration: { type: Type.STRING },
            vehicle: { type: Type.STRING },
            withFood: { type: Type.STRING },
            foodsToAvoid: { type: Type.STRING },
        },
        required: ['generalTips', 'timeOfAdministration', 'vehicle', 'withFood', 'foodsToAvoid']
    },
    references: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'drugName', 'drugClassAndCategory', 'introduction', 
    'mechanismOfAction', 'therapeuticUses', 'adverseDrugReactions', 'interactions',
    'pharmacokinetics', 'pharmacodynamics', 'dosageInformation', 'routesOfAdministration',
    'commonBrandsInPakistan', 'clinicalCases', 'counsellingTips', 'references'
  ]
};


export const generateDrugMonograph = async (drugName: string): Promise<DrugMonograph> => {
  const systemInstruction = `You are an expert medical writer and pharmacologist specializing in creating drug reference materials. Your task is to generate a complete, medically accurate, copyright-free, and SEO-friendly drug monograph based on latest international guidelines (2024-2025). The language must be simple, clear, and professional. The output must be a structured JSON object. For 'mechanismOfAction' and 'pharmacodynamics.pathway', provide a simplified, step-by-step pathway as an array of strings, suitable for creating a visual flowchart. For 'counsellingTips', provide concise, practical advice for a patient. For 'references', provide full, direct URLs to high-authority sources like DrugBank, PubMed (ncbi.nih.gov), or official FDA/EMA drug labels. If a section has no information, provide an appropriate empty value (e.g., null for strings, empty array for lists).`;
  
  const prompt = `Generate a complete drug monograph for the following drug: "${drugName}".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("API returned an empty response for monograph.");
    }
    
    const cleanedJson = jsonText.replace(/^```json\s*|```\s*$/g, '');
    
    const parsedData = JSON.parse(cleanedJson);
    return parsedData as DrugMonograph;

  } catch (error) {
    console.error("Error calling Gemini API for monograph:", error);
    throw new Error(`Failed to generate monograph for ${drugName}.`);
  }
};


export const generateDrugImage = async (drugName: string): Promise<string> => {
    const prompt = `Generate a high-quality, photorealistic, copyright-free image of a generic pharmaceutical product packaging for "${drugName}". The box and blister pack should look professional and clinical. Do not include any real brand names or logos, but you can use the generic drug name on the box. Show the product on a clean, minimalist, white background.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error calling Gemini API for image:", error);
        throw new Error(`Failed to generate image for ${drugName}.`);
    }
};

// FIX: Implement and export the missing calculateIndividualDose function.
export const calculateIndividualDose = async (drugName: string, age: number, weight: number): Promise<string> => {
    const systemInstruction = `You are an expert clinical pharmacist. Your task is to calculate a suggested drug dose based on the provided patient information. The output should be a clear, concise statement about the suggested dose, including the rationale if applicable (e.g., based on weight). You must include a clear disclaimer that this is not medical advice and a healthcare professional should be consulted. Do not return JSON.`;
    
    const prompt = `Calculate the dose for ${drugName} for a patient who is ${age} years old and weighs ${weight} kg. Provide a brief explanation.`;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });
  
      const text = response.text;
      if (!text) {
        throw new Error("API returned an empty response for dose calculation.");
      }
      
      return text.trim();
  
    } catch (error) {
      console.error("Error calling Gemini API for dose calculation:", error);
      throw new Error(`Failed to calculate dose for ${drugName}.`);
    }
  };