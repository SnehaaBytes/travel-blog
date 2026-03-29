import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { messages, system } = req.body;

    console.log("🔥 Request received");

    // ✅ Step 1: Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "messages array is required",
      });
    }

    // ✅ Step 2: Convert messages into Gemini format
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content || "" }],
    }));

    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return res.status(400).json({
        error: "Last message is empty",
      });
    }

    // ✅ Step 3: Create model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        system || "You are a helpful travel assistant.",
    });

    // ✅ Step 4: Start chat
    const chat = model.startChat({
      history,
    });

    // ✅ Step 5: Send message to Gemini
    const result = await chat.sendMessage(lastMessage);

    const text = result?.response?.text();

    console.log("✅ AI Response:", text);

    // ✅ Step 6: Send response back
    res.json({
      content: [
        {
          type: "text",
          text: text || "No response from AI",
        },
      ],
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
});

export default router;