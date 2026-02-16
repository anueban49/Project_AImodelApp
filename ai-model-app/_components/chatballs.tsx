" use client";
import { useState, useEffect, ReactEventHandler } from "react";
import { ReactNode } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { MessageCircle, X } from "lucide-react";
import { Assistant } from "./Assistant";
//flow: use sends message -> sent to ai model

export interface ChatBubble {
  role: "model" | "user";
  content: string;
}

export const ChatBalls = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  function toggle() {
    setOpen((prev) => !prev);
  }
  return (
    <div className="w-full h-full">
      <button
        onClick={() => {
          toggle();
        }}
        className={`absolute ${open ? "hidden" : "bottom-0 right-0"}  ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"} hover:bottom-2 ease-in duration-300 
            w-10 aspect-square p-2 rounded-full 5 shadow-md  hover:bg-gray-100 `}
      >
        <MessageCircle />
      </button>
      {open ? (
        <Assistant>
          <button
            onClick={() => {
              toggle();
            }}
            className={`${theme === "dark" ? "shadow-black" : " shadow-gray-300"} scale-80 shadow-sm p-2 rounded-full hover:bg-gray-500 ease-in-out duration-300`}
          >
            <X strokeWidth={1} className="scale-80" />
          </button>
        </Assistant>
      ) : (
        <></>
      )}
    </div>
  );
};
