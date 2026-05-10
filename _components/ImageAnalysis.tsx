" use client";
import {
  Sparkles,
  LoaderCircle,
  FileText,
  FileInput,
  X,
  FileUpIcon,
} from "lucide-react";
import { useState} from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { LoadingVisual } from "./LoadingVisual";
export const ImageAnalysisTab = () => {
  const { theme } = useTheme();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerate = async (file: File) => {
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    });
    try {
      setLoading(true);
      if (!file) {
        return;
      }
      const res = await fetch("/api/imganalysis", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ base64Image, mimeType: file.type }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
        console.log("result", data);
      }
    } catch (error) {
      console.log(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="flex gap-4 font-bold">
          <Sparkles />
          Image Analysis Section
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
                      if (file) {
                        handleGenerate(file);
                        setClicked(true);
                      }
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
                Choose the image you want to analyze or simply drag and drop it
                here
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
          Image Analysis Result
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
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : result ? (
                  <>
                    {result.split("\n").map((line, i) => (
                      <p key={i} className={line === "" ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </>
                ) : (
                  <></>
                )}
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
