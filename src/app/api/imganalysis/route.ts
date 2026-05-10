import OpenAI from "openai";
import { NextResponse } from "next/server";
const openai = new OpenAI();
const rateLimit = new Map<string, number>();
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const last = rateLimit.get(ip) ?? 0;

    if (now - last < 2 * 60 * 1000) {
      return NextResponse.json(
        { error: "Request is limited to 1 per 2 mins" },
        { status: 429 },
      );
    }

    rateLimit.set(ip, now);
    
    const { base64Image, mimeType } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const result = await openai.responses.create({
      model: "o4-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_image",
              detail: "auto",
              image_url: `data:${mimeType};base64,${base64Image}`,
            },
            {
              type: "input_text",
              text: "Analyse the image and describe its content",
            },
          ],
        },
      ],
      instructions: "Analyse the image and describe its content",
    });
    const textContent =
      result.output
        .find((item) => item.type === "message")
        ?.content?.find((c) => c.type === "output_text")?.text ?? "No result";

    return NextResponse.json({ result: textContent });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 },
    );
  }
}
