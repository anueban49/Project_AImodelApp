"use client";
import { useEffect, useState } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { Sparkles, FileText } from "lucide-react";
export const ImageGenerationTab = () => {
  const [image, setImage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { theme } = useTheme();

  const handleGenerate = async () => {
    const res = await "/api/chat";
  };
  return (
    <>
      <div className={`flex flex-col gap-4`}>
        <p className={`${theme === "dark" ? "dark" : "light"}`}>
          <Sparkles />
          Image Generation
        </p>
        <textarea
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          rows={8}
          className={` w-full aspect-9/1 rounded-2xl inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-500/50"}`}
          placeholder="Describe your prompt"
        ></textarea>
        <button
          onClick={() => {
            handleGenerate();
          }}
          className={`px-4 py-1.5 rounded-2xl shadow-md hover:shadow-none  ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"}`}
        >
          Generate
        </button>
        <div></div>
      </div>
    </>
  );
};
