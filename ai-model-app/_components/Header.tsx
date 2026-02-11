"use client";
import { Eclipse, Moon } from "lucide-react";
import { useTheme } from "../ContextProviders/ThemeProvider";
export function Header() {
  const { toggleTheme, theme } = useTheme();
  return (
    <>
      <div className={`w-full  rounded-full h-10 flex px-5 py-2 justify-between items-center shadow-md ${theme === "dark" ? "dark inset-shadow-black inset-shadow-sm" : "light"}`}>
        <p className="text-xl font-bold transition">Киймэл Оюун Ухаанд Суурьлсан Кирэгсэл</p>
        <button
          className={`p-2 hover:bg-gray-200 rounded-full transition `}
          onClick={() => {
            toggleTheme();
          }}
        >
          {theme === "light" ? <Moon/> : <Eclipse color="white" />}
        </button>
      </div>
    </>
  );
}
