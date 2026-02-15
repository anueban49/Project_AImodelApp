" use client";
import { useState, useEffect, ReactEventHandler } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { MessageCircle } from "lucide-react";
//flow: use sends message -> sent to ai model

interface ChatBubble {
  role: "model" | "user";
  content: string;
}

interface MessaajProps {
  open: boolean;
}

export function Messaaj({ open }: MessaajProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState<string | "">("");
  const [chats, setChats] = useState<ChatBubble[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (input: string) => {
    const userChat = input.trim();
    console.log(userChat);
    if (!userChat) {
      return;
    }
    setLoading(true);
    setChats((prev) => [...prev, { role: "user", content: userChat }]);
    setInputValue("");
    const newUserChat = { role: "user" as const, content: userChat };
    const updatedChats = [...chats, newUserChat]
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({chats: updatedChats}),
      });
      console.log(response);
      if (!response.ok) {
        console.log("response not ok");
        return;
      }
      const data = await response.json();
      setChats((prev) => [...prev, { role: "model", content: data.message }]);
    } catch (e) {
      console.error(e);
      setChats((prev) => [
        ...prev,
        {
          role: "model",
          content: "Sorry something went wrong, please try again",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className={` ${open ? "chatOngoi" : "hidden"} absolute right-5 bottom-18 
            w-1/4 aspect-2/3 rounded-2xl shadow-sm ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"}`}
      >
        <div
          className={`p-2 w-full h-full flex flex-col gap-1.5 overflow-y-scroll no-scrollbar ${theme === "dark" ? "dark" : "light"}`}
        >
          {chats.map((chat, index) => (
            <div
              className={` p-2 rounded-2xl text-sm ${chat.role === "user" ? "justify-self-end bg-gray-200" : "justify-start bg-gray-500"}`}
              key={index}
            >
              {chat.content}
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 w-full px-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              placeholder="type anything..."
              className={`
                w-full  rounded-2xl border-transparent px-3 py-2 focus:outline-none inset-shadow-sm  ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-300"}`}
            ></input>
            <button
              disabled={loading}
              onClick={() => {
                handleSend(inputValue);
              }}
              className={`px-2 py-1 rounded-2xl text-sm shadow-md ${theme === "dark" ? "dark shdaow-black" : "light shadow-gray-300"} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Send
            </button>
          </div>
        </div>
        <div className="msgcontent"></div>
      </div>
    </>
  );
}
export const ChatBalls = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string | "">("");
  const [chats, setChats] = useState<ChatBubble[]>([]);
  const [usermsg, setuUsermsg] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
    console.log(open);
  };

  return (
    <div className="w-screen h-screen">
      <Messaaj open={open} />
      <button
        onClick={() => {
          toggle();
        }}
        className={` ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"} hover:bottom-6 ease-in duration-100
            w-10 aspect-square p-2 rounded-full absolute right-5 bottom-5 shadow-md  hover:bg-gray-100`}
      >
        <MessageCircle />
      </button>
    </div>
  );
};
