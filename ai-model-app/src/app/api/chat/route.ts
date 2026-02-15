import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }
  try {
    const { chats } = await request.json();
    console.log(chats);

    const ai = new GoogleGenAI({ apiKey });
    const history = chats.slice(0, -1).map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
      config: {
        systemInstruction:
          "You are a professional specialized in culinary. Respond to user messages in friendly manner",
      },
    });
    const lastMessage = chats[chats.length - 1];

    const response = await chat.sendMessage({
      message: lastMessage.content,
    });

    const assistantMsg = response.text || "Error";

    return NextResponse.json({ message: assistantMsg });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
};
