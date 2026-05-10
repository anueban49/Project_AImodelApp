"use client";
import { ReactNode, useState } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { ChatBubble } from "./chatballs";
import { LoadingVisual } from "./LoadingVisual";
//this component has to handle all the chat assitant conversation.

export const Assistant = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState<string | "">("");
  const [chats, setChats] = useState<ChatBubble[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (input: string) => {
    const userChat = input.trim();
    if (!userChat) {
      return;
    }
    setLoading(true);
    setChats((prev) => [...prev, { role: "user", content: userChat }]);
    setInputValue("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          chats: [...chats, { role: "user", content: userChat }],
        }),
      });
      if (!response.ok) {
        console.log("response not ok");
      }
      const data = await response.json();
      console.log(data);
      console.log(response);
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
        className={`w-2/5 absolute right-0 bottom-[-40%] chatAnimation
           aspect-2/3 rounded-2xl shadow-sm ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"}`}
      >
        <div
          className={`w-full h-10 flex gap-4 rounded-t-2xl justify-between items-center`}
        >
          <p className={`px-5 py-1 ${theme === "dark" ? "dark" : "light"}`}>
            AI Assistant
          </p>
          <div className={`chatCloseAnimation`}>{children}</div>
        </div>
        <div
          className={`w-full rounded-2xl h-full ${theme === "dark" ? "dark" : "light"} flex justify-center align-center`}
        >
          <div
            className={`w-[95%] h-[85%] inset-shadow-sm rounded-2xl p-2 overflow-y-scroll no-scrollbar flex flex-col gap-2 rounded-b-2xl ${theme === "dark" ? "bg-zinc-800 inset-shadow-black" : "light inset-shadow-gray-300"}`}
          >
            {chats.length > 0 ? (
              <>
                {chats.map((chat, index) => (
                  <div
                    className={` p-2 rounded-2xl w-fit text-sm felc flex-col inset-shadow-sm ${chat.role === "user" ? "self-end bg-gray-200 inset-shadow-gray-500/50" : "justify-start bg-gray-500 text-white inset-shadow-gray-700/50"}`}
                    key={index}
                  >
                    {loading ? (
                      <>
                        {chat.role === "model" && (
                          <>
                            <LoadingVisual />
                          </>
                        )}
                      </>
                    ) : (
                      <>{chat.content}</>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div
                  className={`h-full w-full flex flex-col justify-center items-center text-sm text-gray-400`}
                >
                  <p>Hello, there.</p>
                  <p>How may I assist you?</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div
          className={`absolute bottom-0 w-full rounded-b-2xl p-2 ${theme === "dark" ? "dark" : "light"}`}
        >
          <div className={`flex gap-2`}>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(inputValue);
                }
              }}
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
      </div>
    </>
  );
};
