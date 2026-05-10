"use client";
import { useState, useRef, ReactEventHandler } from "react";

import { useTheme } from "../ContextProviders/ThemeProvider";
import { ChatBalls } from "./chatballs";
import { ImageAnalysisTab } from "./ImageAnalysis";
import { IngredientRecTab } from "./IngredientRecognitionTab";
import { ImageGenerationTab } from "./ImageGenerationTab";
type ActiveBtn = "Image analysis" | "Ingredient recognition" | "Image creator";

const buttons: ActiveBtn[] = [
  "Image analysis",
  "Ingredient recognition",
  "Image creator",
];

export const test = () => {
  
}

export function SoligddogTovcuud() {
  const [active, setActive] = useState<ActiveBtn>("Image analysis");

  const { theme } = useTheme();

  const RenderContent = () => {
    switch (active) {
      case "Image analysis":
        return <ImageAnalysisTab />;
      case "Ingredient recognition":
        return <IngredientRecTab />;
      case "Image creator":
        return <ImageGenerationTab />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <div
        className={`w-full h-10 grid grid-cols-3 gap-2 inset-shadow-sm rounded-full p-0.5 bg-gray-100 ${theme === "dark" ? "dark inset-shadow-none" : "bg-gray-100 inset-shadow-gray-300"}`}
      >
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={`py-1 px-4 rounded-full ease-in duration-300 hover:shadow-md ${theme === "dark" && "text-gray-400"} ${active === btn && " bg-white shadow-md"} ${active === btn && theme === "dark" && "btndark text-white"}`}
            onClick={() => {
              setActive(btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>
      <RenderContent />
      <ChatBalls />
    </>
  );
}
