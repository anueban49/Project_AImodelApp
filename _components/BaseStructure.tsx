"use client";
import type { ReactNode } from "react";
import { useTheme } from "../ContextProviders/ThemeProvider";
import { Header } from "./Header";
export const BaseStructure = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  return (
    <div
      data-theme={theme}
      className="w-full h-full flex flex-col justify-center align-center gap-2 py-10"
    >
      <Header></Header>
      {children}
    </div>
  );
};
