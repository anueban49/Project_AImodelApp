"use client";
import { useEffect, useState } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { Sparkles, FileText } from "lucide-react";
export const ImageGenerationTab = () => {
  const [image, setImage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { theme } = useTheme();

  const handleGenerate = async () => {
    try {
      if (inputValue === "") {
        return;
      }
      const userprompt = inputValue.trim();

      const res = await fetch("/api/img", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ prompt: userprompt }),
      });
      //the ai is supposedly have to send url... right?
      const data = await res.json();
      if (data.success) {
        setImage(`data:${data.mimeType};base64${data.image}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className={`flex flex-col gap-4`}>
        <p
          className={`${theme === "dark" ? "" : ""} flex gap-4 py-2 font-bold`}
        >
          <Sparkles />
          Image Generation
        </p>
        <textarea
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          rows={8}
          className={` w-full aspect-9/1 rounded-2xl inset-shadow-sm p-2 resize-none no-scrollbar ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-500/50"}`}
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
        {image ? (
          <div className={`w-full aspect-4/3 rounded-2xl overflow-clip`}>
            <img src={image} />
          </div>
        ) : (
          <>No Image Generated</>
        )}
      </div>
    </>
  );
};
