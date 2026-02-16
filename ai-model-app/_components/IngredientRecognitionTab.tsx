" use client";
import { useState, useEffect } from "react";
import { Sparkles, FileText } from "lucide-react";
import { useTheme } from "../ContextProviders/ThemeProvider";
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
      console.log("reply", reply);
      console.log("reply", reply);
    } catch (error) {
      console.log(error);
    }
  };
  const splitted = raw.split(" ")
  console.log(splitted)
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
          rows={8}
          className={`no-scrollbar scroll-smooth resize-none p-2 focus:outline-none w-full aspect-7/2 rounded-2xl inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-500/50"}`}
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
          {raw}
        </div>
      </div>
    </>
  );
};
