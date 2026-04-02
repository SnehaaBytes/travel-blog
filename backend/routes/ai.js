import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", apiKey ? apiKey.slice(0, 8) + "..." : "MISSING");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      messages[messages.length - 1].content
    );

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;