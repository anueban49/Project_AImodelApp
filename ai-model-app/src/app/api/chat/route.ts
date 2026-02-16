import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;

  try {
    const { chats } = await request.json() as {chats: Message[]};

    console.log("Chats", chats)

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "APIKEY issue",
        },
        { status: 500 },
      );
    }
    const ai = new GoogleGenAI({ apiKey });

    const history = chats.slice(0, -1).map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history,
      config: {
        systemInstruction:
          "You are a service assistant, professional specialized in culinary. Respond to user messages brief and simple, under 30 words, in a friendly amnner",
        temperature: 1.5,
  
      },
    });

    const lastMessage = chats[chats.length - 1];

    const response = await chat.sendMessage({ message: lastMessage.content });

    const assistantMsg = response.text || "Error";

    return NextResponse.json({ message: assistantMsg });
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
};
