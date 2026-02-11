"use client";
import { useState, useRef, ReactEventHandler } from "react";
import { FileUpIcon, Sparkle, Sparkles, X } from "lucide-react";
import { FileText } from "lucide-react";
import { FileInput } from "lucide-react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { pipeline } from "@huggingface/transformers";
type ActiveBtn = "Image analysis" | "Ingredient recognition" | "Image creator";

const buttons: ActiveBtn[] = [
  "Image analysis",
  "Ingredient recognition",
  "Image creator",
];

export function SoligddogTovcuud() {
  const [active, setActive] = useState<ActiveBtn>("Image analysis");
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const inputRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const { theme } = useTheme();

  const handleFile = (file: File) => {
    //essentially reads the file that has been put into the input and converts it into a string?
    if (!file.type.startsWith("image/")) {
      return;
    }
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  const clear = () => {
    setPreview(null);
    setFilename(null);
  };
  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (!inputRef.current) {
        inputRef.current = await pipeline(
          "image-to-text",
          "Xenova/vit-gpt2-image-captioning",
        );
      }

      const output = await inputRef.current(preview);

      if (Array.isArray(output) && output.length > 0) {
        const caption = (output[0] as { generated_text: string })
          .generated_text;
        setResult(caption);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const ZuragAnaliiz = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <h1 className="flex gap-4 font-bold">
            <Sparkles />
            Хараад Мэдэхгүй байгаа зургаа танюулдаг хэсэг
          </h1>

          <div
            onClick={() => {
              inputRef.current?.click();
            }}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault;
              clear();
            }}
            className={`w-full aspect-5/2 inset-shadow-sm relative overflow-hidden rounded-2xl flex flex-col gap-4 justify-center items-center ${theme === "dark" ? "dark inset-shadow-sm inset-shadow-black" : "light inset-shadow-gray-500/50"}`}
          >
            {preview ? (
              <>
                <img src={preview} className="object-cover object-center" />
                <button
                  className={`p-2 rounded-full aspect-square absolute top-2 right-2 hover:opacity-55 ${theme === "dark" ? "dark " : "light "}`}
                  onClick={() => {
                    clear();
                  }}
                >
                  <X />
                </button>
                <button
                  onClick={() => {
                    handleGenerate;
                  }}
                  className={`uploadBtn
                    p-2 text-sm rounded-2xl flex gap-2 absolute bottom-2 hover:opacity-55  shadow-md ${theme === "dark" ? "dark shadow-black" : "light  shadow-gray-400"}`}
                >
                  <FileUpIcon />
                </button>
              </>
            ) : (
              <>
                <input
                  onChange={handleChange}
                  type="file"
                  accept="image/*"
                  className=" text-transparent w-full h-full absolute"
                />
                <p
                  className={`text-gray-400 ${theme === "dark" && "text-zinc-700"}`}
                >
                  Oruulah zurga songood iishee huscih
                </p>
                <FileInput
                  width={40}
                  height={40}
                  strokeWidth="1.5px"
                  color="gray"
                  className="opacity-50"
                />
              </>
            )}
          </div>
          <h1 className="flex font-bold gap-4">
            <FileText />
            Yu yu bn
          </h1>
          <p>{result}</p>
        </div>
      </>
    );
  };

  const RenderContent = () => {
    switch (active) {
      case "Image analysis":
        return <ZuragAnaliiz />;
      case "Ingredient recognition":
        return <>Орц танюулах</>;
      case "Image creator":
        return <>Зураг гаргах</>;
      default:
        return <></>;
    }
  };

  return (
    <>
      <div
        className={`w-full h-10 grid grid-cols-3 gap-2 inset-shadow-sm rounded-full p-0.5 bg-gray-100 ${theme === "dark" ? "dark inset-shadow-none" : "light inset-shadow-gray-300"}`}
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
    </>
  );
}
