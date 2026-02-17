" use client";
import { useState, useEffect } from "react";
import { Sparkles, FileText } from "lucide-react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { LoadingVisual } from "./LoadingVisual";
export const IngredientRecTab = () => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { theme } = useTheme();
  const [reply, setReply] = useState<string[] | null>(null);
  const [raw, setRaw] = useState<string>("");

  const handleGenerate = async () => {
    if (!reply) {
      setReply(null);
    }
    const input = inputValue.trim();

    if (!input) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/text", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) {
        console.log("res not ok [ingredient desc]");
      }
      const data = await res.json();
      console.log("the thingy tht i converted into json:", data);
      setRaw(data.res);
      setReply(raw.split(" "));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const splitted = raw.split("\n");
  console.log(splitted);
  const boldtext = splitted.filter(
    (item) => item.startsWith("**") && item.endsWith("**"),
  );

  // sort the items in array that has
  return (
    <>
      <div className={`flex flex-col gap-4`}>
        <h1 className="flex gap-4 font-bold">
          <Sparkles />
          Ingredient recognition
        </h1>
        <textarea
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Describe your ingredients "
          rows={5}
          className={`no-scrollbar scroll-smooth resize-none p-2 focus:outline-none w-full rounded-2xl inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-500/50"}`}
        ></textarea>
        <button
          onClick={() => {
            handleGenerate();
          }}
          className={`self-end transition w-1/7 px-4 py-1.5 rounded-2xl shadow-md hover:shadow-none ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"}`}
        >
          Generate
        </button>
        <div
          className={`aspect-7/1 rounded-2xl inset-shadow-sm p-2 ${theme === "dark" ? "dark inset-shadow=-black" : "light inset-shadow-gray-300"}`}
        >
          <p className="font-bold">Ingredients:</p>
          {loading ? (
            <LoadingVisual />
          ) : (
            <div className={`flex flex-col gap-2`}>
              {splitted.map((line, index) => {
                const isBold = line.startsWith("**") && line.endsWith("**");
                const cleanedLine = line.replace(/\*\*/g, ""); // removes ALL ** from the line

                return (
                  <p key={index} className={isBold ? "font-bold" : ""}>
                    {cleanedLine}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
