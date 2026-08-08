import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { extractInvoiceDataWithGemini } from "./server/gemini.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "20mb" }));

  // API Routes First
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "VendorFlow Autonomous AP Engine" });
  });

  // Server-side AI Extraction Endpoint
  app.post("/api/analyze-invoice", async (req, res) => {
    try {
      const { base64Data, mimeType, rawText } = req.body;
      const extractedFields = await extractInvoiceDataWithGemini(base64Data, mimeType, rawText);
      res.json({ success: true, data: extractedFields });
    } catch (error: any) {
      console.error("Error analyzing invoice:", error);
      res.status(500).json({ success: false, error: error?.message || "Failed to analyze invoice" });
    }
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== "production") {
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VendorFlow] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
