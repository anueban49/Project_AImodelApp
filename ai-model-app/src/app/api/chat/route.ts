import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    ("api key error");
  }
  try {
    const { chats } = await request.json();
    const messages = [chats];
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "APIKEY issue",
        },
        { status: 500 },
      );
    }
    const ai = new GoogleGenAI({ apiKey });

    const history = messages.slice(0, -1).map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
      config: {
        systemInstruction:
          "You are a professional specialized in culinary. Respond to user messages diligent and friendly",
      },
    });

    const lastMessage = messages[messages.length - 1];

    const response = await chat.sendMessage(lastMessage);

    const assistantMsg = response.text || "Error";

    return NextResponse.json({ message: assistantMsg });
  } catch (e) {
    console.error(e);
  }
};
