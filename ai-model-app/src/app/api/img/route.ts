import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API key issue" }, { status: 500 });
    }
    const { prompt } = (await request.json()) as { prompt: string };
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        systemInstruction:
          "Generate an image according to user prompt and keep the aspect to 4/3",
      },
    });
    if (response.ok) {
      console.log("response seem to be okay");
    }
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
        return NextResponse.json({
          success: true,
          image: imageData,
          mimeType: part.inlineData.mimeType || "image/png",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "failed to process image" },
      { status: 500 },
    );
  }
};
