" use client";
import { useState, useEffect } from "react";
import { Sparkles, FileText } from "lucide-react";
import { useTheme } from "../ContextProviders/ThemeProvider";
export const IngredientRecTab = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <div className={`flex flex-col gap-4`}>
        {" "}
        <h1 className="flex gap-4 font-bold">
          <Sparkles />
          Ingredient recognition
        </h1>
        <textarea
          placeholder="Describe your ingredients "
          rows={8}
          className={`no-scrollbar scroll-smooth resize-none p-2 focus:outline-none w-full aspect-7/2 rounded-2xl inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-500/50"}`}
        ></textarea>
        <button
          className={`self-end transition w-1/7 px-4 py-1.5 rounded-2xl shadow-md hover:shadow-none ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"}`}
        >
          Generate
        </button>
      </div>
      <div></div>
    </>
  );
};
