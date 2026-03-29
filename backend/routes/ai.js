import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body;

    console.log("🔥 AI route hit —", messages?.length, "messages");

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: { message: "messages array is required" } });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: max_tokens || 2000,
      system: system || "You are a helpful travel assistant.",
      messages: messages,
    });

    console.log("✅ Anthropic responded successfully");
    res.json(response);

  } catch (err) {
    console.error("❌ Anthropic API error:", err.message);
    res.status(500).json({
      error: { message: err.message }
    });
  }
});

export default router;