" use client";
import { useState, useEffect, ReactEventHandler } from "react";
import { ReactNode } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { MessageCircle } from "lucide-react";
//flow: use sends message -> sent to ai model
export function msgBox({ children }: { children: ReactNode }) {
  //takes user message and displays it.
  return (
    <>
      <div className={`rounded-2xl p-2`}>{children}</div>
    </>
  );
}
type msgtype = {
  messages: string[];
};
type chatHistorType = {
  role: "ai" | "user";
  chats: msgtype[];
};
const saveMsgs = sessionStorage.setItem;
export const ChatBalls = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [msgs, setMsgs] = useState<chatHistorType>([]);
  const saved: msgtype = sessionStorage.getItem("chatHistory");
  saved ? setMsgs(saved) : [];
  const ChathesegOngoihHaah = () => {
    setOpen((prev) => !prev);
  };
  function Messaaj() {
    return (
      <>
        <div
          className={` ${open ? "chatOngoi" : "hidden "} absolute right-5 bottom-18 
            w-1/4 aspect-2/3 rounded-2xl shadow-sm ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"}`}
        >
          <div className="absolute bottom-2 w-full px-2">
            <input
              type="text"
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  console.log("typed");
                }
              }}
              placeholder="Enter daraad chataa yvuul"
              className={`
                w-full  rounded-2xl border-transparent px-3 py-2 focus:outline-none inset-shadow-sm  ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-300"}`}
            ></input>
          </div>
          <div className="msgcontent"></div>
        </div>
      </>
    );
  }

  return (
    <div className="w-screen h-screen">
      <Messaaj />
      <button
        onClick={() => {
          ChathesegOngoihHaah();
        }}
        className={` ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"} hover:bottom-6 ease-in duration-100
            w-10 aspect-square p-2 rounded-full absolute right-5 bottom-5 shadow-md  hover:bg-gray-100`}
      >
        <MessageCircle />
      </button>
    </div>
  );
};
