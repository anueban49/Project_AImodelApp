import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
const rateLimit = new Map<string, number>();
export async function POST(req: Request) {
  const { prompt } = await req.json();
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const last = rateLimit.get(ip) ?? 0;

    if (now - last < 2 * 60 * 1000) {
      return NextResponse.json({ error: "Request is limited to 1 per 2 mins" }, { status: 429 });
    }

    rateLimit.set(ip, now);
    const result = await openai.images.generate({
      prompt,
      model: "gpt-image-1.5",
      size: "1024x1024",
      quality: "medium",
    });

    if (result && result.data && result.data.length > 0) {
      const base64 = result.data[0].b64_json;
      return NextResponse.json({ image: base64 });
    }

    return NextResponse.json({ error: "No image generated" }, { status: 400 });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
