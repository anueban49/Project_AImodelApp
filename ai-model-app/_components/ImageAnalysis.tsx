" use client";
import {
  Sparkles,
  LoaderCircle,
  FileText,
  FileInput,
  X,
  FileUpIcon,
} from "lucide-react";
import { useState, useRef } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { pipeline, TextStreamer } from "@huggingface/transformers";
import { LoadingVisual } from "./LoadingVisual";
export const ImageAnalysisTab = () => {
  const { theme } = useTheme();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<any>(null);

  const handleFile = (file: File) => {
    //essentially reads the file that has been put into the input and converts it into a string?
    if (!file.type.startsWith("image/")) {
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  const clear = () => {
    setPreview(null);
    setFile(null);
    setResult("");
    setClicked(false);
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

      const output = await inputRef.current(preview, {
        max_new_tokens: 100,
        temperature: 0.7,
        context: "give me more detailed response",
          num_sms: 4,
      });

      if (Array.isArray(output) && output.length > 0) {
        const caption = (output[0] as { generated_text: string })
          .generated_text;
        setResult(caption);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="flex gap-4 font-bold">
          <Sparkles />
          Robotond zurag ogood taniuldag heseg
        </h1>

        <div
          onDragOver={(e) => {
            e.preventDefault();
          }}
          className={`w-full aspect-5/2 inset-shadow-sm relative overflow-hidden rounded-2xl flex flex-col gap-4 justify-center items-center ${theme === "dark" ? "dark inset-shadow-sm inset-shadow-black" : "light inset-shadow-gray-500/50"}`}
        >
          {preview ? (
            <>
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  <p>Loading...</p>
                </>
              ) : (
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
                      handleGenerate();
                      setClicked(true);
                    }}
                    className={`uploadBtn ${clicked && "hidden"}
                    p-2 text-sm rounded-2xl flex gap-2 absolute bottom-2 hover:opacity-55  shadow-md ${theme === "dark" ? "dark shadow-black" : "light  shadow-gray-400"}`}
                  >
                    <FileUpIcon />
                  </button>
                </>
              )}
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
          Robotiin hariu(?)
        </h1>
        {clicked ? (
          <>
            {loading ? (
              <>
                <LoadingVisual />
              </>
            ) : (
              <p
                className={`py-2 px-4 rounded-xl inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-300"}`}
              >
                {result ? <>{result}...?</> : <></>}
              </p>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
