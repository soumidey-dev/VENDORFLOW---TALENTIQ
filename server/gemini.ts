/**
 * Server-Side Gemini API Service for Invoice OCR & Multi-Modal Understanding
 * Uses @google/genai TypeScript SDK safely on server with gemini-3.6-flash.
 */

import { GoogleGenAI, Type } from "@google/genai";

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "MISSING_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export interface ExtractedInvoiceFields {
  invoiceNumber: string;
  vendorName: string;
  vendorGSTIN: string;
  poNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotalINR: number;
  taxGSTPercent: number;
  totalAmountINR: number;
  confidencePercent: number;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPriceINR: number;
    totalINR: number;
  }>;
}

export async function extractInvoiceDataWithGemini(
  base64Data?: string,
  mimeType: string = "application/pdf",
  rawText?: string
): Promise<ExtractedInvoiceFields> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured on the server. Please add GEMINI_API_KEY in Settings > Secrets.");
  }

  if (!base64Data && !rawText) {
    throw new Error("No document base64 file data or text payload was provided for extraction.");
  }

  const ai = getAIClient();

  const promptText = `You are an expert B2B Invoice Audit OCR Parser. Analyze the provided document (PDF, image, or text) and extract invoice information strictly matching the requested JSON schema.

CRITICAL NON-NEGOTIABLE INSTRUCTIONS:
1. Extract ONLY information explicitly present in the document.
2. DO NOT FABRICATE, GUESS, OR INVENT missing information.
3. If a field is missing, unreadable, or not printed on the document, set string values to "Not detected", set missing dates to "Not detected", set empty arrays for line items if none found, and set numbers to 0 if missing.
4. Specifically:
   - poNumber: Extract exact Purchase Order number (e.g., "PO-2026-8821"). If not printed on invoice, set strictly to "Not detected".
   - vendorName: Extract exact vendor name printed on invoice or "Not detected".
   - vendorGSTIN: Extract 15-character GSTIN/Tax ID or "Not detected".
   - invoiceNumber: Extract Tax Invoice Number or "Not detected".
   - bankDetails: Extract beneficiary accountName, accountNumber, ifscCode, bankName, branch if printed on invoice. If bank details are not present, set each field to "Not detected".
   - confidencePercent: Rate document readability and OCR extraction confidence score as a number between 0 and 100.`;

  const contentsParts: any[] = [];
  if (base64Data) {
    contentsParts.push({ inlineData: { mimeType: mimeType || "application/pdf", data: base64Data } });
  } else if (rawText) {
    contentsParts.push({ text: rawText });
  }
  contentsParts.push({ text: promptText });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: contentsParts
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          invoiceNumber: { type: Type.STRING },
          vendorName: { type: Type.STRING },
          vendorGSTIN: { type: Type.STRING },
          poNumber: { type: Type.STRING },
          invoiceDate: { type: Type.STRING },
          dueDate: { type: Type.STRING },
          subtotalINR: { type: Type.NUMBER },
          taxGSTPercent: { type: Type.NUMBER },
          totalAmountINR: { type: Type.NUMBER },
          confidencePercent: { type: Type.NUMBER },
          bankDetails: {
            type: Type.OBJECT,
            properties: {
              accountName: { type: Type.STRING },
              accountNumber: { type: Type.STRING },
              ifscCode: { type: Type.STRING },
              bankName: { type: Type.STRING },
              branch: { type: Type.STRING }
            }
          },
          lineItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unitPriceINR: { type: Type.NUMBER },
                totalINR: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });

  const rawJson = response.text || "";
  if (!rawJson) {
    throw new Error("Gemini AI returned empty content for document extraction.");
  }

  const parsed = JSON.parse(rawJson) as ExtractedInvoiceFields;

  // Sanitize and ensure fallbacks for missing nested structures
  return {
    invoiceNumber: parsed.invoiceNumber || "Not detected",
    vendorName: parsed.vendorName || "Not detected",
    vendorGSTIN: parsed.vendorGSTIN || "Not detected",
    poNumber: parsed.poNumber || "Not detected",
    invoiceDate: parsed.invoiceDate || "Not detected",
    dueDate: parsed.dueDate || "Not detected",
    subtotalINR: typeof parsed.subtotalINR === "number" ? parsed.subtotalINR : 0,
    taxGSTPercent: typeof parsed.taxGSTPercent === "number" ? parsed.taxGSTPercent : 0,
    totalAmountINR: typeof parsed.totalAmountINR === "number" ? parsed.totalAmountINR : 0,
    confidencePercent: typeof parsed.confidencePercent === "number" ? parsed.confidencePercent : 80,
    bankDetails: {
      accountName: parsed.bankDetails?.accountName || "Not detected",
      accountNumber: parsed.bankDetails?.accountNumber || "Not detected",
      ifscCode: parsed.bankDetails?.ifscCode || "Not detected",
      bankName: parsed.bankDetails?.bankName || "Not detected",
      branch: parsed.bankDetails?.branch || "Not detected"
    },
    lineItems: Array.isArray(parsed.lineItems) ? parsed.lineItems.map(item => ({
      description: item.description || "Not detected",
      quantity: typeof item.quantity === "number" ? item.quantity : 0,
      unitPriceINR: typeof item.unitPriceINR === "number" ? item.unitPriceINR : 0,
      totalINR: typeof item.totalINR === "number" ? item.totalINR : 0
    })) : []
  };
}

